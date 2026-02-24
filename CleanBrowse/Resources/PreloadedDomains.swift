import Foundation

/// Provides access to the ~249K preloaded NSFW domain blocklist.
///
/// The domains are loaded from `nsfw_blocklist.txt` bundled in the app's resources.
/// This file is sourced from the [OISD NSFW blocklist](https://oisd.nl) and contains
/// one domain per line (no protocols, no wildcards).
///
/// Domains are loaded lazily on first access and cached for the app's lifetime.
/// A ``domainSet`` is also provided for O(1) duplicate checking when users add
/// custom domains via ``AddDomainView``.
enum PreloadedDomains {
    /// All preloaded NSFW domains, loaded from the bundled `nsfw_blocklist.txt` file.
    ///
    /// Each line in the file is one domain. Empty lines and comment lines
    /// (starting with `#`) are filtered out.
    static let domains: [String] = {
        guard let url = Bundle.main.url(forResource: "nsfw_blocklist", withExtension: "txt"),
              let content = try? String(contentsOf: url, encoding: .utf8) else {
            return []
        }
        return content
            .components(separatedBy: .newlines)
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty && !$0.hasPrefix("#") }
    }()

    /// A `Set` of all preloaded domains for O(1) duplicate checking.
    ///
    /// Used by ``AddDomainView`` to prevent users from adding domains
    /// that are already covered by the built-in blocklist.
    static let domainSet: Set<String> = Set(domains)
}
