//
//  TipsCardView.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 10/10/2026.
//

import SwiftUI
import SafariServices
import FactoryKit

struct TipsCardView: View {
  @AppStorage(.dismissedTips) private var dismissedTipsRaw: String = ""
  @State private var currentIndex: Int = 0
  @State private var isSafariExtensionEnabled: Bool = false
  @Injected(\.analyticsService) private var analyticsService
  let onAction: (TipCardCase) -> Void

  private var dismissedTips: Set<String> {
    Set(dismissedTipsRaw.split(separator: ",").map(String.init))
  }

  private var tips: [TipCardCase] {
    TipCardCase.allCases.filter { tip in
      if dismissedTips.contains(tip.rawValue) { return false }
      // No point suggesting the extension to someone who already turned it on.
      if tip == .safariBlur && isSafariExtensionEnabled { return false }
      return true
    }
  }

  var body: some View {
    Group {
      if !tips.isEmpty {
        let index = min(currentIndex, tips.count - 1)
        TipCard(
          tip: tips[index],
          index: index,
          count: tips.count,
          onNext: {
            analyticsService.trackEvent(for: .tipNextTapped(tips[index]))
            currentIndex = (index + 1) % tips.count
          },
          onDismiss: {
            analyticsService.trackEvent(for: .tipDismissed(tips[index]))
            retire(tips[index])
          },
          onAction: {
            let tip = tips[index]
            analyticsService.trackEvent(for: .tipActionTapped(tip))
            retire(tip)
            onAction(tip)
          }
        )
        .transition(.opacity)
      }
    }
    .animation(.easeInOut(duration: 0.2), value: tips)
    .task {
      isSafariExtensionEnabled = await SFSafariExtensionManager.isCleanBrowseExtensionEnabled()
    }
  }

  // MARK: - Private Methods
  private func retire(_ tip: TipCardCase) {
    var dismissed = dismissedTips
    dismissed.insert(tip.rawValue)
    dismissedTipsRaw = dismissed.sorted().joined(separator: ",")
  }

  // MARK: - Private View
  struct TipCard: View {
    let tip: TipCardCase
    let index: Int
    let count: Int
    let onNext: () -> Void
    let onDismiss: () -> Void
    let onAction: () -> Void

    var body: some View {
      VStack(alignment: .leading, spacing: 8) {
        TipCardDetails(
          index: index,
          count: count,
          tip: tip,
          onDismiss: onDismiss
        )

        HStack(alignment: .center, spacing: 8) {
          if count > 1 {
            TipsDots(
              currentIndex: index,
              count: count
            )
            .frame(
              maxWidth: .infinity,
              alignment: .leading
            )
          }


          TipsCardActionButtons(
            actionTitle: tip.actionTitle,
            count: count,
            onNext: onNext,
            onAction: onAction
          )
        }
        .padding(.leading, 26)
      }
      .padding(10)
      .background(Color.blue.opacity(0.08), in: RoundedRectangle(cornerRadius: 10))
      .overlay {
        RoundedRectangle(cornerRadius: 10)
          .strokeBorder(Color.blue.opacity(0.35), lineWidth: 0.5)
      }
    }
  }

  // MARK: - TipCardDetails
  struct TipCardDetails: View {
    let index: Int
    let count: Int
    let tip: TipCardCase
    let onDismiss: () -> Void

    var body: some View {
      HStack(alignment: .top, spacing: 8) {
        Image(systemName: tip.icon)
          .font(.system(size: 14))
          .foregroundStyle(.blue)
          .frame(width: 18)
          .padding(.top, 2)

        VStack(alignment: .leading, spacing: 2) {
          Group {
            if tip.isNew {
              Text("New · Tip \(index + 1) of \(count)")
            } else {
              Text("Tip \(index + 1) of \(count)")
            }
          }
          .font(.caption2)
          .foregroundStyle(.blue)

          Text(tip.title)
            .font(.callout)
            .fontWeight(.semibold)

          Text(tip.message)
            .font(.caption)
            .foregroundStyle(.secondary)
            .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)

        Button(action: onDismiss) {
          Image(systemName: "xmark")
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        .buttonStyle(.plain)
        .help("Dismiss tip")
      }
    }
  }

  // MARK: - TipsDots
  struct TipsDots: View {
    let currentIndex: Int
    let count: Int

    var body: some View {
      HStack(spacing: 4) {
        ForEach(0..<count, id: \.self) { dotIndex in
          Circle()
            .fill(dotIndex == currentIndex ? Color.blue : Color.secondary.opacity(0.35))
            .frame(width: 5, height: 5)
        }
      }
    }
  }

  // MARK: - TipsCardActionButtons
  struct TipsCardActionButtons: View {
    let actionTitle: LocalizedStringKey
    let count: Int
    let onNext: () -> Void
    let onAction: () -> Void

    var body: some View {
      HStack(alignment: .center, spacing: 8) {
        if count > 1 {
          Button("Next", action: onNext)
            .buttonStyle(.plain)
            .font(.caption)
            .foregroundStyle(.secondary)
        }

        Button(action: onAction) {
          Text(actionTitle)
            .font(.caption)
        }
        .buttonStyle(.borderedProminent)
        .controlSize(.small)
      }
    }
  }
}
