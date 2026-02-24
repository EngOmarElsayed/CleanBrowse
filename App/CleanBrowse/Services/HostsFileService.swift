import Foundation
import Observation

/// The core blocking engine that manages the macOS `/etc/hosts` file.
///
/// `HostsFileService` provides system-level domain blocking by writing entries
/// to `/etc/hosts`. It maintains two independent marker blocks:
///
/// - **CleanBrowse block** (`# CleanBrowse START/END`): Contains ~249K adult domains
///   redirected to `127.0.0.1` / `::1`, plus any user-added custom domains.
/// - **SafeSearch block** (`# CleanBrowse SafeSearch START/END`): Contains search engine
///   domains redirected to their SafeSearch IPs (e.g., Google → `216.239.38.120`).
///
/// All writes to `/etc/hosts` require admin privileges and are performed via
/// `osascript` with `administrator privileges`, which triggers a system password dialog.
/// After each write, DNS caches are flushed to ensure changes take effect immediately.
///
/// > Important: The app sandbox must be **disabled** for this service to function,
/// > since `/etc/hosts` is a root-owned system file.
@Observable
@MainActor
final class HostsFileService {

    // MARK: - State

    /// The most recent error message, or `nil` if the last operation succeeded.
    var lastError: String?

    /// Whether a write operation is currently in progress.
    var isWriting: Bool = false

    // MARK: - Constants

    private let hostsPath = "/etc/hosts"
    private let markerStart = "# CleanBrowse START"
    private let markerEnd = "# CleanBrowse END"
    private let safeSearchMarkerStart = "# CleanBrowse SafeSearch START"
    private let safeSearchMarkerEnd   = "# CleanBrowse SafeSearch END"

    // MARK: - Read

    /// Reads the current set of blocked domains from the CleanBrowse block in `/etc/hosts`.
    ///
    /// Parses lines between the `# CleanBrowse START` and `# CleanBrowse END` markers,
    /// extracting domain names from entries that map to `127.0.0.1` or `::1`.
    ///
    /// - Returns: A set of domain strings currently blocked in the hosts file.
    ///   Returns an empty set if the file cannot be read or contains no CleanBrowse block.
    func domainsInHostsFile() -> Set<String> {
        guard let content = try? String(contentsOfFile: hostsPath, encoding: .utf8) else {
            return []
        }

        var domains = Set<String>()
        var inBlock = false

        for line in content.components(separatedBy: .newlines) {
            if line.trimmingCharacters(in: .whitespaces) == markerStart {
                inBlock = true
                continue
            }
            if line.trimmingCharacters(in: .whitespaces) == markerEnd {
                inBlock = false
                continue
            }
            if inBlock {
                let parts = line.trimmingCharacters(in: .whitespaces)
                    .components(separatedBy: .whitespaces)
                    .filter { !$0.isEmpty }
                if parts.count >= 2, (parts[0] == "127.0.0.1" || parts[0] == "::1") {
                    domains.insert(parts[1])
                }
            }
        }

        return domains
    }

    // MARK: - Write

