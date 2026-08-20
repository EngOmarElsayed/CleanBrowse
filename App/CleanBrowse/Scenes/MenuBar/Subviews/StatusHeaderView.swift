//
//  StatusHeaderView.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import SwiftUI

struct StatusHeaderView: View {
    let isNotificationAuth: Bool

    @State private var enabledSafeSearchs: [SettingsSafeSearch] = []
    @AppStorage(.allSafeSearchEnabled) private var allSafeSearchEnabled: Bool = true
    @AppStorage(.googleSafeSearchEnabled) private var googleSafeSearchEnabled: Bool = true
    @AppStorage(.youtubeSafeSearchEnabled) private var youtubeSafeSearchEnabled: Bool = true
    @AppStorage(.bingSafeSearchEnabled) private var bingSafeSearchEnabled: Bool = true
    @AppStorage(.duckDuckGoSafeSearchEnabled) private var duckDuckGoSafeSearchEnabled: Bool = true

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "staroflife.shield.fill")
                .font(.system(size: 32))
                .foregroundStyle(.green)

            VStack(alignment: .leading, spacing: 4) {
                Text(allSafeSearchEnabled ? "Protected": "Semi-Protected")
                    .font(.headline)
                    .foregroundStyle(allSafeSearchEnabled ? .green: .orange)

                if !isNotificationAuth {
                    Text("Please enable notifcation")
                        .lineLimit(2)
                        .font(.subheadline)
                        .foregroundStyle(.red)
                }

                Text("All adult sites are blocked")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                if enabledSafeSearchs.isEmpty {
                    Text("SafeSearch is disabled take care !!")
                        .font(.caption)
                        .foregroundStyle(.red)
                } else {
                    HStack(spacing: 4) {
                        Text("SafeSearch Enabled on")
                            .font(.caption)
                            .foregroundStyle(.secondary)

                        ZStack(alignment: .center) {
                            ForEach(Array(enabledSafeSearchs.enumerated()), id: \.offset) { offset, element in
                                SearchEngineIcon(image: element.icon)
                                    .offset(x: CGFloat(offset*10))
                            }
                        }
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .onChange(of: googleSafeSearchEnabled) { oldValue, newValue in
            guard newValue || allSafeSearchEnabled else {
                enabledSafeSearchs.removeAll(where: { $0 == .google })
                return
            }
            appendToEnabledSafeSearchs(.google)
        }
        .onChange(of: youtubeSafeSearchEnabled) { oldValue, newValue in
            guard newValue || allSafeSearchEnabled else {
                enabledSafeSearchs.removeAll(where: { $0 == .youtube })
                return
            }
            appendToEnabledSafeSearchs(.youtube)
        }
        .onChange(of: bingSafeSearchEnabled) { oldValue, newValue in
            guard newValue || allSafeSearchEnabled else {
                enabledSafeSearchs.removeAll(where: { $0 == .bing })
                return
            }
            appendToEnabledSafeSearchs(.bing)
        }
        .onChange(of: duckDuckGoSafeSearchEnabled) { oldValue, newValue in
            guard newValue || allSafeSearchEnabled else {
                enabledSafeSearchs.removeAll(where: { $0 == .duckDuckGo })
                return
            }
            appendToEnabledSafeSearchs(.duckDuckGo)
        }
        .onAppear {
            if googleSafeSearchEnabled || allSafeSearchEnabled {
                appendToEnabledSafeSearchs(.google)
            }

            if youtubeSafeSearchEnabled || allSafeSearchEnabled {
                appendToEnabledSafeSearchs(.youtube)
            }
            
            if bingSafeSearchEnabled || allSafeSearchEnabled {
                appendToEnabledSafeSearchs(.bing)
            }
            
            if duckDuckGoSafeSearchEnabled || allSafeSearchEnabled {
                appendToEnabledSafeSearchs(.duckDuckGo)
            }
        }
    }
    
    // MARK: - Private method
    private func appendToEnabledSafeSearchs(_ value: SettingsSafeSearch) {
        guard enabledSafeSearchs.contains(value) == false else { return }
        enabledSafeSearchs.append(value)
    }

    // MARK: - SearchEngineIcon
    struct SearchEngineIcon: View {
        let image: String

        var body: some View {
            Image(image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 10, height: 10)
                .padding(2.5)
                .background {
                    Circle().foregroundStyle(.white)
                }
                .overlay {
                    Circle()
                        .stroke(lineWidth: 1.4)
                        .foregroundStyle(.black)
                }
        }
    }
}

#Preview {
    StatusHeaderView(isNotificationAuth: false)
}
