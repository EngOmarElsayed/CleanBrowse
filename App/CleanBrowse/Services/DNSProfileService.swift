import AppKit
import NetworkExtension
import Observation
import SystemExtensions

/// Manages the CleanBrowse DNS Proxy network extension for system-wide domain blocking.
///
/// `DNSProfileService` activates and manages the bundled DNS Proxy extension that intercepts
/// all DNS queries on the system. When a blocked domain is queried (any record type, including
/// Type 65 HTTPS/SVCB), the extension returns NXDOMAIN, preventing Safari and all other apps
/// from resolving the domain.
///
/// ### How It Works
///
/// 1. The main app writes the blocklist to a shared App Group container (`group.com.omarelsayed.cleanbrowse`)
/// 2. The DNS Proxy extension reads the blocklist and intercepts all DNS queries
/// 3. Blocked domains get NXDOMAIN for ALL query types (A, AAAA, HTTPS, etc.)
/// 4. Non-blocked domains are forwarded to the upstream DNS server (`8.8.8.8`)
///
/// ### Why This Is Needed
///
/// Safari sends Type 65 (HTTPS/SVCB) DNS queries that bypass `/etc/hosts`.
/// Sites behind Cloudflare (like `substack.com`) have Type 65 records that let Safari
/// resolve real IPs even when `/etc/hosts` maps the domain to `127.0.0.1`.
/// The DNS Proxy intercepts ALL query types, closing this bypass.
@Observable
@MainActor
final class DNSProfileService: NSObject {

    /// The most recent error message, or `nil` if the last operation succeeded.
    var lastError: String?

    /// Whether the DNS proxy is currently active.
    var isProxyActive: Bool = false

    /// Whether an activation/deactivation is in progress.
    var isInstalling: Bool = false
    
    /// Whether the system extension is installed.
    var isExtensionInstalled: Bool = false

    /// The bundle identifier of the DNS Proxy extension.
    private let proxyBundleIdentifier = "com.omarelsayed.cleanbrowse.proxy"

    /// The Darwin notification name used to tell the DNS extension to reload.
    private static let reloadNotification = "com.omarelsayed.cleanbrowse.blocklistUpdated" as CFString
    
    /// Continuation for async extension installation.
    private var installationContinuation: CheckedContinuation<Void, Error>?

    // MARK: - Blocklist Management

    /// Posts a Darwin notification to tell the DNS Proxy extension to reload.
    private func notifyExtension() {
        CFNotificationCenterPostNotification(
            CFNotificationCenterGetDarwinNotifyCenter(),
            CFNotificationName(Self.reloadNotification),
            nil,
            nil,
            true
        )
        NSLog("[CleanBrowse] Posted reload notification to DNS extension")
    }

    /// The blocklist directory under the user's Application Support.
    private static let sharedBlocklistDir: URL = {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        return appSupport.appendingPathComponent("CleanBrowse")
    }()

    /// Returns the blocklist URL, creating the parent directory if needed.
    private func blocklistURL() -> URL? {
        let dir = Self.sharedBlocklistDir
        if !FileManager.default.fileExists(atPath: dir.path) {
            do {
                try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
            } catch {
                lastError = "Failed to create blocklist directory: \(error.localizedDescription)"
                NSLog("[CleanBrowse] Failed to create blocklist directory: \(error)")
                return nil
            }
        }
        return dir.appendingPathComponent("blocklist.txt")
    }

    /// Writes the blocklist to ~/Library/Application Support/CleanBrowse/blocklist.txt.
    ///
    /// Also stores the absolute file path in the shared App Group UserDefaults so the
    /// DNS proxy (running as root) can locate it.
    ///
    /// - Parameter domains: Array of domain strings to block.
    func writeBlocklist(_ domains: [String]) {
        guard let blocklistURL = blocklistURL() else { return }

        let content = domains.joined(separator: "\n")
        do {
            try content.write(to: blocklistURL, atomically: true, encoding: .utf8)
            NSLog("[CleanBrowse] Wrote \(domains.count) domains to \(blocklistURL.path)")
            notifyExtension()
        } catch {
            lastError = "Failed to write blocklist: \(error.localizedDescription)"
            NSLog("[CleanBrowse] Failed to write blocklist: \(error)")
        }
    }

    /// Appends a single domain to the existing blocklist file.
    ///
    /// - Parameter domain: The domain to add to the blocklist.
    func appendToBlocklist(_ domain: String) {
        guard let blocklistURL = blocklistURL() else { return }

        do {
            let fileHandle = try FileHandle(forWritingTo: blocklistURL)
            fileHandle.seekToEndOfFile()
            if let data = "\n\(domain)".data(using: .utf8) {
                fileHandle.write(data)
            }
            fileHandle.closeFile()
            NSLog("[CleanBrowse] Appended \(domain) to blocklist")
            notifyExtension()
        } catch {
            do {
                try domain.write(to: blocklistURL, atomically: true, encoding: .utf8)
                NSLog("[CleanBrowse] Created blocklist with \(domain)")
                notifyExtension()
            } catch {
                lastError = "Failed to append to blocklist: \(error.localizedDescription)"
                NSLog("[CleanBrowse] Failed to append to blocklist: \(error)")
            }
        }
    }

