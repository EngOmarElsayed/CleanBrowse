//
//  SettingsViewModel.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 18/08/2026.
//

import SwiftUI
import FactoryKit
import UserDefaults

@MainActor
@Observable
final class SettingsViewModel {
    var isLoading: Bool = false

    // MARK: - UserDefault
    @ObservationIgnored
    @UserDefault(\.allSafeSearchEnabled) var allSafeSearchEnabled: Bool = true
    @ObservationIgnored
    @UserDefault(\.googleSafeSearchEnabled) var googleSafeSearchEnabled: Bool = true
    @ObservationIgnored
    @UserDefault(\.youtubeSafeSearchEnabled) var youtubeSafeSearchEnabled: Bool = true
    @ObservationIgnored
    @UserDefault(\.bingSafeSearchEnabled) var bingSafeSearchEnabled: Bool = true
    @ObservationIgnored
    @UserDefault(\.duckDuckGoSafeSearchEnabled) var duckDuckGoSafeSearchEnabled: Bool = true

    // MARK: - Injected
    @ObservationIgnored
    @Injected(\.removeAllSafeSearchEntry) private var removeAllSafeSearchEntry
    @ObservationIgnored
    @Injected(\.removeSafeSearchEntry) private var removeSafeSearchEntry
    @ObservationIgnored
    @Injected(\.addSafeSearchEntry) private var addSafeSearchEntry
    @ObservationIgnored
    @Injected(\.addAllSafeSearchEntry) private var addAllSafeSearchEntry
    @ObservationIgnored
    @Injected(\.analyticsService) private var analyticsService
}

// MARK: - Action
extension SettingsViewModel {
    func action(for value: SettingsViewModelAction) {
        switch value {
        case .enableAllSafeSearch:
            Task { await enableAllFeatures() }
        case .disableAllSafeSearch:
            Task { await disableAllFeatures() }
        case .enableSafeSearch(let value):
            Task { await enableFeature(for: value) }
        case .disableSafeSearch(let value):
            Task { await disableFeature(for: value) }
        }
    }
}

// MARK: - Private Method
extension SettingsViewModel {
    func enableAllFeatures() async {
        guard !isLoading else { return }
        do {
            isLoading = true
            setAllFlags(to: true)
            try await addAllSafeSearchEntry()
            trackToggle(.all, enabled: true, success: true)
            isLoading = false
        } catch {
            trackToggle(.all, enabled: true, success: false)
            setAllFlags(to: false)
            isLoading = false
        }
    }

    func enableFeature(for value: SettingsSafeSearch) async {
        guard !isLoading else { return }
        do {
            isLoading = true
            guard let feature = SettingsSafeSearch.mapToDomain(value: value) else { return }
            try await addSafeSearchEntry(for: feature)
            trackToggle(value, enabled: true, success: true)
            isLoading = false
        } catch {
            trackToggle(value, enabled: true, success: false)
            setFlag(for: value, to: false)
            isLoading = false
        }
    }

    func disableFeature(for value: SettingsSafeSearch) async {
        guard !isLoading else { return }
        do {
            isLoading = true
            guard let feature = SettingsSafeSearch.mapToDomain(value: value) else { return }
            try await removeSafeSearchEntry(for: feature)
            trackToggle(value, enabled: false, success: true)
            isLoading = false
        } catch {
            trackToggle(value, enabled: false, success: false)
            setFlag(for: value, to: true)
            isLoading = false
        }
    }

    func disableAllFeatures() async {
        guard !isLoading else { return }
        do {
            isLoading = true
            setAllFlags(to: false)
            try await removeAllSafeSearchEntry()
            trackToggle(.all, enabled: false, success: true)
            isLoading = false
        } catch {
            trackToggle(.all, enabled: false, success: false)
            setAllFlags(to: true)
            isLoading = false
        }
    }

    func setAllFlags(to value: Bool) {
        allSafeSearchEnabled = value
        googleSafeSearchEnabled = value
        youtubeSafeSearchEnabled = value
        bingSafeSearchEnabled = value
        duckDuckGoSafeSearchEnabled = value
    }

    func trackToggle(_ engine: SettingsSafeSearch, enabled: Bool, success: Bool) {
        analyticsService.trackEvent(for: .safeSearchToggled(engine: engine, enabled: enabled, success: success))
    }

    func setFlag(for value: SettingsSafeSearch, to flag: Bool) {
        switch value {
        case .all:
            allSafeSearchEnabled = flag
        case .google:
            googleSafeSearchEnabled = flag
        case .bing:
            bingSafeSearchEnabled = flag
        case .youtube:
            youtubeSafeSearchEnabled = flag
        case .duckDuckGo:
            duckDuckGoSafeSearchEnabled = flag
        }
    }
}

// MARK: - SettingsViewModelAction
extension SettingsViewModel {
    enum SettingsViewModelAction {
        case enableAllSafeSearch
        case disableAllSafeSearch
        case enableSafeSearch(value: SettingsSafeSearch)
        case disableSafeSearch(value: SettingsSafeSearch)
    }
}
