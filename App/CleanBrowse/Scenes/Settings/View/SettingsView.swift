//
//  SettingsView.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 18/08/2026.
//

import SwiftUI

struct SettingsView: View {
    @State private var viewModel: SettingsViewModel = SettingsViewModel()

    @AppStorage(.allSafeSearchEnabled) var allSafeSearchEnabled: Bool = true
    @AppStorage(.googleSafeSearchEnabled) var googleSafeSearchEnabled: Bool = true
    @AppStorage(.youtubeSafeSearchEnabled) var youtubeSafeSearchEnabled: Bool = true
    @AppStorage(.bingSafeSearchEnabled) var bingSafeSearchEnabled: Bool = true
    @AppStorage(.duckDuckGoSafeSearchEnabled) var duckDuckGoSafeSearchEnabled: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Configure Safe Search", systemImage: "staroflife.shield.fill")
                .font(.title2)

            VStack(alignment: .leading, spacing: 8) {
                ForEach(SettingsSafeSearch.allCases) { value in
                    switch value {
                    case .all:
                        SafeSearchSettingsToggle(isOn: $allSafeSearchEnabled, value: value)
                    case .google:
                        SafeSearchSettingsToggle(isOn: $googleSafeSearchEnabled, value: value)
                            .padding(8)
                            .disabled(allSafeSearchEnabled)
                    case .youtube:
                        SafeSearchSettingsToggle(isOn: $youtubeSafeSearchEnabled, value: value)
                            .padding(8)
                            .disabled(allSafeSearchEnabled)
                    case .bing:
                        SafeSearchSettingsToggle(isOn: $bingSafeSearchEnabled, value: value)
                            .padding(8)
                            .disabled(allSafeSearchEnabled)
                    case .duckDuckGo:
                        SafeSearchSettingsToggle(isOn: $duckDuckGoSafeSearchEnabled, value: value)
                            .padding(8)
                            .disabled(allSafeSearchEnabled)
                    }
                }
            }
            .disabled(viewModel.isLoading)
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
                            .frame(width: 15, height: 15)
                    }

                    Text(value.title)
                        .fontWeight(value == .all ? .some(.bold): .none)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                Toggle("", isOn: $isOn)
                    .toggleStyle(.switch)
                    .labelsHidden()
            }
        }
    }
}
