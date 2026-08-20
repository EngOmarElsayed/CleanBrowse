//
//  CleanBrowseApp.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import SwiftUI
import SwiftData

@main
struct CleanBrowseApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    var body: some Scene {
        MenuBarExtra("CleanBrowse", systemImage: "staroflife.shield.fill") {
            MenuBarContentView()
                .modelContainer(SwiftDataManager.shared.container)
                .environment(appDelegate.dnsProfileService)
        }
        .menuBarExtraStyle(.window)

        Settings {
            SettingsView()
        }
    }
}
