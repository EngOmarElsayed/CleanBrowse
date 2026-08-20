//
//  SafeSearchUseCases.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 15/08/2026.
//

import Foundation
import FactoryKit

// MARK: - AddSafeSearchEntryProtocol
protocol AddSafeSearchEntryProtocol {
    func callAsFunction(for value: SafeSearchEntrie) async throws
}

// MARK: - AddSafeSearchEntry
struct AddSafeSearchEntry {
    @Injected(\.hostFileService) private var hostFileService
    @Injected(\.notificationService) private var notificationService
}

// MARK: - Implemntation AddSafeSearchEntryProtocol
extension AddSafeSearchEntry: AddSafeSearchEntryProtocol {
    func callAsFunction(for value: SafeSearchEntrie) async throws {
        do {
            try await hostFileService.applySafeSearch(for: value)
            try? await notificationService.send("You are safe on \(value.name)", title: "Safe search enabled for \(value.name)", subtitle: nil)
        } catch {
            try? await notificationService.send("\(error.localizedDescription)", title: "Safe search couldn't be for \(value.name)", subtitle: nil)
            throw error
        }
    }
}

// MARK: - AddAllSafeSearchEntryProtocol
protocol AddAllSafeSearchEntryProtocol {
    func callAsFunction() async throws
}

// MARK: - AddAllSafeSearchEntry
struct AddAllSafeSearchEntry {
    @Injected(\.hostFileService) private var hostFileService
    @Injected(\.notificationService) private var notificationService
}

// MARK: - Implemntation AddAllSafeSearchEntryProtocol
extension AddAllSafeSearchEntry: AddAllSafeSearchEntryProtocol {
    func callAsFunction() async throws {
        do {
            try await hostFileService.applySafeSearch()
            try? await notificationService.send("You are safe on all search engines", title: "Safe search enabled", subtitle: nil)
        } catch {
            try? await notificationService.send("\(error.localizedDescription)", title: "Safe search couldn't be enabled", subtitle: nil)
            throw error
        }
    }
}

// MARK: - RemoveAllSafeSearchEntryProtocol
protocol RemoveAllSafeSearchEntryProtocol {
    func callAsFunction() async throws
}

// MARK: - RemoveAllSafeSearchEntry
struct RemoveAllSafeSearchEntry {
    @Injected(\.hostFileService) private var hostFileService
    @Injected(\.notificationService) private var notificationService
}

// MARK: - Implemntation RemoveAllSafeSearchEntryProtocol
extension RemoveAllSafeSearchEntry: RemoveAllSafeSearchEntryProtocol {
    func callAsFunction() async throws {
        do {
            try await hostFileService.removeAllSafeSearchFeatures()
            try? await notificationService.send("Be careful while browsing internet", title: "Safe search is disabled", subtitle: nil)
        } catch {
            try? await notificationService.send("\(error.localizedDescription)", title: "Safe search couldn't be disabled", subtitle: nil)
            throw error
        }
    }
}

// MARK: - RemoveSafeSearchEntryProtocol
protocol RemoveSafeSearchEntryProtocol {
    func callAsFunction(for value: SafeSearchEntrie) async throws
}

// MARK: - RemoveSafeSearchEntry
struct RemoveSafeSearchEntry {
    @Injected(\.hostFileService) private var hostFileService
    @Injected(\.notificationService) private var notificationService
}

// MARK: - Implemntation RemoveSafeSearchEntryProtocol
extension RemoveSafeSearchEntry: RemoveSafeSearchEntryProtocol {
    func callAsFunction(for value: SafeSearchEntrie) async throws {
        do {
            try await hostFileService.removeSafeSearch(for: value)
            try? await notificationService.send("Be careful while browsing internet on \(value.name)", title: "Safe search is disabled", subtitle: nil)
        } catch {
            try? await notificationService.send("\(error.localizedDescription)", title: "Safe search couldn't be disabled", subtitle: nil)
            throw error
        }
    }
}
