//
//  MenuBarContentView.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import SwiftUI
import AppKit
import FactoryKit
import UserNotifications
import SafariServices
import Sparkle

//@Environment(\.modelContext) private var modelContext
//@Query(sort: \BlockedDomain.dateAdded, order: .reverse) private var blockedDomains: [BlockedDomain]

struct MenuBarContentView: View {
  @State private var showSettings: Bool = false
  @State private var showBlockList: Bool = false
  @State private var isNotificationAuth: Bool = false
  @AppStorage(.safariExtensionBadgeSeen) private var safariExtensionBadgeSeen: Bool = false
  @AppStorage(.blockListBadgeSeen) private var blockListBadgeSeen: Bool = false
  @Injected(\.notificationService) private var notificationService
  @Injected(\.analyticsService) private var analyticsService
  @Injected(\.updateService) private var updateService

  var body: some View {
    VStack(spacing: 0) {
      VStack(spacing: 4) {
        StatusHeaderView(isNotificationAuth: isNotificationAuth)
          .padding([.horizontal, .top], 16)

        AddDomainView()

        TipsCardView(onAction: handleTipAction)
          .padding(.horizontal, 16)
          .padding(.bottom, 12)
      }

      Divider()

      HStack(alignment: .center) {
        Button {
          openSettings()
        } label: {
          Image(systemName: "gearshape")
            .font(.caption)
        }
        .help("Settings")
        .popover(isPresented: $showSettings, arrowEdge: .bottom) {
          SettingsView()
            .padding(16)
            .frame(width: 280, alignment: .leading)
        }

        Button {
          openSafariExtensionSettings()
        } label: {
          Image(systemName: "puzzlepiece.extension")
            .font(.caption)
        }
        .newFeatureBadge(isVisible: !safariExtensionBadgeSeen)
        .help("Safari NSFW image blur extension")

        Button {
          openBlockList()
        } label: {
          Image(systemName: "list.bullet")
            .font(.caption)
        }
        .newFeatureBadge(isVisible: !blockListBadgeSeen)
        .help("Custom block list view")
        .popover(isPresented: $showBlockList, arrowEdge: .bottom) {
          BlockedListView()
            .padding(14)
            .frame(width: 280, alignment: .leading)
        }

        Spacer()

        Button {
          analyticsService.trackEvent(for: .appTerminatedByUser)
          NSApp.terminate(nil)
        } label: {
          Image(systemName: "power")
            .font(.caption)
        }
      }
      .padding(.vertical, 10)
      .padding(.horizontal, 16)
    }
    .frame(width: 340)
    .task {
      isNotificationAuth = await notificationService.authorizationStatus == .authorized
    }
  }
}

// MARK: - Actions
extension MenuBarContentView {
  private func openSettings() {
    analyticsService.trackEvent(for: .settingsOpened)
    showSettings = true
  }

  private func openSafariExtensionSettings() {
    let isFirstOpen = !safariExtensionBadgeSeen
    safariExtensionBadgeSeen = true
    Task {
      let isEnabled = await SFSafariExtensionManager.isCleanBrowseExtensionEnabled()
      analyticsService.trackEvent(
        for: isFirstOpen
          ? .safariExtensionSettingsFirstOpened(extensionEnabled: isEnabled)
          : .safariExtensionSettingsOpened(extensionEnabled: isEnabled)
      )
    }
    SFSafariApplication.showPreferencesForExtension(withIdentifier: SFSafariExtensionManager.cleanBrowseExtensionIdentifier)
  }

  private func openBlockList() {
    analyticsService.trackEvent(for: blockListBadgeSeen ? .blockListOpened : .blockListFirstOpened)
    blockListBadgeSeen = true
    showBlockList = true
  }

  private func handleTipAction(_ tip: TipCardCase) {
    switch tip {
    case .safariBlur: openSafariExtensionSettings()
    case .customBlockList: openBlockList()
    case .safeSearch: openSettings()
    }
  }
}
