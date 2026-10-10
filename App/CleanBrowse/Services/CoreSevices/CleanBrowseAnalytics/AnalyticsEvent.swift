//
//  AnalyticsEvent.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 03/10/2026.
//

import Foundation

/// Every analytics event the app can send.
///
/// Privacy contract (see the website's "We count clicks, not people" section):
/// events carry feature usage only — never a domain name, a block/blur count,
/// or anything that identifies the user.
enum AnalyticsEvent {
    case activeUser
    case appOpenedForFirstTime
    case appTerminatedByUser

    case settingsOpened
    case safeSearchToggled(engine: SettingsSafeSearch, enabled: Bool, success: Bool)
    case customDomainAdded(CustomDomainResult)
    case blockListOpened
    case blockListFirstOpened
    case customDomainRemoved(success: Bool)
    case safariExtensionSettingsOpened(extensionEnabled: Bool)
    case safariExtensionSettingsFirstOpened(extensionEnabled: Bool)
    case safariExtensionState(enabled: Bool)
    case updateCheckClicked
    case dnsProxyStateChanged(enabled: Bool)
}

// MARK: - Name & Properties
extension AnalyticsEvent {
    var name: String {
        switch self {
        case .activeUser: "active_user"
        case .appOpenedForFirstTime: "app_opened_for_first_time"
        case .appTerminatedByUser: "app_terminated_by_user"
        case .settingsOpened: "settings_opened"
        case .safeSearchToggled: "safesearch_toggled"
        case .customDomainAdded: "custom_domain_added"
        case .blockListOpened: "block_list_opened"
        case .blockListFirstOpened: "block_list_first_opened"
        case .customDomainRemoved: "custom_domain_removed"
        case .safariExtensionSettingsOpened: "safari_extension_settings_opened"
        case .safariExtensionSettingsFirstOpened: "safari_extension_settings_first_opened"
        case .safariExtensionState: "safari_extension_state"
        case .updateCheckClicked: "update_check_clicked"
        case .dnsProxyStateChanged: "dns_proxy_state_changed"
        }
    }

    var properties: [String: String]? {
        switch self {
        case let .safeSearchToggled(engine, enabled, success):
            ["engine": engine.analyticsName, "enabled": String(enabled), "success": String(success)]
        case .customDomainAdded(let result):
            ["result": result.rawValue]
        case .customDomainRemoved(let success):
            ["success": String(success)]
        case .safariExtensionSettingsOpened(let extensionEnabled),
             .safariExtensionSettingsFirstOpened(let extensionEnabled):
            ["extension_enabled": String(extensionEnabled)]
        case .safariExtensionState(let enabled), .dnsProxyStateChanged(let enabled):
            ["enabled": String(enabled)]
        case .activeUser, .appOpenedForFirstTime, .appTerminatedByUser,
             .settingsOpened, .blockListOpened, .blockListFirstOpened, .updateCheckClicked:
            nil
        }
    }
}

// MARK: - Property Values
extension AnalyticsEvent {
    enum CustomDomainResult: String {
        case added, duplicate, builtin
    }
}

// MARK: - SettingsSafeSearch + Analytics
private extension SettingsSafeSearch {
    var analyticsName: String {
        switch self {
        case .all: "all"
        case .google: "google"
        case .youtube: "youtube"
        case .bing: "bing"
        case .duckDuckGo: "duckduckgo"
        }
    }
}
