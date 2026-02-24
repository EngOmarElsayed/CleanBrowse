import AppKit
import NetworkExtension
import Observation

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
final class DNSProfileService {

    /// The most recent error message, or `nil` if the last operation succeeded.
    var lastError: String?

    /// Whether the DNS proxy is currently active.
    var isProxyActive: Bool = false

    /// Whether an activation/deactivation is in progress.
    var isInstalling: Bool = false

    /// The bundle identifier of the DNS Proxy extension.
    private let proxyBundleIdentifier = "com.omarelsayed.cleanbrowse.CleanBrowse.DNSProxy"

    /// The App Group identifier shared between the main app and the DNS extension.
    private let appGroupIdentifier = "group.com.omarelsayed.cleanbrowse"

    /// The Darwin notification name used to tell the DNS extension to reload.
    private static let reloadNotification = "com.omarelsayed.cleanbrowse.blocklistUpdated" as CFString

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

    /// Writes the blocklist to the shared App Group container.
    ///
    /// The DNS Proxy extension reads this file to determine which domains to block.
    /// Each domain is written on a separate line, plain text, one domain per line.
    ///
    /// - Parameter domains: Array of domain strings to block.
    func writeBlocklist(_ domains: [String]) {
        guard let containerURL = FileManager.default.containerURL(
            forSecurityApplicationGroupIdentifier: appGroupIdentifier
        ) else {
            lastError = "Failed to access App Group container."
            NSLog("[CleanBrowse] Failed to access App Group container")
            return
        }

        let blocklistURL = containerURL.appendingPathComponent("blocklist.txt")
        let content = domains.joined(separator: "\n")

        do {
            try content.write(to: blocklistURL, atomically: true, encoding: .utf8)
            NSLog("[CleanBrowse] Wrote \(domains.count) domains to shared blocklist")
            notifyExtension()
        } catch {
            lastError = "Failed to write blocklist: \(error.localizedDescription)"
            NSLog("[CleanBrowse] Failed to write blocklist: \(error)")
        }
    }

    /// Appends a single domain to the existing blocklist file.
    ///
    /// This is an optimized path for user-added custom domains. Instead of rewriting
    /// the entire ~249K domain list, it appends one line to the existing file.
    ///
    /// - Parameter domain: The domain to add to the blocklist.
    func appendToBlocklist(_ domain: String) {
        guard let containerURL = FileManager.default.containerURL(
            forSecurityApplicationGroupIdentifier: appGroupIdentifier
        ) else {
            lastError = "Failed to access App Group container."
            return
        }

        let blocklistURL = containerURL.appendingPathComponent("blocklist.txt")

        do {
            let fileHandle = try FileHandle(forWritingTo: blocklistURL)
            fileHandle.seekToEndOfFile()
            if let data = "\n\(domain)".data(using: .utf8) {
                fileHandle.write(data)
            }
            fileHandle.closeFile()
            NSLog("[CleanBrowse] Appended \(domain) to shared blocklist")
            notifyExtension()
        } catch {
            // File might not exist yet — fall back to creating it
            do {
                try domain.write(to: blocklistURL, atomically: true, encoding: .utf8)
                NSLog("[CleanBrowse] Created shared blocklist with \(domain)")
            } catch {
                lastError = "Failed to append to blocklist: \(error.localizedDescription)"
                NSLog("[CleanBrowse] Failed to append to blocklist: \(error)")
            }
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
        defer { isInstalling = false }

        do {
            let manager = NEDNSProxyManager.shared()
            try await manager.loadFromPreferences()

            let providerProtocol = NEDNSProxyProviderProtocol()
            providerProtocol.providerBundleIdentifier = proxyBundleIdentifier

            manager.providerProtocol = providerProtocol
            manager.isEnabled = true

            try await manager.saveToPreferences()
            try await manager.loadFromPreferences()

            isProxyActive = true
            NSLog("[CleanBrowse] DNS proxy activated successfully")
        } catch {
            lastError = "Failed to activate DNS proxy: \(error.localizedDescription)"
            NSLog("[CleanBrowse] Failed to activate DNS proxy: \(error)")
        }
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
