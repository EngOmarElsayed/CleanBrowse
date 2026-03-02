import SwiftUI
import SwiftData

/// The main content view displayed in the menu bar popover.
///
/// `MenuBarContentView` is the root view of CleanBrowse's UI. It composes all subviews
/// and handles first-launch setup tasks:
///
/// 1. **Domain preloading**: Writes ~249K NSFW domains + user custom domains to `/etc/hosts`
/// 2. **SafeSearch**: Applies SafeSearch enforcement for all search engines
/// 3. **DNS profile**: Prompts installation of the CleanBrowsing DNS-over-HTTPS profile
///
/// ### Layout (top to bottom)
///
/// | View | Purpose |
/// |------|---------|
/// | ``StatusHeaderView`` | Shows protection status and SafeSearch indicator |
/// | ``AddDomainView`` | Text field to add custom blocked domains |
/// | Loading indicator | Shown during first-launch domain preloading |
/// | ``BlockedListView`` | Scrollable list of user-added custom domains |
/// | Quit button | Power icon button to terminate the app |
///
/// ### First-Launch Behavior
///
/// On first launch (`hasPreloadedDomains == false`), the view triggers ``preloadDomains()``
/// which writes all blocked domains and SafeSearch entries to `/etc/hosts`. This requires
/// an admin password (triggered by ``HostsFileService``).
struct MenuBarContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \BlockedDomain.dateAdded, order: .reverse) private var blockedDomains: [BlockedDomain]

    /// Whether the first-launch domain preloading is in progress.
    @State private var isPreloading = false
    /// Persisted flag indicating whether the ~249K domains have been written to `/etc/hosts`.
    @AppStorage("hasPreloadedDomains") private var hasPreloadedDomains = false
    /// Persisted flag indicating whether the DNS profile installation has been prompted.
    @AppStorage("hasInstalledDNSProfile") private var hasInstalledDNSProfile = false

    var body: some View {
        VStack(spacing: 0) {
            StatusHeaderView()

            Divider()

            AddDomainView()

            if isPreloading {
                VStack(spacing: 8) {
                    ProgressView()
                        .controlSize(.small)
                    Text("Applying blocked domains...")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .padding(16)
            }

            Divider()

            BlockedListView(domains: blockedDomains)

            Divider()

            // Quit button
            Button {
                NSApp.terminate(nil)
            } label: {
                Image(systemName: "power")
                    .font(.caption)
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
        }
        .frame(width: 340)
    }
}
