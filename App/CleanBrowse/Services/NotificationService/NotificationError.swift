//
//  NotificationError.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 20/08/2026.
//

import Foundation

/// Errors thrown while requesting permission for, or delivering, a local notification.
enum NotificationError: LocalizedError, CustomStringConvertible, Equatable, Sendable {
    /// The user has turned notifications off for this app in System Settings.
    case authorizationDenied
    /// The system failed to process the authorization request.
    case authorizationFailed(reason: String)
    /// The notification request was rejected by the notification center.
    case deliveryFailed(reason: String)

    var description: String {
        switch self {
        case .authorizationDenied:
            "Notifications are disabled for CleanBrowse. Enable them in System Settings › Notifications."
        case .authorizationFailed(let reason):
            "Failed to request notification permission: \(reason)"
        case .deliveryFailed(let reason):
            "Failed to deliver notification: \(reason)"
        }
    }

    var errorDescription: String? { description }
}
