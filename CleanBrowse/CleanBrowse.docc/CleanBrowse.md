# ``CleanBrowse``

A macOS menu bar application that blocks adult content at the system level using `/etc/hosts` manipulation, a DNS Proxy network extension, and forced SafeSearch.

## Overview

CleanBrowse is a parental-control / self-discipline tool that runs silently in the macOS menu bar. It combines three layers of protection:

1. **Hosts-file blocking** -- Redirects ~249K adult domains to `127.0.0.1` via `/etc/hosts`, preventing the system from resolving them.
2. **DNS Proxy extension** -- A Network Extension (`NEDNSProxyProvider`) that intercepts **all** DNS queries system-wide, including Safari's Type 65 (HTTPS/SVCB) queries that bypass `/etc/hosts`. Returns NXDOMAIN for blocked domains across all query types.
3. **Forced SafeSearch** -- Redirects Google, YouTube, Bing, and DuckDuckGo to their SafeSearch/Restricted Mode IPs so search results are always filtered.

The app also includes an anti-bypass riddle system that requires solving a puzzle before the app can be quit.

### Why Two Blocking Layers?

The `/etc/hosts` file only handles A and AAAA DNS queries. Safari (and other modern browsers) also send **Type 65 (HTTPS/SVCB)** queries. Sites behind Cloudflare return valid HTTPS records for these queries, allowing Safari to connect directly and bypass the hosts-file block entirely. The DNS Proxy extension intercepts all query types, closing this gap.

```
Without DNS Proxy:
  Safari → A query → /etc/hosts → 127.0.0.1 (blocked)
  Safari → Type 65 → /etc/hosts can't answer → upstream DNS → Cloudflare IP (bypassed!)

With DNS Proxy:
  Safari → A query → DNS Proxy → NXDOMAIN (blocked)
  Safari → Type 65 → DNS Proxy → NXDOMAIN (blocked)
```

### Architecture

CleanBrowse follows a lightweight **MVVM** pattern with `@Observable` services, SwiftUI views, and SwiftData persistence.

```
CleanBrowseApp (entry point)
    |
    +-- AppDelegate (service creation, quit interception)
    |       |
    |       +-- HostsFileService   (hosts file read/write)
    |       +-- RiddleService      (quit-blocking riddles)
    |       +-- DNSProfileService  (DNS proxy activation + blocklist)
    |
    +-- MenuBarContentView (main UI)
    |       |
    |       +-- StatusHeaderView   (protection status)
    |       +-- AddDomainView      (custom domain input)
    |       +-- BlockedListView    (custom domain list)
    |       +-- RiddleView         (quit riddle modal)
    |
    +-- DNSProxy (Network Extension target)
            |
            +-- DNSProxyProvider   (NEDNSProxyProvider — intercepts all DNS)
```

### Cross-Process Communication

The main app and the DNS Proxy extension run in separate processes. They communicate through:

| Mechanism | Direction | Purpose |
|-----------|-----------|---------|
| App Group container (`group.com.omarelsayed.cleanbrowse`) | App → Extension | Shared `blocklist.txt` file |
| Darwin notification (`com.omarelsayed.cleanbrowse.blocklistUpdated`) | App → Extension | Signals the extension to reload the blocklist |

### System Requirements

| Requirement | Value |
|-------------|-------|
| Platform | macOS 14+ (Sonoma) |
| Sandbox | Disabled (requires `/etc/hosts` access) |
| Privileges | Admin password (via `osascript`) |
| Dock icon | Hidden (`LSUIElement`) |
| Developer account | Required (Network Extension entitlement) |
| Entitlements | `dns-proxy`, `system-extension.install`, `application-groups` |

## Topics

### Essentials

- ``CleanBrowseApp``
- ``AppDelegate``

### Services

- ``HostsFileService``
- ``RiddleService``
- ``DNSProfileService``

### DNS Proxy Extension

- <doc:DNSProxyProvider>

### Data

- ``BlockedDomain``
- ``PreloadedDomains``
- ``SafeSearchEntries``

### Views

- ``MenuBarContentView``
- ``StatusHeaderView``
- ``AddDomainView``
- ``BlockedListView``
- ``RiddleView``
