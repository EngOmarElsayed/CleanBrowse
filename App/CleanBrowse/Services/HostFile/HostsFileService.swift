//
//  HostsFileService.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import Foundation

actor HostsFileService {
    private let hostsPath = "/etc/hosts"
    private let markerStart = "# CleanBrowse START"
    private let markerEnd = "# CleanBrowse END"
    private let safeSearchMarkerStart = "# CleanBrowse SafeSearch START \n"
    private let safeSearchMarkerEnd   = "# CleanBrowse SafeSearch END"
}

// MARK: - Domain Blocking
extension HostsFileService {
    func applyDomains(_ domains: [String]) async throws {
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
        let currentContent = try readCurrentHostContentFile()
 
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
 
        try writeToHosts(content: newContent)
    }

    func addSingleDomain(_ domain: String) async throws {
        let normalized = domain.normalizedDomain
        guard !normalized.isEmpty else { return }
 
        // Read current hosts file
        let currentContent = try readCurrentHostContentFile()
 
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
            throw HostsFileError.blockNotFound
        }
        let newContent = currentContent.replacingCharacters(
            in: endRange,
            with: newEntries + markerEnd
        )
 
        try writeToHosts(content: newContent)
    }
}

// MARK: - SafeSearch
extension HostsFileService {
    func applySafeSearch(for value: SafeSearchEntrie? = nil) async throws {
        let entries: [SafeSearchEntrie]
        if let value {
            entries = [value]
        } else {
            entries = SafeSearchEntrie.allEntries
        }
 
        // Read existing hosts file
        let currentContent = try readCurrentHostContentFile()
 
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
 
        try writeToHosts(content: newContent)
    }
    
    func removeSafeSearch(for value: SafeSearchEntrie) async throws {
        var newContent = try readCurrentHostContentFile()
        guard let hostValue = value.hostEntry else { return }
 
        let safeSearchContentToRemove = "\n " + hostValue
 
        if let startRange = newContent.range(of: safeSearchContentToRemove) {
            newContent.removeSubrange(startRange)
        }
 
        try writeToHosts(content: newContent)
    }
    
    func removeAllSafeSearchFeatures() async throws {
        var newContent = try readCurrentHostContentFile()
 
        if let startRange = newContent.range(of: safeSearchMarkerStart),
           let endRange = newContent.range(of: safeSearchMarkerEnd) {
 
            // Combine into a single full range from the start of the first marker to the end of the second marker
            let fullRange = startRange.lowerBound..<endRange.upperBound
 
            // Delete that section from the string
            newContent.removeSubrange(fullRange)
        }
 
        try writeToHosts(content: newContent)
    }
}

// MARK: - Private
private extension HostsFileService {
    private func readCurrentHostContentFile() throws -> String {
        do {
            return try String(contentsOfFile: hostsPath, encoding: .utf8)
        } catch {
            throw error
        }
    }

    func writeToHosts(content: String) throws {
           // Write to a temp file first, then copy with admin privileges
           let tempURL = FileManager.default.temporaryDirectory
               .appendingPathComponent("cleanbrowse_hosts_\(UUID().uuidString)")
    
           do {
               try content.write(to: tempURL, atomically: true, encoding: .utf8)
           } catch {
               throw HostsFileError.tempFileWriteFailed(reason: error.localizedDescription)
           }
    
           defer { try? FileManager.default.removeItem(at: tempURL) }
           let tempPath = tempURL.path
    
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
           } catch {
               throw HostsFileError.privilegedCommandFailed(reason: error.localizedDescription)
           }
    
           process.waitUntilExit()
    
           guard process.terminationStatus == 0 else {
               let errorData = errorPipe.fileHandleForReading.readDataToEndOfFile()
               let errorStr = String(data: errorData, encoding: .utf8) ?? "Unknown error"
    
               if errorStr.contains("User canceled") || errorStr.contains("-128") {
                   throw HostsFileError.adminPasswordRequired
               }
               throw HostsFileError.writeFailed(reason: errorStr)
           }
       }
}