    /// Performs a full rewrite of the CleanBrowse block in `/etc/hosts`.
    ///
    /// This method rebuilds the entire domain-blocking section from scratch.
    /// For each domain, it creates four entries:
    /// - `127.0.0.1 <domain>`
    /// - `::1 <domain>`
    /// - `127.0.0.1 www.<domain>` (auto-added if not already a `www.` domain)
    /// - `::1 www.<domain>`
    ///
    /// Domains are normalized and deduplicated before writing.
    /// If a CleanBrowse block already exists, it is replaced. Otherwise, a new block
    /// is appended to the end of the file.
    ///
    /// - Parameter domains: An array of domain strings to block. Each domain is
    ///   normalized via ``String/normalizedDomain`` before processing.
    ///
    /// > Note: This triggers an admin password dialog. Use ``addSingleDomain(_:)``
    /// > for adding individual domains without a full rewrite.
    func applyDomains(_ domains: [String]) async {
        isWriting = true
        lastError = nil
        defer { isWriting = false }

        // Build the CleanBrowse block
        // For each domain, block both the bare domain and www. variant (IPv4 + IPv6)
        var block = "\(markerStart)\n"
        var seen = Set<String>()
        for domain in domains {
            let normalized = domain.normalizedDomain
            guard !normalized.isEmpty, !seen.contains(normalized) else { continue }
            seen.insert(normalized)

            block += "127.0.0.1 \(normalized)\n"
            block += "::1 \(normalized)\n"

            // Auto-add www. variant if the domain doesn't already start with www.
            if !normalized.hasPrefix("www.") {
                let www = "www.\(normalized)"
                if !seen.contains(www) {
                    seen.insert(www)
                    block += "127.0.0.1 \(www)\n"
                    block += "::1 \(www)\n"
                }
            }
        }
        block += markerEnd

        // Read existing hosts file
        let currentContent: String
        do {
            currentContent = try String(contentsOfFile: hostsPath, encoding: .utf8)
        } catch {
            lastError = "Failed to read /etc/hosts: \(error.localizedDescription)"
            return
        }

        // Replace or append our block
        let newContent: String
        if let startRange = currentContent.range(of: markerStart),
           let endRange = currentContent.range(of: markerEnd) {
            let before = currentContent[currentContent.startIndex..<startRange.lowerBound]
            let after = currentContent[endRange.upperBound...]
            newContent = before + block + after
        } else {
            newContent = currentContent.trimmingCharacters(in: .newlines) + "\n\n" + block + "\n"
        }

        // Write via temp file + osascript with admin privileges
        let success = await writeToHosts(content: newContent)
        if !success {
            // lastError already set in writeToHosts
        }
    }

    /// Appends a single domain to the existing CleanBrowse block without rewriting the entire file.
    ///
    /// This is an optimized path for user-added custom domains. Instead of rebuilding
    /// all ~249K entries, it reads the current hosts file, inserts the new entries
    /// just before the `# CleanBrowse END` marker, and writes the modified file.
    ///
    /// The method is a no-op if the domain is already present in the hosts file.
    ///
    /// - Parameter domain: The domain to block. Normalized via ``String/normalizedDomain``.
    func addSingleDomain(_ domain: String) async {
        let normalized = domain.normalizedDomain
        guard !normalized.isEmpty else { return }

        isWriting = true
        lastError = nil
        defer { isWriting = false }

        // Skip if already present
        if domainsInHostsFile().contains(normalized) { return }

        // Read current hosts file
        let currentContent: String
        do {
            currentContent = try String(contentsOfFile: hostsPath, encoding: .utf8)
        } catch {
            lastError = "Failed to read /etc/hosts: \(error.localizedDescription)"
            return
        }

        // Build just the new entries
        var newEntries = "127.0.0.1 \(normalized)\n::1 \(normalized)\n"
        if !normalized.hasPrefix("www.") {
            let www = "www.\(normalized)"
            newEntries += "127.0.0.1 \(www)\n::1 \(www)\n"
        }

        // Insert new entries right before the END marker
        guard let endRange = currentContent.range(of: markerEnd) else {
            lastError = "CleanBrowse block not found in /etc/hosts."
            return
        }
        let newContent = currentContent.replacingCharacters(
            in: endRange,
            with: newEntries + markerEnd
        )

        let success = await writeToHosts(content: newContent)
        if !success {
            // lastError already set in writeToHosts
        }
    }

    // MARK: - SafeSearch (always on)

