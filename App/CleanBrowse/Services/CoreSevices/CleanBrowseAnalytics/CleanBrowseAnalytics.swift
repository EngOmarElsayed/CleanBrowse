//
//  CleanBrowseAnalytics.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/08/2026.
//

import Aptabase

struct CleanBrowseAnalytics {
    let analyticsService = Aptabase.shared
    let appKey = "A-EU-9037300079"
}

// MARK: - CleanBrowseAnalyticsProtocol
extension CleanBrowseAnalytics: CleanBrowseAnalyticsProtocol {
    func inilizeAnalytics() {
        analyticsService.initialize(appKey: appKey)
    }
    
    func trackEvent(for eventName: String, properties: [String : String]?) {
        if let properties {
            analyticsService.trackEvent(eventName, with: properties)
        } else {
            analyticsService.trackEvent(eventName)
        }
    }
}
