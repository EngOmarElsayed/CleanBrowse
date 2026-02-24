# ``HostsFileService``

The core service that manages domain blocking and SafeSearch enforcement by manipulating the macOS `/etc/hosts` file.

## Overview

`HostsFileService` is the primary blocking engine of CleanBrowse. It reads and writes the system `/etc/hosts` file to redirect blocked domains to `127.0.0.1` (localhost) and `::1` (IPv6 localhost), effectively preventing any application from connecting to those domains.

The service manages **two independent marker blocks** within `/etc/hosts`:

```
# CleanBrowse START
127.0.0.1 pornhub.com
::1 pornhub.com
127.0.0.1 www.pornhub.com
::1 www.pornhub.com
... (~249K blocked domains)
# CleanBrowse END

# CleanBrowse SafeSearch START
216.239.38.120 google.com
2001:4860:4802:32::78 google.com
... (SafeSearch redirects)
# CleanBrowse SafeSearch END
```

### Writing to /etc/hosts

Since `/etc/hosts` is owned by `root`, direct writes are not possible from a sandboxed or normal user process. The service uses the following strategy:

1. Build the new file content in memory
2. Write to a temporary file in the app's temp directory
3. Execute `osascript` with `administrator privileges` to copy the temp file to `/etc/hosts`
4. Flush DNS cache using `dscacheutil -flushcache` and restart `mDNSResponder`
5. Clean up the temp file

This triggers a **system admin password dialog** that the user must approve.

### Domain Normalization

Every domain is processed through ``String/normalizedDomain`` before being written:
- Lowercased
- Protocol stripped (`https://`, `http://`)
- `www.` prefix stripped
- Trailing slashes and paths removed

For each domain, the service automatically creates entries for both the bare domain and its `www.` variant, with both IPv4 (`127.0.0.1`) and IPv6 (`::1`) entries.

### SafeSearch

The SafeSearch block redirects search engine domains to their safe-search IPs instead of blocking them. This is fundamentally different from domain blocking:

| Engine | Target IP | Effect |
|--------|-----------|--------|
| Google (~190 country domains) | `216.239.38.120` | Forces SafeSearch |
| YouTube | `216.239.38.120` | Forces Restricted Mode |
| Bing | `150.171.27.16` | Forces Strict SafeSearch |
| DuckDuckGo | `40.114.177.246` | Forces Safe Search |

### Adding a Single Domain

When a user adds a custom domain, the service uses an **append strategy** instead of rewriting the entire file:

1. Read the current `/etc/hosts` content
2. Find the `# CleanBrowse END` marker
3. Insert the new entries just before the marker
4. Write the modified file via the privileged write path

This avoids rewriting ~249K+ lines for a single addition.

## Topics

### Reading

- ``domainsInHostsFile()``

### Writing

- ``applyDomains(_:)``
- ``addSingleDomain(_:)``
- ``applySafeSearch()``

### State

- ``lastError``
- ``isWriting``
