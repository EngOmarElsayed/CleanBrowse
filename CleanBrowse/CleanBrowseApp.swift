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

    /// The shared SwiftData container for ``BlockedDomain`` persistence.
    ///
    /// Uses on-disk storage (not in-memory) so that user-added custom domains
    /// persist across app launches.
    let sharedModelContainer: ModelContainer = {
        let schema = Schema([
            BlockedDomain.self
        ])
        let modelConfiguration = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: false
        )
        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        MenuBarExtra("CleanBrowse", systemImage: "staroflife.shield.fill") {
            MenuBarContentView()
                .modelContainer(sharedModelContainer)
                .environment(appDelegate.hostsFileService)
                .environment(appDelegate.riddleService)
                .environment(appDelegate.dnsProfileService)
        }
        .menuBarExtraStyle(.window)
    }
}
