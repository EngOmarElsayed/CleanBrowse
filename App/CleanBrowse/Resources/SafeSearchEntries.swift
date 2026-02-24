import Foundation

/// Static domain-to-IP mappings used by ``HostsFileService`` to enforce SafeSearch
/// across major search engines via `/etc/hosts`.
///
/// Each search engine has a dedicated SafeSearch IP address that forces filtered results.
/// When a domain (e.g., `google.com`) is mapped to its SafeSearch IP in `/etc/hosts`,
/// the browser connects to the SafeSearch-enforcing server instead of the regular one.
///
/// ### Supported Engines
///
/// | Engine | SafeSearch IP | Technique |
/// |--------|--------------|-----------|
/// | Google | `216.239.38.120` | Maps to `forcesafesearch.google.com` (~190 country domains) |
/// | YouTube | `216.239.38.120` | Maps to `restrict.youtube.com` (Strict Restricted Mode) |
/// | Bing | `150.171.27.16` | Maps to `strict.bing.com` |
/// | DuckDuckGo | `40.114.177.246` | Maps to `safe.duckduckgo.com` |
///
/// All entries include IPv6 addresses where available. Google and YouTube share the
/// same SafeSearch IP (`216.239.38.120`), which is Google's SafeSearch enforcement server.
enum SafeSearchEntries {

    // MARK: - Types

    /// A single hosts-file entry mapping a domain to an IP address.
    ///
    /// Each entry produces one or two lines in `/etc/hosts`:
    /// - `<ipv4> <domain>`
    /// - `<ipv6> <domain>` (if ``ipv6`` is non-nil)
    struct HostsEntry {
        /// The IPv4 address to redirect the domain to (e.g., `"216.239.38.120"`).
        let ipv4: String
        /// The IPv6 address to redirect the domain to, or `nil` if IPv6 is not supported.
        let ipv6: String?
        /// The domain name to redirect (e.g., `"google.com"`).
        let domain: String
    }

    // MARK: - Google SafeSearch
    // forcesafesearch.google.com → 216.239.38.120

    /// Google SafeSearch enforcement entries for ~190 country-code domains.
    ///
    /// Redirects all Google search domains (including `www.` variants) to
    /// `forcesafesearch.google.com` (`216.239.38.120` / `2001:4860:4802:32::78`).
    /// This covers `google.com`, `google.co.uk`, `google.de`, `google.com.br`, etc.
    ///
    /// Each domain generates two entries (bare + `www.`), each with IPv4 and IPv6,
    /// totaling approximately **760 hosts-file lines**.
    static let googleSafeSearch: [HostsEntry] = {
        let ipv4 = "216.239.38.120"
        let ipv6 = "2001:4860:4802:32::78"

        let googleDomains = [
            "google.com",
            "google.ad", "google.ae", "google.al", "google.am", "google.as",
            "google.at", "google.az", "google.ba", "google.be", "google.bf",
            "google.bg", "google.bi", "google.bj", "google.bs", "google.bt",
            "google.by", "google.ca", "google.cat", "google.cd", "google.cf",
            "google.cg", "google.ch", "google.ci", "google.cl", "google.cm",
            "google.cn", "google.cv", "google.cz", "google.de", "google.dj",
            "google.dk", "google.dm", "google.dz", "google.ee", "google.es",
            "google.fi", "google.fm", "google.fr", "google.ga", "google.ge",
            "google.gg", "google.gl", "google.gm", "google.gp", "google.gr",
            "google.gy", "google.hn", "google.hr", "google.ht", "google.hu",
            "google.ie", "google.im", "google.iq", "google.is", "google.it",
            "google.je", "google.jo", "google.kg", "google.ki", "google.kz",
            "google.la", "google.li", "google.lk", "google.lt", "google.lu",
            "google.lv", "google.md", "google.me", "google.mg", "google.mk",
            "google.ml", "google.mn", "google.ms", "google.mu", "google.mv",
            "google.mw", "google.ne", "google.nl", "google.no", "google.nr",
            "google.nu", "google.pl", "google.pn", "google.ps", "google.pt",
            "google.ro", "google.rs", "google.ru", "google.rw", "google.sc",
            "google.se", "google.sh", "google.si", "google.sk", "google.sm",
            "google.sn", "google.so", "google.sr", "google.st", "google.td",
            "google.tg", "google.tk", "google.tl", "google.tm", "google.tn",
            "google.to", "google.tt", "google.vg", "google.vu", "google.ws",
            // Country-code second-level domains (.co.xx, .com.xx)
            "google.co.ao", "google.co.bw", "google.co.ck", "google.co.cr",
            "google.co.id", "google.co.il", "google.co.in", "google.co.jp",
            "google.co.ke", "google.co.kr", "google.co.ls", "google.co.ma",
            "google.co.mz", "google.co.nz", "google.co.th", "google.co.tz",
            "google.co.ug", "google.co.uk", "google.co.uz", "google.co.ve",
            "google.co.vi", "google.co.za", "google.co.zm", "google.co.zw",
            "google.com.af", "google.com.ag", "google.com.ai", "google.com.ar",
            "google.com.au", "google.com.bd", "google.com.bh", "google.com.bn",
            "google.com.bo", "google.com.br", "google.com.bz", "google.com.co",
            "google.com.cu", "google.com.cy", "google.com.do", "google.com.ec",
            "google.com.eg", "google.com.et", "google.com.fj", "google.com.gh",
            "google.com.gi", "google.com.gt", "google.com.hk", "google.com.jm",
            "google.com.kh", "google.com.kw", "google.com.lb", "google.com.ly",
            "google.com.mm", "google.com.mt", "google.com.mx", "google.com.my",
            "google.com.na", "google.com.ng", "google.com.ni", "google.com.np",
            "google.com.om", "google.com.pa", "google.com.pe", "google.com.pg",
            "google.com.ph", "google.com.pk", "google.com.pr", "google.com.py",
            "google.com.qa", "google.com.sa", "google.com.sb", "google.com.sg",
            "google.com.sl", "google.com.sv", "google.com.tj", "google.com.tr",
            "google.com.tw", "google.com.ua", "google.com.uy", "google.com.vc",
            "google.com.vn"
        ]

        var entries: [HostsEntry] = []
        for domain in googleDomains {
            entries.append(HostsEntry(ipv4: ipv4, ipv6: ipv6, domain: domain))
            entries.append(HostsEntry(ipv4: ipv4, ipv6: ipv6, domain: "www.\(domain)"))
        }
        return entries
    }()