    /// Writes the SafeSearch enforcement block to `/etc/hosts`.
    ///
    /// Redirects search engine domains to their safe-search IPs:
    /// - **Google** (~190 country domains + `www.` variants) → `216.239.38.120`
    /// - **YouTube** (youtube.com, m.youtube.com, googleapis) → `216.239.38.120` (Restricted Mode)
    /// - **Bing** → `150.171.27.16` (Strict SafeSearch)
    /// - **DuckDuckGo** → `40.114.177.246` (Safe Search)
    ///
    /// SafeSearch is always on and cannot be toggled by the user.
    /// The SafeSearch block is independent from the domain-blocking block,
    /// so toggling or rewriting one does not affect the other.
    func applySafeSearch() async {
        isWriting = true
        lastError = nil
        defer { isWriting = false }

        // All engines, always
        let allEntries: [SafeSearchEntries.HostsEntry] =
            SafeSearchEntries.googleSafeSearch
            + SafeSearchEntries.youtubeRestrict
            + SafeSearchEntries.bingSafeSearch
            + SafeSearchEntries.duckDuckGoSafeSearch

        // Build the SafeSearch block
        var block = "\(safeSearchMarkerStart)\n"
        for entry in allEntries {
            block += "\(entry.ipv4) \(entry.domain)\n"
            if let ipv6 = entry.ipv6 {
                block += "\(ipv6) \(entry.domain)\n"
            }
        }
        block += safeSearchMarkerEnd

        // Read existing hosts file
        let currentContent: String
        do {
            currentContent = try String(contentsOfFile: hostsPath, encoding: .utf8)
        } catch {
            lastError = "Failed to read /etc/hosts: \(error.localizedDescription)"
            return
        }

        // Replace or append the SafeSearch block
        let newContent: String
        if let startRange = currentContent.range(of: safeSearchMarkerStart),
           let endRange = currentContent.range(of: safeSearchMarkerEnd) {
            let before = currentContent[currentContent.startIndex..<startRange.lowerBound]
            let after = currentContent[endRange.upperBound...]
            newContent = before + block + after
        } else {
            newContent = currentContent.trimmingCharacters(in: .newlines)
                + "\n\n" + block + "\n"
        }

        let success = await writeToHosts(content: newContent)
        if !success {
            // lastError already set in writeToHosts
        }
    }

    // MARK: - Private

    /// Writes the given content to `/etc/hosts` using a privileged `osascript` command.
    ///
    /// The write strategy:
    /// 1. Write content to a temp file
    /// 2. Use `osascript` with `administrator privileges` to `cp` the temp file to `/etc/hosts`
    /// 3. Flush DNS caches: `dscacheutil -flushcache`, `killall -HUP mDNSResponder`, `killall mDNSResponder`
    /// 4. Clean up the temp file
    ///
    /// The `osascript` call runs on a detached `Task` to avoid blocking the main actor
    /// while the admin password dialog is displayed.
    ///
    /// - Parameter content: The complete new content for `/etc/hosts`.
    /// - Returns: `true` if the write succeeded, `false` otherwise (``lastError`` is set).
    private func writeToHosts(content: String) async -> Bool {
        // Write to a temp file first, then copy with admin privileges
        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("cleanbrowse_hosts_\(UUID().uuidString)")

        do {
            try content.write(to: tempURL, atomically: true, encoding: .utf8)
        } catch {
            lastError = "Failed to write temp file: \(error.localizedDescription)"
            return false
        }

        let tempPath = tempURL.path

        // Run osascript off the main actor so waitUntilExit doesn't block UI,
        // and so the temp file survives until the admin dialog completes.
        let result: (success: Bool, error: String?) = await Task.detached {
            // Belt-and-suspenders DNS flush for all macOS versions:
            // 1. dscacheutil -flushcache  → clears Directory Services cache (all versions)
            // 2. killall -HUP mDNSResponder → signals reload (works on Sonoma/Sequoia and older)
            // 3. killall mDNSResponder → full kill, launchd auto-restarts (needed on Tahoe 26+)
            // 4. sleep 1 → gives launchd time to restart mDNSResponder
            let script = """
            do shell script "cp '\(tempPath)' /etc/hosts && dscacheutil -flushcache && killall -HUP mDNSResponder 2>/dev/null; killall mDNSResponder 2>/dev/null; sleep 1" with administrator privileges
            """

            let process = Process()
            process.executableURL = URL(fileURLWithPath: "/usr/bin/osascript")
            process.arguments = ["-e", script]

            let errorPipe = Pipe()
            process.standardError = errorPipe

            do {
                try process.run()
                process.waitUntilExit()

                // Clean up temp file after process is done
                try? FileManager.default.removeItem(at: tempURL)

                if process.terminationStatus != 0 {
                    let errorData = errorPipe.fileHandleForReading.readDataToEndOfFile()
                    let errorStr = String(data: errorData, encoding: .utf8) ?? "Unknown error"
                    if errorStr.contains("User canceled") || errorStr.contains("-128") {
                        return (false, "Admin password required to modify blocked sites.")
                    } else {
                        return (false, "Failed to write hosts file: \(errorStr)")
                    }
                }
                return (true, nil)
            } catch {
                try? FileManager.default.removeItem(at: tempURL)
                return (false, "Failed to run privileged command: \(error.localizedDescription)")
            }
        }.value

        if let error = result.error {
            lastError = error
        }
        return result.success
    }
}
