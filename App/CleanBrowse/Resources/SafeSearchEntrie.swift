//
//  SafeSearchEntries.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import Foundation
import Playgrounds
import AppKit

// MARK: - SafeSearchEntries
enum SafeSearchEntrie {
    case google
    case youtube
    case bing
    case duckOnDuck
    
    var name: String {
        switch self {
        case .google:
            return "Google"
        case .youtube:
            return "Youtube"
        case .bing:
            return "Bing"
        case .duckOnDuck:
            return "DuckOnDuck"
        }
    }
    
    var hostEntry: String? {
        switch self {
        case .google:
            guard let url = Bundle.main.url(forResource: "google_hosts", withExtension: "txt") else { return nil }
            let contents = try? String(contentsOf: url, encoding: .utf8)
            return contents
        case .youtube:
            guard let url = Bundle.main.url(forResource: "youtube_host", withExtension: "txt") else { return nil }
            let contents = try? String(contentsOf: url, encoding: .utf8)
            return contents
        case .bing:
            guard let url = Bundle.main.url(forResource: "bing_hosts", withExtension: "txt") else { return nil }
            let contents = try? String(contentsOf: url, encoding: .utf8)
            return contents
        case .duckOnDuck:
            guard let url = Bundle.main.url(forResource: "duck_hosts", withExtension: "txt") else { return nil }
            let contents = try? String(contentsOf: url, encoding: .utf8)
            return contents
        }
    }

    static let allEntries: [SafeSearchEntrie] = [.google, .youtube, .bing, .duckOnDuck]
}
