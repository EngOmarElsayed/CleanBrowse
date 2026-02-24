# HostsFileService

The core service responsible for blocking domains at the system level by managing the macOS `/etc/hosts` file.

## How It Works

CleanBrowse blocks websites by redirecting their domain names to `127.0.0.1` (localhost). When the browser tries to load a blocked domain, the system resolver returns `127.0.0.1` instead of the real IP address, and the connection fails — effectively blocking the site.

### The `/etc/hosts` File

`/etc/hosts` is a system-level file that macOS checks **before** querying DNS servers. Each line maps an IP address to a domain:

```
127.0.0.1 pornhub.com
127.0.0.1 xvideos.com
```

`HostsFileService` manages a clearly marked section inside this file using start/end markers:

```
# CleanBrowse START
127.0.0.1 pornhub.com
127.0.0.1 xvideos.com
...
# CleanBrowse END
```

This ensures the service only touches its own entries and never modifies any other hosts file content (like the default `localhost` entry).

## Architecture

```
┌──────────────────────────────────────────────┐
│              SwiftUI Views                    │
│  (MenuBarContentView, AddDomainView)          │
│                                               │
│  Access via: @Environment(HostsFileService)   │
└──────────────┬───────────────────────────────┘
               │ calls applyDomains() / addSingleDomain()
               ▼
┌──────────────────────────────────────────────┐
│           HostsFileService                    │
│  @Observable @MainActor                       │
│                                               │
│  ┌─ domainsInHostsFile()  (read /etc/hosts)  │
│  ├─ applyDomains([String]) (bulk write)       │
│  ├─ addSingleDomain(String) (append one)      │
│  └─ writeToHosts(String)   (private, writes)  │
└──────────────┬───────────────────────────────┘
               │ writes temp file, then runs osascript
               ▼
┌──────────────────────────────────────────────┐
│         osascript (admin privileges)          │
│                                               │
│  1. cp temp_file → /etc/hosts                 │
│  2. dscacheutil -flushcache                   │
│  3. killall -HUP mDNSResponder (pre-Tahoe)   │
│  4. killall mDNSResponder (Tahoe 26+)         │
│  5. sleep 1 (wait for launchd restart)        │
└──────────────────────────────────────────────┘
```

## Public API

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `lastError` | `String?` | The most recent error message, or `nil` if the last operation succeeded |
| `isWriting` | `Bool` | `true` while a write operation is in progress (used by the UI to show loading states) |

### Methods

#### `domainsInHostsFile() -> Set<String>`

Reads `/etc/hosts` and returns all domains currently inside the `# CleanBrowse START/END` block.

- Parses only lines within the markers
- Extracts the domain from `127.0.0.1 <domain>` entries
- Returns an empty set if the file can't be read or contains no CleanBrowse block

#### `applyDomains(_ domains: [String]) async`

Replaces the entire CleanBrowse block in `/etc/hosts` with the given domain list.

- Normalizes each domain (lowercase, strip protocol/www/path)
- If a CleanBrowse block already exists, replaces it in-place
- If no block exists, appends one to the end of the file
- Triggers an admin password prompt via `osascript`
- Sets `lastError` if anything fails

#### `addSingleDomain(_ domain: String) async`

Convenience method that reads the current blocked domains, appends the new one, and calls `applyDomains`.

- Skips duplicates (checks against current hosts file content)
- Skips empty/invalid domains after normalization

## How Writing Works (The Hard Part)

Writing to `/etc/hosts` requires root privileges. Here's the step-by-step process:

### 1. Build the new content

The service reads the current `/etc/hosts`, finds the `# CleanBrowse START/END` block (if any), and replaces it with the updated list. If no block exists, it appends one.

### 2. Write to a temp file

The new content is written to a unique temp file in the system's temporary directory:

```
/var/folders/.../cleanbrowse_hosts_<UUID>
```

This is necessary because the app can't write to `/etc/hosts` directly (it's owned by root).

