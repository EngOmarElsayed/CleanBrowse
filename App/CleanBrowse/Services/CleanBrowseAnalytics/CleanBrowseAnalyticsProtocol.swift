//
//  CleanBrowseAnalyticsProtocol.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/08/2026.
//

import Foundation

protocol CleanBrowseAnalyticsProtocol {
    func inilizeAnalytics()
    func trackEvent(for eventName: String, properties: [String: String]?)
}
