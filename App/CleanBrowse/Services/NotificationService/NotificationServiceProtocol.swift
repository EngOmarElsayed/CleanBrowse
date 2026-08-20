//
//  NotificationServiceProtocol.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 20/08/2026.
//

import Foundation
import UserNotifications

protocol NotificationServiceProtocol {
    var authorizationStatus: UNAuthorizationStatus { get async }
    func send(_ message: String, title: String, subtitle: String?) async throws
    func ensureAuthorized() async throws
}
