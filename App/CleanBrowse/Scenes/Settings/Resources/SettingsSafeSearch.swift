//
//  SettingsSafeSearch.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 18/08/2026.
//

import Foundation

enum SettingsSafeSearch: CaseIterable, Identifiable {
    case all
    case google
    case bing
    case youtube
    case duckDuckGo

    var title: String {
        switch self {
        case .google:
            return "Google"
        case .bing:
            return "Bing"
        case .youtube:
            return "Youtube"
        case .duckDuckGo:
            return "DuckDuckGo"
        case .all:
            return "All"
        }
    }

    var icon: String {
        switch self {
        case .google:
            return "ic-google"
        case .bing:
            return "ic-bing"
        case .youtube:
            return "ic-youtube"
        case .duckDuckGo:
            return "ic-duckduckgo"
        case .all:
            return ""
        }
    }

    var id: UUID { UUID() }
}

// MARK: - Mapper
extension SettingsSafeSearch {
    static func mapToDomain(value: Self) -> SafeSearchEntrie? {
        switch value {
        case .all:
            return nil
        case .google:
            return .google
        case .bing:
            return .bing
        case .youtube:
            return .youtube
        case .duckDuckGo:
            return .duckOnDuck
        }
    }
}
