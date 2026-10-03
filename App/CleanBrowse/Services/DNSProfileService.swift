//
//  DNSProfileService.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

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
///

// MARK: - DNSProfileServiceProtocol
protocol DNSProfileServiceProtocol {
  @concurrent func writeBlocklist(_ domains: [String]) async
  @concurrent func appendToBlocklist(_ domain: String) async
}

// MARK: - DNSProfileService
struct DNSProfileService {
    /// The Darwin notification name used to tell the DNS extension to reload.
    private static let reloadNotification = "com.omarelsayed.cleanbrowse.blocklistUpdated" as CFString

    /// The blocklist directory under the user's Application Support.
    private static let sharedBlocklistDir: URL = {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        return appSupport.appendingPathComponent("CleanBrowse")
    }()
}

// MARK: - Implemntation DNSProfileServiceProtocol
extension DNSProfileService: DNSProfileServiceProtocol {
  /// Writes the blocklist to ~/Library/Application Support/CleanBrowse/blocklist.txt.
  ///
  /// Also stores the absolute file path in the shared App Group UserDefaults so the
  /// DNS proxy (running as root) can locate it.
  ///
  /// - Parameter domains: Array of domain strings to block.
  @concurrent func writeBlocklist(_ domains: [String]) async {
    guard let blocklistURL = await blocklistURL() else { return }

    let content = domains.joined(separator: "\n")
    do {
      try content.write(to: blocklistURL, atomically: true, encoding: .utf8)
      NSLog("[CleanBrowse] Wrote \(domains.count) domains to \(blocklistURL.path)")
      notifyExtension()
    } catch {
      NSLog("[CleanBrowse] Failed to write blocklist: \(error)")
    }
  }

  /// Appends a single domain to the existing blocklist file.
  ///
  /// - Parameter domain: The domain to add to the blocklist.
  @concurrent func appendToBlocklist(_ domain: String) async {
    guard let blocklistURL = await blocklistURL() else { return }

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
      NSLog("[CleanBrowse] Failed to append to blocklist: \(error)")
    }
  }

  /// Returns the blocklist URL, creating the parent directory if needed.
  @concurrent private func blocklistURL() async -> URL? {
    let dir = Self.sharedBlocklistDir
    if !FileManager.default.fileExists(atPath: dir.path) {
      do {
        try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
      } catch {
        NSLog("[CleanBrowse] Failed to create blocklist directory: \(error)")
        return nil
      }
    }
    return dir.appendingPathComponent("blocklist.txt")
  }
}

// MARK: - Darwin notification method
extension DNSProfileService {
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
}