    // MARK: - System Extension Installation
    
    /// Requests installation of the system extension.
    private func installSystemExtension() async throws {
        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            self.installationContinuation = continuation
            
            let request = OSSystemExtensionRequest.activationRequest(
                forExtensionWithIdentifier: proxyBundleIdentifier,
                queue: .main
            )
            request.delegate = self
            OSSystemExtensionManager.shared.submitRequest(request)
            
            NSLog("[CleanBrowse] Submitted system extension activation request")
        }
    }

    // MARK: - DNS Proxy Activation

    /// Activates the DNS Proxy extension.
    ///
    /// This loads the DNS proxy manager configuration and enables it.
    /// The user will be prompted by macOS to allow the network extension
    /// in **System Settings → Privacy & Security → Network Extensions**.
    func activateProxy() async {
        isInstalling = true
        lastError = nil
        
        do {
            // Step 1: Install the system extension
            try await installSystemExtension()
            isExtensionInstalled = true
            NSLog("[CleanBrowse] System extension installed successfully")
            
            // Step 2: Activate the DNS proxy
            try await activateDNSProxy()
            isProxyActive = true
            NSLog("[CleanBrowse] DNS proxy activated successfully")
        } catch {
            lastError = "Failed to install/activate: \(error.localizedDescription)"
            NSLog("[CleanBrowse] Failed to install/activate: \(error)")
        }
        
        isInstalling = false
    }
    
    /// Internal method to activate the DNS proxy after extension is installed.
    private func activateDNSProxy() async throws {
        let manager = NEDNSProxyManager.shared()
        try await manager.loadFromPreferences()

        let providerProtocol = NEDNSProxyProviderProtocol()
        providerProtocol.providerBundleIdentifier = proxyBundleIdentifier

        manager.providerProtocol = providerProtocol
        manager.isEnabled = true

        try await manager.saveToPreferences()
        try await manager.loadFromPreferences()
    }

    /// Checks the current status of the DNS proxy.
    func checkProxyStatus() async {
        do {
            let manager = NEDNSProxyManager.shared()
            try await manager.loadFromPreferences()
            isProxyActive = manager.isEnabled
            NSLog("[CleanBrowse] DNS proxy status: \(isProxyActive ? "active" : "inactive")")
        } catch {
            isProxyActive = false
            NSLog("[CleanBrowse] Failed to check proxy status: \(error)")
        }
    }

    /// Deactivates the DNS Proxy extension.
    func deactivateProxy() async {
        do {
            let manager = NEDNSProxyManager.shared()
            try await manager.loadFromPreferences()
            manager.isEnabled = false
            try await manager.saveToPreferences()
            isProxyActive = false
            NSLog("[CleanBrowse] DNS proxy deactivated")
        } catch {
            lastError = "Failed to deactivate DNS proxy: \(error.localizedDescription)"
            NSLog("[CleanBrowse] Failed to deactivate proxy: \(error)")
        }
    }
}
// MARK: - OSSystemExtensionRequestDelegate
extension DNSProfileService: OSSystemExtensionRequestDelegate {
    nonisolated func request(_ request: OSSystemExtensionRequest, actionForReplacingExtension existing: OSSystemExtensionProperties, withExtension ext: OSSystemExtensionProperties) -> OSSystemExtensionRequest.ReplacementAction {
        NSLog("[CleanBrowse] Replacing existing extension \(existing.bundleIdentifier) with \(ext.bundleIdentifier)")
        return .replace
    }
    
    nonisolated func requestNeedsUserApproval(_ request: OSSystemExtensionRequest) {
        NSLog("[CleanBrowse] System extension needs user approval - check System Settings → Privacy & Security → Network Extensions")
    }
    
    nonisolated func request(_ request: OSSystemExtensionRequest, didFinishWithResult result: OSSystemExtensionRequest.Result) {
        NSLog("[CleanBrowse] System extension request finished with result: \(result.rawValue)")
        
        Task { @MainActor in
            switch result {
            case .completed:
                self.installationContinuation?.resume()
            case .willCompleteAfterReboot:
                self.installationContinuation?.resume(throwing: NSError(
                    domain: "DNSProfileService",
                    code: 1,
                    userInfo: [NSLocalizedDescriptionKey: "System extension will be available after reboot"]
                ))
            @unknown default:
                self.installationContinuation?.resume()
            }
            self.installationContinuation = nil
        }
    }
    
    nonisolated func request(_ request: OSSystemExtensionRequest, didFailWithError error: Error) {
        NSLog("[CleanBrowse] System extension request failed: \(error)")
        
        Task { @MainActor in
            self.installationContinuation?.resume(throwing: error)
            self.installationContinuation = nil
        }
    }
}

