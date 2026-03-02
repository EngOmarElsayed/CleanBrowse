//
//  SwiftDataManager.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import SwiftData
import Foundation

final class SwiftDataManager {
    static let shared = SwiftDataManager()
    let container: ModelContainer
    let context: ModelContext
    
    private init() {
        do {
            let schema = Schema([
                BlockedDomain.self,
            ])
            let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
            container = try ModelContainer(for: schema, configurations: [configuration])
            context = ModelContext(container)
        } catch {
            fatalError("Failed to create ModelContainer: \(error)")
        }
    }
    
    // MARK: - fetch Operations
    func fetch<T: PersistentModel>(
        _ type: T.Type,
        predicate: Predicate<T>? = nil,
        sortBy: [SortDescriptor<T>] = []
    ) -> [T] {
        let descriptor = FetchDescriptor<T>(predicate: predicate, sortBy: sortBy)
        do {
            return try context.fetch(descriptor)
        } catch {
            print("Fetch failed for \(T.self): \(error)")
            return []
        }
    }
    
    func fetchCount<T: PersistentModel>(
        _ type: T.Type,
        predicate: Predicate<T>? = nil
    ) -> Int {
        let descriptor = FetchDescriptor<T>(predicate: predicate)
        return (try? context.fetchCount(descriptor)) ?? 0
    }
}
