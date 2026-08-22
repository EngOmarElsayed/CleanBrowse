//
//  Container+DI.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 15/08/2026.
//

import FactoryKit

extension Container {
    var hostFileService: Factory<HostsFileService> {
        self { HostsFileService() }.singleton
    }

    var notificationService: Factory<NotificationServiceProtocol> {
        self { NotificationService() }.singleton
    }
}
