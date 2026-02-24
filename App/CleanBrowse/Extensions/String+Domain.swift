import Foundation

/// Domain normalization and validation helpers for CleanBrowse.
///
/// These extensions are used throughout the app to ensure consistent domain formatting
/// when adding domains to the blocklist or comparing against the preloaded list.
extension String {

    /// Returns a normalized version of the string for use as a domain name.
    ///
    /// Normalization steps (in order):
    /// 1. Lowercased
    /// 2. Trimmed of whitespace and newlines
    /// 3. Protocol stripped (`https://` or `http://`)
    /// 4. `www.` prefix stripped
    /// 5. Trailing slash removed
    /// 6. Path removed (everything after the first `/`)
    ///
    /// ### Examples
    ///
    /// ```swift
    /// "HTTPS://www.Example.com/path".normalizedDomain  // "example.com"
    /// "http://test.org/".normalizedDomain               // "test.org"
    /// "subdomain.site.co.uk".normalizedDomain           // "subdomain.site.co.uk"
    /// ```
    ///
    /// - Note: The `www.` prefix is stripped so that ``HostsFileService`` can
    ///   add both the bare domain and `www.` variant independently.
    var normalizedDomain: String {
        var result = self
            .lowercased()
            .trimmingCharacters(in: .whitespacesAndNewlines)

        // Strip protocol
        if result.hasPrefix("https://") {
            result = String(result.dropFirst(8))
        } else if result.hasPrefix("http://") {
            result = String(result.dropFirst(7))
        }

        // Strip www.
        if result.hasPrefix("www.") {
            result = String(result.dropFirst(4))
        }

        // Strip trailing slash
        if result.hasSuffix("/") {
            result = String(result.dropLast())
        }

        // Strip path
        if let slashIndex = result.firstIndex(of: "/") {
            result = String(result[result.startIndex..<slashIndex])
        }

        return result
    }

    /// Whether the string represents a valid domain name.
    ///
    /// Validation checks:
    /// 1. The normalized domain is non-empty
    /// 2. Contains at least one dot (e.g., `example.com`)
    /// 3. Contains only alphanumeric characters, dots, and hyphens
    ///
    /// Used by ``AddDomainView`` to enable/disable the add button.
    var isValidDomain: Bool {
        let normalized = self.normalizedDomain
        guard !normalized.isEmpty else { return false }
        // Must contain at least one dot
        guard normalized.contains(".") else { return false }
        // Basic character validation
        let allowed = CharacterSet.alphanumerics.union(CharacterSet(charactersIn: ".-"))
        return normalized.unicodeScalars.allSatisfy { allowed.contains($0) }
    }
}
