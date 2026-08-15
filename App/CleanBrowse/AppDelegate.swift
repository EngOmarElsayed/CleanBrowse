//
//  AppDelegate.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import Cocoa
import ServiceManagement

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    private(set) var hostsFileService = HostsFileService()
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
}

// MARK: - App LifeCycle
extension AppDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        updateHostAndDNSBlockLists()
        activateProxy()
        if !launchAtLogin { launchAtLogin = true }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        false
    }

    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        return .terminateNow
    }
}

// MARK: - Private AppDelegate Methods
extension AppDelegate {
    private func updateHostAndDNSBlockLists() {
        let hasPreloadedDomains = UserDefaults.standard.bool(forKey: "hasPreloadedDomains")
        let blockedDomains = SwiftDataManager.shared.fetch(BlockedDomain.self).map(\.domain)
        let allDomains = PreloadedDomains.domains + blockedDomains

        if !hasPreloadedDomains {
            updateAppContainerBlockList(with: allDomains)
            preloadDomainsInHostFile(with: allDomains)
        }
    }

    private func updateAppContainerBlockList(with domains: [String]) {
        dnsProfileService.writeBlocklist(domains)
    }

    private func activateProxy() {
        Task { await dnsProfileService.activateProxy() }
    }

    private func preloadDomainsInHostFile(with domains: [String]) {
        Task {
            await hostsFileService.applyDomains(domains)
            await hostsFileService.applySafeSearch()
        }
    }
}
