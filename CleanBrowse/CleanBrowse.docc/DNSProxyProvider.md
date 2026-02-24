# DNSProxyProvider

The network extension that intercepts all DNS queries system-wide, blocking adult domains across every query type.

## Overview

`DNSProxyProvider` is an `NEDNSProxyProvider` subclass that runs as a separate process (the `DNSProxy` extension target). When macOS activates it, **every** DNS query on the system flows through this provider before reaching the network.

For blocked domains, the provider returns an **NXDOMAIN** response (DNS RCODE 3), telling the requesting app that the domain does not exist. For all other domains, queries are forwarded to the upstream DNS server (`8.8.8.8`).

### Why This Extension Exists

The `/etc/hosts` file only handles **A** and **AAAA** DNS record types. Modern browsers -- Safari in particular -- also send **Type 65 (HTTPS/SVCB)** queries. Sites behind Cloudflare return valid HTTPS records for these queries, allowing Safari to resolve a real IP and connect directly, bypassing the hosts-file block entirely.

```
Without DNS Proxy:
  Safari -> A query    -> /etc/hosts -> 127.0.0.1 (blocked)
  Safari -> Type 65    -> /etc/hosts can't answer -> upstream DNS -> Cloudflare IP (bypassed!)

With DNS Proxy:
  Safari -> A query    -> DNS Proxy -> NXDOMAIN (blocked)
  Safari -> Type 65    -> DNS Proxy -> NXDOMAIN (blocked)
  Safari -> ANY type   -> DNS Proxy -> NXDOMAIN (blocked)
```

### Query Processing Pipeline

Every DNS query goes through this pipeline:

1. **Flow received** -- macOS hands the provider a `NEAppProxyUDPFlow` containing one or more DNS datagrams
2. **Reload check** -- If the main app signaled a blocklist change (via Darwin notification), reload the blocklist from disk
3. **Parse domain** -- Extract the queried domain name from the raw DNS packet bytes
4. **Block check** -- Look up the domain (and its parent domains) in the blocklist `Set<String>`
5. **Respond or forward**:
   - **Blocked**: Build an NXDOMAIN response from the original query and write it back to the flow
   - **Allowed**: Create a UDP session to `8.8.8.8:53`, forward the query, and relay the response back

### Domain Matching

The provider checks three levels for each queried domain:

| Check | Example |
|-------|---------|
| Exact match | `example.com` is in the blocklist |
| Without `www.` | Query for `www.example.com` matches `example.com` |
| Parent domains | Query for `sub.cdn.example.com` matches `example.com` |

Parent domain matching walks up the domain hierarchy (`sub.cdn.example.com` -> `cdn.example.com` -> `example.com`), stopping when only two labels remain (the registrable domain).

### DNS Packet Format

The provider parses and constructs raw DNS packets at the byte level:

**Parsing** (query -> domain name):
- Skip the 12-byte DNS header
- Read length-prefixed labels until a zero byte or compression pointer (`0xC0`)
- Join labels with `.` to form the domain name

**NXDOMAIN response construction**:
- Copy the original query bytes
- Set byte 2 to `0x85` (QR=1, AA=1, RD=1)
- Set byte 3 to `0x83` (RA=1, RCODE=3 NXDOMAIN)
- Zero out ANCOUNT, NSCOUNT, and ARCOUNT (bytes 6-11)

### Cross-Process Communication

The extension runs in a separate process from the main CleanBrowse app. They communicate through two mechanisms:

| Mechanism | Direction | Purpose |
|-----------|-----------|---------|
| App Group file (`blocklist.txt`) | App -> Extension | Shared blocklist (one domain per line) |
| Darwin notification | App -> Extension | Signals the extension to reload the blocklist |

The extension does **not** poll or watch the file. It only reloads when:
1. The proxy starts (initial load)
2. A Darwin notification (`com.omarelsayed.cleanbrowse.blocklistUpdated`) sets the `needsReload` flag, and the next DNS query triggers the actual reload

This design avoids any overhead on the hot path (DNS query processing) when the blocklist hasn't changed.

### Extension Lifecycle

| Event | What Happens |
|-------|--------------|
| `startProxy` | Loads the blocklist from disk, registers for Darwin notifications |
| DNS query arrives | Processes the query (block or forward) |
| Darwin notification | Sets `needsReload = true` (reload happens on next query) |
| `stopProxy` | Unregisters the Darwin notification observer |

### System Requirements

The DNS Proxy extension requires:

| Requirement | Details |
|-------------|---------|
| Entitlement | `com.apple.developer.networking.networkextension` with `dns-proxy` |
| App Group | `group.com.omarelsayed.cleanbrowse` (shared container) |
| Developer account | Paid Apple Developer Program membership |
| User approval | macOS prompts the user to allow the extension in System Settings |

## Topics

### Lifecycle

- ``startProxy(options:completionHandler:)``
- ``stopProxy(with:completionHandler:)``

### DNS Flow Handling

- ``handleNewFlow(_:)``
