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
    @Injected(\.notificationService) private var notificationService
    @Injected(\.analyticsService) private var analyticsService

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
        analyticsService.inilizeAnalytics()
        analyticsService.trackEvent(for: "active_user", properties: nil)
        initialeSetupOfTheApp()
        activateProxy()
        allowNotifications()

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
    private func initialeSetupOfTheApp() {
        let openedTheAppBefore = userDefaults.bool(forKey: .openedTheAppBefore)
        let blockedDomains = SwiftDataManager.shared.fetch(BlockedDomain.self).map(\.domain)
        let allDomains = PreloadedDomains.domains + blockedDomains

        if !openedTheAppBefore {
            updateAppContainerBlockList(with: allDomains)
            preloadDomainsInHostFile(with: allDomains)
            analyticsService.trackEvent(for: "app_opened_for_first_time", properties: nil)
        }
    }
    
    private func allowNotifications() {
        Task { try? await notificationService.ensureAuthorized() }
    }

    private func updateAppContainerBlockList(with domains: [String]) {
        dnsProfileService.writeBlocklist(domains)
    }

    private func activateProxy() {
        Task { await dnsProfileService.activateProxy() }
    }

    private func preloadDomainsInHostFile(with domains: [String]) {
        Task {
            try? await hostFileService.applyDomains(domains)
            try? await hostFileService.applySafeSearch()
            userDefaults.set(true, forKey: .openedTheAppBefore)
        }
    }
}