    // MARK: - YouTube Restricted Mode (Strict)
    // restrict.youtube.com → 216.239.38.120

    /// YouTube Strict Restricted Mode enforcement entries.
    ///
    /// Redirects YouTube domains to `restrict.youtube.com` (`216.239.38.120`),
    /// which enables **Strict Restricted Mode** — the most aggressive content filter.
    /// This covers the main site, mobile site, embedded player, and API endpoints.
    ///
    /// Blocked domains:
    /// - `youtube.com`, `www.youtube.com`, `m.youtube.com`
    /// - `youtubei.googleapis.com`, `youtube.googleapis.com`
    /// - `youtube-nocookie.com`, `www.youtube-nocookie.com`
    static let youtubeRestrict: [HostsEntry] = {
        let ipv4 = "216.239.38.120"
        let ipv6 = "2001:4860:4802:32::78"
        let domains = [
            "youtube.com",
            "www.youtube.com",
            "m.youtube.com",
            "youtubei.googleapis.com",
            "youtube.googleapis.com",
            "youtube-nocookie.com",
            "www.youtube-nocookie.com"
        ]
        return domains.map { HostsEntry(ipv4: ipv4, ipv6: ipv6, domain: $0) }
    }()

    // MARK: - Bing SafeSearch (Strict)
    // strict.bing.com → 150.171.27.16

    /// Bing Strict SafeSearch enforcement entries.
    ///
    /// Redirects `bing.com` and `www.bing.com` to `strict.bing.com` (`150.171.27.16` /
    /// `2620:1ec:33::16`), which enforces the strictest SafeSearch filtering level.
    static let bingSafeSearch: [HostsEntry] = {
        let ipv4 = "150.171.27.16"
        let ipv6 = "2620:1ec:33::16"
        let domains = ["bing.com", "www.bing.com"]
        return domains.map { HostsEntry(ipv4: ipv4, ipv6: ipv6, domain: $0) }
    }()

    // MARK: - DuckDuckGo SafeSearch
    // safe.duckduckgo.com → 40.114.177.246 (no IPv6, IP may change)

    /// DuckDuckGo SafeSearch enforcement entries.
    ///
    /// Redirects `duckduckgo.com` and `www.duckduckgo.com` to `safe.duckduckgo.com`
    /// (`40.114.177.246`). No IPv6 address is available for DuckDuckGo SafeSearch.
    ///
    /// > Note: The DuckDuckGo SafeSearch IP may change over time. If SafeSearch stops
    /// > working for DuckDuckGo, verify the current IP by running
    /// > `nslookup safe.duckduckgo.com`.
    static let duckDuckGoSafeSearch: [HostsEntry] = {
        let ipv4 = "40.114.177.246"
        let domains = ["duckduckgo.com", "www.duckduckgo.com"]
        return domains.map { HostsEntry(ipv4: ipv4, ipv6: nil, domain: $0) }
    }()
}
