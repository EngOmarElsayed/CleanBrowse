//
//  InjectedVales.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 15/08/2026.
//

import Foundation
import FactoryKit

extension Container {
    var addSafeSearchEntry: Factory<AddSafeSearchEntryProtocol> {
        self { AddSafeSearchEntry() }
    }

    var addAllSafeSearchEntry: Factory<AddAllSafeSearchEntryProtocol> {
        self { AddAllSafeSearchEntry() }
    }

    var removeAllSafeSearchEntry: Factory<RemoveAllSafeSearchEntryProtocol> {
        self { RemoveAllSafeSearchEntry() }
    }

    var removeSafeSearchEntry: Factory<RemoveSafeSearchEntryProtocol> {
        self { RemoveSafeSearchEntry() }
    }
}
