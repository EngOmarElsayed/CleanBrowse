//
//  MenuBarContentView.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import SwiftUI
import AppKit
import FactoryKit
import UserNotifications

//@Environment(\.modelContext) private var modelContext
//@Query(sort: \BlockedDomain.dateAdded, order: .reverse) private var blockedDomains: [BlockedDomain]

struct MenuBarContentView: View {
    @State private var showSettings: Bool = false
    @State private var isNotificationAuth: Bool = false
    @Injected(\.notificationService) private var notificationService

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 4) {
                StatusHeaderView(isNotificationAuth: isNotificationAuth)
                    .padding([.horizontal, .top], 16)

                AddDomainView()
            }

            Divider()

            HStack(alignment: .center) {
                Button {
                    showSettings = true
                } label: {
                    Image(systemName: "gearshape")
                        .font(.caption)
                }
                .popover(isPresented: $showSettings, arrowEdge: .bottom) {
                    SettingsView()
                        .padding(16)
                        .frame(width: 280, alignment: .leading)
                }

                Spacer()

                Button {
                    NSApp.terminate(nil)
                } label: {
                    Image(systemName: "power")
                        .font(.caption)
                }
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 16)
        }
        .frame(width: 340)
        .task { isNotificationAuth = await notificationService.authorizationStatus == .authorized }
    }
}
