//
//  HostsFileService.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import Foundation

actor HostsFileService {
    var lastError: String?
    var isWriting: Bool = false

    private let hostsPath = "/etc/hosts"
    private let markerStart = "# CleanBrowse START"
    private let markerEnd = "# CleanBrowse END"
    private let safeSearchMarkerStart = "# CleanBrowse SafeSearch START \n"
    private let safeSearchMarkerEnd   = "# CleanBrowse SafeSearch END"
}

// MARK: - Domain Blocking
extension HostsFileService {
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
        writeToHosts(content: newContent)
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

        // Skip if already present
        if currentContent.contains(newEntries) { return }

        // Insert new entries right before the END marker
        guard let endRange = currentContent.range(of: markerEnd) else {
            lastError = "CleanBrowse block not found in /etc/hosts."
            return
        }
        let newContent = currentContent.replacingCharacters(
            in: endRange,
            with: newEntries + markerEnd
        )

        writeToHosts(content: newContent)
    }
}

// MARK: - SafeSearch
extension HostsFileService {
    func applySafeSearch(for value: SafeSearchEntrie? = nil) async throws {
        isWriting = true
        lastError = nil
        defer { isWriting = false }

        let entries: [SafeSearchEntrie]
        if let value {
            entries = [value]
        } else {
            entries = SafeSearchEntrie.allEntries
        }

        // Read existing hosts file
        let currentContent: String = try await readCurrentHostContentFile()

        var safeSearchContentBlock: String = ""
        for entry in entries {
            guard let hostValue = entry.hostEntry else { continue }
            guard currentContent.contains(hostValue) == false else { continue }
            safeSearchContentBlock += "\n " + hostValue
        }

        // Replace or append the SafeSearch block
        let newContent: String
        if let endRange = currentContent.range(of: safeSearchMarkerEnd) {
            newContent = currentContent.replacingCharacters(in: endRange, with: safeSearchContentBlock + safeSearchMarkerEnd)
        } else {
            newContent = currentContent.trimmingCharacters(in: .newlines)
                + "\n\n" + safeSearchMarkerStart + safeSearchContentBlock + safeSearchMarkerEnd + "\n"
        }

        writeToHosts(content: newContent)
    }
    
    func removeSafeSearch(for value: SafeSearchEntrie) async throws {
        isWriting = true
        lastError = nil
        defer { isWriting = false }

        var newContent: String = try await readCurrentHostContentFile()
        guard let hostValue = value.hostEntry else { return }

        var safeSearchContentToRemove: String = ""
        safeSearchContentToRemove = "\n " + hostValue

        if let startRange = newContent.range(of: safeSearchContentToRemove) {
            newContent.removeSubrange(startRange)
        }

        writeToHosts(content: newContent)
    }
    
    func removeAllSafeSearchFeatures() async throws {
        isWriting = true
        lastError = nil
        defer { isWriting = false }

        var newContent: String = try await readCurrentHostContentFile()

        if let startRange = newContent.range(of: safeSearchMarkerStart),
           let endRange = newContent.range(of: safeSearchMarkerEnd) {
            
            // Combine into a single full range from the start of the first marker to the end of the second marker
            let fullRange = startRange.lowerBound..<endRange.upperBound
            
            // Delete that section from the string
            newContent.removeSubrange(fullRange)
        }

        writeToHosts(content: newContent)
    }
}

// MARK: - Private
private extension HostsFileService {
    private func readCurrentHostContentFile() async throws -> String {
        do {
            return try String(contentsOfFile: hostsPath, encoding: .utf8)
        } catch {
            lastError = "Failed to read /etc/hosts: \(error.localizedDescription)"
            throw error
        }
    }

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
    private func writeToHosts(content: String) {
        // Write to a temp file first, then copy with admin privileges
        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("cleanbrowse_hosts_\(UUID().uuidString)")

        do {
            try content.write(to: tempURL, atomically: true, encoding: .utf8)
        } catch {
            lastError = "Failed to write temp file: \(error.localizedDescription)"
        }

        let tempPath = tempURL.path

        // Run osascript off the main actor so waitUntilExit doesn't block UI,
        // and so the temp file survives until the admin dialog completes.
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
                    lastError = "Admin password required to modify blocked sites."
                } else {
                    lastError = "Failed to write hosts file: \(errorStr)"
                }
            }
        } catch {
            try? FileManager.default.removeItem(at: tempURL)
            lastError = "Failed to run privileged command: \(error.localizedDescription)"
        }
    }
}
