import Foundation
import SwiftData

/// A SwiftData model representing a user-added blocked domain.
///
/// `BlockedDomain` stores custom domains that the user has manually added via the
/// ``AddDomainView`` interface. These are persisted in SwiftData and written to
/// `/etc/hosts` via ``HostsFileService``.
///
/// > Note: The ~249K preloaded NSFW domains from ``PreloadedDomains`` are **not**
/// > stored as `BlockedDomain` objects. They are loaded from a bundled text file
/// > and written directly to `/etc/hosts` to avoid creating hundreds of thousands
/// > of SwiftData records.
@Model
class BlockedDomain {
    /// Unique identifier for the blocked domain record.
    var id: UUID = UUID()

    /// The normalized domain string (e.g., `example.com`).
    var domain: String = ""

    /// When the domain was added.
    var dateAdded: Date = Date()

    /// Whether this domain was part of the preloaded blocklist.
    /// Currently always `false` since preloaded domains are no longer stored in SwiftData.
    var isPreloaded: Bool = false

    /// Creates a new blocked domain record.
    ///
    /// The domain is automatically normalized via ``String/normalizedDomain``
    /// (lowercased, protocol stripped, `www.` removed, path removed).
    ///
    /// - Parameters:
    ///   - domain: The domain to block (will be normalized).
    ///   - isPreloaded: Whether this domain is from the built-in blocklist. Defaults to `false`.
    init(domain: String, isPreloaded: Bool = false) {
        self.id = UUID()
        self.domain = domain.normalizedDomain
        self.dateAdded = Date()
        self.isPreloaded = isPreloaded
    }
}
