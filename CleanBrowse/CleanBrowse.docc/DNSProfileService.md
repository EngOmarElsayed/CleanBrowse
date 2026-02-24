# ``DNSProfileService``

Manages the CleanBrowse DNS Proxy network extension -- activating it, writing the shared blocklist, and signaling the extension to reload.

## Overview

`DNSProfileService` is the main app's interface to the DNS Proxy extension. It handles three responsibilities:

1. **Blocklist management** -- Writing and appending domains to the shared App Group container
2. **Proxy activation** -- Enabling/disabling the DNS proxy via `NEDNSProxyManager`
3. **Cross-process signaling** -- Posting Darwin notifications to tell the extension to reload

### Blocklist File

The blocklist lives in the App Group container (`group.com.omarelsayed.cleanbrowse`) as a plain text file named `blocklist.txt`. Each line contains one domain:

```
pornhub.com
xvideos.com
substack.com
```

Two write paths exist:

| Method | When Used | How It Works |
|--------|-----------|--------------|
| ``writeBlocklist(_:)`` | App launch | Writes all ~249K domains at once |
| ``appendToBlocklist(_:)`` | User adds a custom domain | Appends one line via `FileHandle` (O(1)) |

Both methods post a Darwin notification after writing, which tells the DNS extension to reload on its next query.

### Proxy Activation

The service uses `NEDNSProxyManager` to manage the extension lifecycle:

1. ``activateProxy()`` -- Loads preferences, configures the provider protocol with the extension's bundle identifier, enables the manager, and saves
2. ``checkProxyStatus()`` -- Loads preferences and reads `isEnabled`
3. ``deactivateProxy()`` -- Sets `isEnabled = false` and saves

On first activation, macOS prompts the user to allow the network extension in **System Settings -> Privacy & Security -> Network Extensions**.

### Darwin Notifications

The main app and the DNS extension run in separate processes and cannot share memory. When the blocklist changes, the service posts a Darwin notification:

```
CFNotificationCenterPostNotification(
    CFNotificationCenterGetDarwinNotifyCenter(),
    "com.omarelsayed.cleanbrowse.blocklistUpdated",
    ...
)
```

The extension listens for this notification and sets a `needsReload` flag. The actual reload happens lazily on the next DNS query, avoiding unnecessary disk I/O when no queries are in flight.

### Startup Sequence

On app launch, ``MenuBarContentView`` orchestrates:

1. First launch only: write preloaded domains to `/etc/hosts` via ``HostsFileService``
2. Write the full blocklist to the shared container via ``writeBlocklist(_:)``
3. Check proxy status via ``checkProxyStatus()``
4. Activate the proxy if not already active via ``activateProxy()``

## Topics

### Blocklist Management

- ``writeBlocklist(_:)``
- ``appendToBlocklist(_:)``

### Proxy Lifecycle

- ``activateProxy()``
- ``checkProxyStatus()``
- ``deactivateProxy()``

### State

- ``lastError``
- ``isProxyActive``
- ``isInstalling``
