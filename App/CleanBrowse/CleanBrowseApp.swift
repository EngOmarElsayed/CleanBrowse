import SwiftUI
import SwiftData

/// The entry point for the CleanBrowse macOS menu bar application.
///
/// `CleanBrowseApp` configures the app as a menu bar extra (no Dock icon, no main window).
/// It sets up:
///
/// - A ``MenuBarExtra`` with the `staroflife.shield.fill` system image
/// - A SwiftData ``ModelContainer`` for persisting user-added ``BlockedDomain`` records
/// - Environment injection of all three services from ``AppDelegate``:
///   ``HostsFileService``, ``RiddleService``, and ``DNSProfileService``
///
/// The `.menuBarExtraStyle(.window)` modifier creates a popover-style window anchored
/// to the menu bar icon, containing the ``MenuBarContentView``.
@main
struct CleanBrowseApp: App {
    /// The app delegate that owns all core services.
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    var body: some Scene {
        MenuBarExtra("CleanBrowse", systemImage: "staroflife.shield.fill") {
            MenuBarContentView()
                .modelContainer(SwiftDataManager.shared.container)
                .environment(appDelegate.hostsFileService)
                .environment(appDelegate.riddleService)
                .environment(appDelegate.dnsProfileService)
        }
        .menuBarExtraStyle(.window)
    }
}
