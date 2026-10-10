//
//  BlockedListViewModel.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 10/10/2026.
//

import FactoryKit
import SwiftData

struct BlockedListViewModel {
  @Injected(\.dnsProfileService) private var dnsProfileService
  @Injected(\.analyticsService) private var analyticsService

  func removeFromList(domain item: BlockedDomain, form context: ModelContext) async {
    do {
      try await dnsProfileService.removeFromBlocklist(item.domain)
      context.delete(item)
      analyticsService.trackEvent(for: .customDomainRemoved(success: true))
    } catch {
      analyticsService.trackEvent(for: .customDomainRemoved(success: false))
    }
  }
}
