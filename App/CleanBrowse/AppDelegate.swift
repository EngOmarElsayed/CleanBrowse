//
//  AppDelegate.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import Cocoa
import ServiceManagement
import FactoryKit
import SafariServices
import NetworkExtension

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
  @Injected(\.hostFileService) private var hostFileService
  @Injected(\.notificationService) private var notificationService
  @Injected(\.analyticsService) private var analyticsService
  @Injected(\.dnsProxyExtensionManger) private var dnsProxyExtensionManger
  @Injected(\.dnsProfileService) private var dnsProfileService

  private let userDefaults = UserDefaults.standard
  private var launchAtLogin: Bool {
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
    analyticsService.trackEvent(for: .activeUser)
    trackSafariExtensionState()
    initialeSetupOfTheApp()
    observeDNSProxyState()
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
      Task {
        await updateAppContainerBlockList(with: allDomains)
        await preloadDomainsInHostFile(with: allDomains)
        analyticsService.trackEvent(for: .appOpenedForFirstTime)
      }
    }
  }

  private func trackSafariExtensionState() {
    Task {
      let isEnabled = await SFSafariExtensionManager.isCleanBrowseExtensionEnabled()
      analyticsService.trackEvent(for: .safariExtensionState(enabled: isEnabled))
    }
  }

  private func observeDNSProxyState() {
    NotificationCenter.default.addObserver(
      forName: .NEDNSProxyConfigurationDidChange,
      object: nil,
      queue: .main
    ) { _ in
      Task { await self.dnsProxyConfigurationDidChange() }
    }
  }

  private func dnsProxyConfigurationDidChange() async {
    let isEnabled = await dnsProxyExtensionManger.isProxyEnabled()
    analyticsService.trackEvent(for: .dnsProxyStateChanged(enabled: isEnabled))
  }

  private func allowNotifications() {
    Task { try? await notificationService.ensureAuthorized() }
  }

  private func activateProxy() {
    Task { await dnsProxyExtensionManger.activateAndInstallProxyExtension() }
  }

  private func updateAppContainerBlockList(with domains: [String]) async {
    await dnsProfileService.writeBlocklist(domains)
  }

  private func preloadDomainsInHostFile(with domains: [String]) async {
    try? await hostFileService.applyDomains(domains)
    try? await hostFileService.applySafeSearch()
    userDefaults.set(true, forKey: .openedTheAppBefore)
  }
}
