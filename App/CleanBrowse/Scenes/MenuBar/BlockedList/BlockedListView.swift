//
//  BlockedListView.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 28/02/2026.

import SwiftUI
import SwiftData

struct BlockedListView: View {
  @Query private var blockedDomains: [BlockedDomain]

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      VStack(alignment: .leading, spacing: .zero) {
        HStack(spacing: 4) {
          Image(systemName: "lock.shield")
            .font(.system(size: 12))
            .foregroundStyle(.black)

          Text("Custom Blocked Domains")
            .font(.title3)
            .frame(maxWidth: .infinity, alignment: .leading)
        }

        Divider()
          .padding(.horizontal, -16)
      }

      BlockedDomains(blockedDomains: blockedDomains)
        .padding(.top, 8)
    }
  }

  // MARK: - Private View
  struct BlockedDomains: View {
    @Environment(\.modelContext) private var modelContext
    private let viewModel: BlockedListViewModel = BlockedListViewModel()
    let blockedDomains: [BlockedDomain]

    var body: some View {
      if blockedDomains.isEmpty {
        Text("No Custom domains added yet")
          .font(.caption)
          .foregroundStyle(.tertiary)
          .padding(.vertical, 8)
          .padding(.horizontal, 16)
          .frame(maxWidth: .infinity, alignment: .center)
      } else {
        ScrollView {
          LazyVStack(alignment: .leading, spacing: 8) {
            ForEach(blockedDomains) { domain in
              BlockedDomainItemView(
                item: domain,
                removeAction: {
                  Task { await viewModel.removeFromList(domain: domain, form: modelContext)}
                })
            }
          }
        }
        .frame(maxHeight: 200)
      }
    }
  }

  struct BlockedDomainItemView: View {
    @State private var showRemoveButton: Bool = false
    let item: BlockedDomain
    let removeAction: () -> Void

    var body: some View {
      HStack(spacing: .zero) {
        Text(item.domain)
          .font(.system(size: 10))
          .fontDesign(.monospaced)
          .fontWeight(.semibold)
          .lineLimit(1)
          .frame(maxWidth: .infinity, alignment: .leading)


        Image(systemName: "x.circle.fill")
          .font(.caption)
          .foregroundStyle(Color(red: 153/255, green: 0/255, blue: 0))
          .opacity(showRemoveButton ? 1: 0)
          .onTapGesture(perform: removeAction)
      }
      .onContinuousHover { phase in
        switch phase {
          case .active:
            showRemoveButton = true
          case .ended:
            showRemoveButton = false
        }
      }
    }
  }
}
