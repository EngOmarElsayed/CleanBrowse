//
//  AppDelegate.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import Cocoa
import ServiceManagement
import FactoryKit

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    @Injected(\.hostFileService) private var hostFileService
    let userDefaults = UserDefaults.standard
    let dnsProfileService = DNSProfileService()
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
        let hasPreloadedDomains = userDefaults.bool(forKey: .hasPreloadedDomains)
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
            await hostFileService.applyDomains(domains)
            if userDefaults.bool(forKey: .allSafeSearchEnabled) { try? await hostFileService.applySafeSearch() }
            userDefaults.set(true, forKey: .hasPreloadedDomains)
        }
    }
}
