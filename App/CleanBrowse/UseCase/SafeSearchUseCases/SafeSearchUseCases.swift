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
}

// MARK: - Implemntation AddSafeSearchEntryProtocol
extension AddSafeSearchEntry: AddSafeSearchEntryProtocol {
    func callAsFunction(for value: SafeSearchEntrie) async throws {
        try await hostFileService.applySafeSearch(for: value)
    }
}

// MARK: - AddAllSafeSearchEntryProtocol
protocol AddAllSafeSearchEntryProtocol {
    func callAsFunction() async throws
}

// MARK: - AddAllSafeSearchEntry
struct AddAllSafeSearchEntry {
    @Injected(\.hostFileService) private var hostFileService
}

// MARK: - Implemntation AddAllSafeSearchEntryProtocol
extension AddAllSafeSearchEntry: AddAllSafeSearchEntryProtocol {
    func callAsFunction() async throws {
        try await hostFileService.applySafeSearch()
    }
}

// MARK: - RemoveAllSafeSearchEntryProtocol
protocol RemoveAllSafeSearchEntryProtocol {
    func callAsFunction() async throws
}

// MARK: - RemoveAllSafeSearchEntry
struct RemoveAllSafeSearchEntry {
    @Injected(\.hostFileService) private var hostFileService
}

// MARK: - Implemntation RemoveAllSafeSearchEntryProtocol
extension RemoveAllSafeSearchEntry: RemoveAllSafeSearchEntryProtocol {
    func callAsFunction() async throws {
        try await hostFileService.removeAllSafeSearchFeatures()
    }
}

// MARK: - RemoveSafeSearchEntryProtocol
protocol RemoveSafeSearchEntryProtocol {
    func callAsFunction(for value: SafeSearchEntrie) async throws
}

// MARK: - RemoveSafeSearchEntry
struct RemoveSafeSearchEntry {
    @Injected(\.hostFileService) private var hostFileService
}

// MARK: - Implemntation RemoveSafeSearchEntryProtocol
extension RemoveSafeSearchEntry: RemoveSafeSearchEntryProtocol {
    func callAsFunction(for value: SafeSearchEntrie) async throws {
        try await hostFileService.removeSafeSearch(for: value)
    }
}
