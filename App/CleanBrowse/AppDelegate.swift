import Cocoa
import ServiceManagement

/// The application delegate that owns all core services and manages the app lifecycle.
///
/// `AppDelegate` is the central coordinator for CleanBrowse. It creates and owns the
/// three main services that power the app:
///
/// - ``hostsFileService``: Reads/writes domain blocks in `/etc/hosts`
/// - ``riddleService``: Manages the anti-bypass riddle system
/// - ``dnsProfileService``: Installs the DNS-over-HTTPS configuration profile
///
/// These services are injected into the SwiftUI environment by ``CleanBrowseApp``
/// so that views can access them via `@Environment`.
///
/// ### Quit Interception
///
/// The ``shouldAllowQuit`` flag works with ``RiddleService`` to prevent casual
/// quitting. When the riddle system is active, `applicationShouldTerminate(_:)` posts
/// a `.showQuitRiddle` notification instead of allowing immediate termination.
@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {

    /// The hosts-file blocking engine, shared across the entire app.
    private(set) var hostsFileService = HostsFileService()

    /// The riddle service for the anti-bypass quit mechanism.
    private(set) var riddleService = RiddleService()

    /// The DNS profile service for CleanBrowsing Family Filter installation.
    private(set) var dnsProfileService = DNSProfileService()

    /// Whether the app is configured to launch at login.
    ///
    /// Uses `SMAppService.mainApp` to register/unregister the app as a login item.
    /// The status is checked on access and persists across app launches.
    var launchAtLogin: Bool {
        get {
            SMAppService.mainApp.status == .enabled
        }
        set {
            do {
                if newValue {
                    try SMAppService.mainApp.register()
                } else {
                    try SMAppService.mainApp.unregister()
                }
            } catch {
                print("Failed to \(newValue ? "enable" : "disable") launch at login: \(error)")
            }
        }
    }

    /// Whether the app should be allowed to quit.
    ///
    /// Set to `true` by ``RiddleView`` after the user correctly solves the quit riddle.
    /// When `false`, `applicationShouldTerminate(_:)` can intercept and block termination.
    var shouldAllowQuit = false

    // MARK: - Lifecycle

    /// Called after the application has finished launching.
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Ensure the app always launches at login
        if !launchAtLogin {
            launchAtLogin = true
        }
    }

    /// Returns `false` to keep the app running even when all windows are closed.
    ///
    /// This is essential for a menu bar app — it has no main window, so it must
    /// continue running even when the popover is dismissed.
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        false
    }

    /// Controls whether the app is allowed to terminate.
    ///
    /// Currently returns `.terminateNow` to allow immediate quitting.
    /// When the riddle system is active, this can be changed to post a
    /// `.showQuitRiddle` notification and return `.terminateCancel` instead.
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        return .terminateNow
    }
}

// MARK: - Notification Names

extension Notification.Name {
    /// Posted when the quit riddle should be shown to the user.
    ///
    /// Observed by ``MenuBarContentView`` to present the ``RiddleView`` sheet.
    static let showQuitRiddle = Notification.Name("showQuitRiddle")
}
