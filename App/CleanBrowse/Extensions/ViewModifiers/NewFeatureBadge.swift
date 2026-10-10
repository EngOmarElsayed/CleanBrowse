//
//  NewFeatureBadge.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 10/10/2026.
//

import SwiftUI

/// A small blue dot on the top-trailing corner of a control, used to point
/// users at a feature they haven't opened yet.
struct NewFeatureBadge: ViewModifier {
  let isVisible: Bool

  func body(content: Content) -> some View {
    content
      .overlay(alignment: .topTrailing) {
        if isVisible {
          Circle()
            .fill(.blue)
            .frame(width: 7, height: 7)
//            .offset(x: 3, y: -3)
            .allowsHitTesting(false)
            .accessibilityLabel("New")
            .transition(.scale.combined(with: .opacity))
        }
      }
      .animation(.easeOut(duration: 0.2), value: isVisible)
  }
}

extension View {
  func newFeatureBadge(isVisible: Bool) -> some View {
    modifier(NewFeatureBadge(isVisible: isVisible))
  }
}
