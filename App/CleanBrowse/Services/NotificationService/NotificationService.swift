//
//  NotificationService.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 20/08/2026.
//

import Foundation
import UserNotifications

final class NotificationService: NSObject {
    private let center = UNUserNotificationCenter.current()
    override init() {
        super.init()
        center.delegate = self
    }
}

// MARK: - NotificationServiceProtocol
extension NotificationService: NotificationServiceProtocol {
    var authorizationStatus: UNAuthorizationStatus {
        get async { await center.notificationSettings().authorizationStatus }
    }

    func send(
        _ message: String,
        title: String = "CleanBrowse",
        subtitle: String? = nil
    ) async throws {
        try await ensureAuthorized()

        let content = UNMutableNotificationContent()
        content.title = title
        content.body = message
        content.interruptionLevel = .timeSensitive
        if let subtitle { content.subtitle = subtitle }
        content.sound = .default

        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 3, repeats: false)
        )

        do {
            try await center.add(request)
        } catch {
            throw NotificationError.deliveryFailed(reason: error.localizedDescription)
        }
    }

    func ensureAuthorized() async throws {
        switch await authorizationStatus {
        case .notDetermined:
            let granted: Bool
            do {
                granted = try await center.requestAuthorization(options: [.alert, .sound, .badge, .criticalAlert])
            } catch {
                throw NotificationError.authorizationFailed(reason: error.localizedDescription)
            }
            guard granted else { throw NotificationError.authorizationDenied }

        case .denied:
            throw NotificationError.authorizationDenied

        default:
            break
        }
    }
}

// MARK: - UNUserNotificationCenterDelegate
extension NotificationService: UNUserNotificationCenterDelegate {
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification
    ) async -> UNNotificationPresentationOptions {
        [.banner, .list, .sound, .badge]
    }
}
