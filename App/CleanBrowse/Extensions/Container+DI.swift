//
//  Container+DI.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 15/08/2026.
//

import FactoryKit
import Sparkle

extension Container {
    var hostFileService: Factory<HostsFileService> {
        self { HostsFileService() }.singleton
    }

    var notificationService: Factory<NotificationServiceProtocol> {
        self { NotificationService() }.singleton
    }

    var analyticsService: Factory<CleanBrowseAnalyticsProtocol> {
        self { CleanBrowseAnalytics() }.singleton
    }

@MainActor
    var updateService: Factory<SPUStandardUpdaterController> {
        self {
            SPUStandardUpdaterController(
                startingUpdater: true, updaterDelegate: nil, userDriverDelegate: nil
            )
        }.singleton
    }
}
