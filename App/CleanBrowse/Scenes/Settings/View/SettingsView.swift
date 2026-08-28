//
//  SettingsView.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 18/08/2026.
//

import FactoryKit
import SwiftUI
import Sparkle

struct SettingsView: View {
    @State private var viewModel: SettingsViewModel = SettingsViewModel()
    @Injected(\.updateService) private var updateService

    @AppStorage(.allSafeSearchEnabled) var allSafeSearchEnabled: Bool = true
    @AppStorage(.googleSafeSearchEnabled) var googleSafeSearchEnabled: Bool = true
    @AppStorage(.youtubeSafeSearchEnabled) var youtubeSafeSearchEnabled: Bool = true
    @AppStorage(.bingSafeSearchEnabled) var bingSafeSearchEnabled: Bool = true
    @AppStorage(.duckDuckGoSafeSearchEnabled) var duckDuckGoSafeSearchEnabled: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Settings")
                .font(.title)
                .frame(maxWidth: .infinity, alignment: .leading)

            Divider()
                .padding(.horizontal, -16)

            VStack(alignment: .leading, spacing: 12) {
                Section("Configure Safe Search") {
                    VStack(alignment: .leading, spacing: 8) {
                        SafeSearchSettingsToggle(isOn: $allSafeSearchEnabled, value: .all)
                        VStack(alignment: .leading, spacing: 4) {
                            ForEach(SettingsSafeSearch.allCases) { value in
                                switch value {
                                case .google:
                                    SafeSearchSettingsToggle(isOn: $googleSafeSearchEnabled, value: value)
                                        .disabled(allSafeSearchEnabled)
                                case .youtube:
                                    SafeSearchSettingsToggle(isOn: $youtubeSafeSearchEnabled, value: value)
                                        .disabled(allSafeSearchEnabled)
                                case .bing:
                                    SafeSearchSettingsToggle(isOn: $bingSafeSearchEnabled, value: value)
                                        .disabled(allSafeSearchEnabled)
                                case .duckDuckGo:
                                    SafeSearchSettingsToggle(isOn: $duckDuckGoSafeSearchEnabled, value: value)
                                        .disabled(allSafeSearchEnabled)
                                default:
                                    EmptyView()
                                }
                            }
                        }
                        .padding(.horizontal, 8)
                    }
                    .padding(.horizontal, 8)
                    .disabled(viewModel.isLoading)
                }

                Section("Genral") {
                    Button {
                        updateService.checkForUpdates(nil)
                    } label: {
                        Text("Check for updates")
                            .font(.subheadline)
                    }

                }
            }
        }
        .onChange(of: allSafeSearchEnabled) { oldValue, newValue in
            _ = newValue ? viewModel.action(for: .enableAllSafeSearch): viewModel.action(for: .disableAllSafeSearch)
        }
        .onChange(of: googleSafeSearchEnabled) { oldValue, newValue in
                _ = newValue ? viewModel.action(for: .enableSafeSearch(value: .google)): viewModel.action(for: .disableSafeSearch(value: .google))
        }
        .onChange(of: youtubeSafeSearchEnabled) { oldValue, newValue in
            _ = newValue ? viewModel.action(for: .enableSafeSearch(value: .youtube)): viewModel.action(for: .disableSafeSearch(value: .youtube))
        }
        .onChange(of: bingSafeSearchEnabled) { oldValue, newValue in
            _ = newValue ? viewModel.action(for: .enableSafeSearch(value: .bing)): viewModel.action(for: .disableSafeSearch(value: .bing))
        }
        .onChange(of: duckDuckGoSafeSearchEnabled) { oldValue, newValue in
            _ = newValue ? viewModel.action(for: .enableSafeSearch(value: .duckDuckGo)): viewModel.action(for: .disableSafeSearch(value: .duckDuckGo))
        }
    }

    struct SafeSearchSettingsToggle: View {
        @Binding var isOn: Bool
        var value: SettingsSafeSearch

        var body: some View {
            HStack(spacing: 4) {
                HStack(spacing: 4) {
                    if !value.icon.isEmpty {
                        Image(value.icon)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 12, height: 12)
                    }

                    Text(value.title)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                Toggle("", isOn: $isOn)
                    .toggleStyle(.switch)
                    .labelsHidden()
            }
        }
    }
}