### 3. Run `osascript` with admin privileges

A `Process` is launched running `osascript`, which executes an AppleScript `do shell script` with `administrator privileges`. This triggers the macOS admin password dialog. The shell command:

```bash
cp '<temp_file>' /etc/hosts && dscacheutil -flushcache && killall -HUP mDNSResponder; killall mDNSResponder; sleep 1
```

### 4. DNS cache flush (multi-version support)

After copying the file, the DNS cache must be flushed so the system picks up the changes immediately:

| Command | Purpose | macOS Versions |
|---------|---------|----------------|
| `dscacheutil -flushcache` | Clears the Directory Services cache | All versions |
| `killall -HUP mDNSResponder` | Sends SIGHUP to reload the resolver | Sonoma (15), Sequoia (16), and older |
| `killall mDNSResponder` | Full kill; `launchd` auto-restarts it | Tahoe (26+) where SIGHUP no longer works |
| `sleep 1` | Gives `launchd` time to restart `mDNSResponder` | All versions |

### 5. Cleanup

The temp file is deleted after the process exits (not before — this avoids a race condition where the admin dialog delays the `cp` command).

## Threading Model

```
@MainActor (HostsFileService)
    │
    ├── domainsInHostsFile()   → runs on main actor (sync read, fast)
    ├── applyDomains()         → async, updates isWriting on main actor
    │       │
    │       └── writeToHosts() → async
    │               │
    │               └── Task.detached { ... }
    │                       │
    │                       └── Process + waitUntilExit()
    │                           (runs on background thread)
    │
    └── UI updates (lastError, isWriting) always happen on main actor
```

`writeToHosts` uses `Task.detached` to run the `Process` off the main actor. This is critical because:

- `process.waitUntilExit()` is a **blocking** call
- `osascript` shows a system admin dialog that can take seconds/minutes
- Blocking the main actor would freeze the entire UI

The detached task returns a `(success: Bool, error: String?)` tuple, which the main actor uses to update state.

## Integration with Views

`HostsFileService` is injected into the SwiftUI environment as an `@Observable` object:

```swift
// In CleanBrowseApp.swift
MenuBarContentView()
    .environment(appDelegate.hostsFileService)

// In views
@Environment(HostsFileService.self) private var hostsService
```

### MenuBarContentView

Calls `hostsService.applyDomains()` on first launch (via `.task`) to write the preloaded blocklist to `/etc/hosts`.

### AddDomainView

Calls `hostsService.addSingleDomain()` when the user adds a new domain. Shows `hostsService.lastError` if the write fails.

## Domain Normalization

Before writing to `/etc/hosts`, domains are normalized via the `String.normalizedDomain` extension:

| Input | Output |
|-------|--------|
| `https://www.Example.com/path` | `example.com` |
| `HTTP://Foo.Bar.com/` | `foo.bar.com` |
| `  EXAMPLE.COM  ` | `example.com` |

Steps: lowercase, trim whitespace, strip `http(s)://`, strip `www.`, strip trailing `/`, strip path.

## Error Handling

| Scenario | `lastError` Value |
|----------|-------------------|
| Can't read `/etc/hosts` | `"Failed to read /etc/hosts: ..."` |
| Can't write temp file | `"Failed to write temp file: ..."` |
| User cancels admin dialog | `"Admin password required to modify blocked sites."` |
| `cp` or flush command fails | `"Failed to write hosts file: <stderr>"` |
| `Process` can't launch | `"Failed to run privileged command: ..."` |
| Success | `nil` |

## Requirements

- **App Sandbox**: Must be **disabled** (`com.apple.security.app-sandbox: false`) — the app needs to read `/etc/hosts` and launch `osascript` with admin privileges
- **LSUIElement**: Set to `YES` — the app is menu-bar-only, no Dock icon
- **macOS 14+**: Uses `@Observable` (requires macOS 14 Sonoma minimum)
