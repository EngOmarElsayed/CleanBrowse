//
//  CleanBrowseTip.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 10/10/2026.
//

import SwiftUI

enum TipCardCase: String, CaseIterable, Identifiable {
  case safariBlur
  case customBlockList
  case safeSearch

  var id: String { rawValue }

  var isNew: Bool {
    switch self {
    case .safariBlur, .customBlockList: true
    case .safeSearch: false
    }
  }

  var icon: String {
    switch self {
    case .safariBlur: "puzzlepiece.extension"
    case .customBlockList: "list.bullet"
    case .safeSearch: "magnifyingglass"
    }
  }

  var title: LocalizedStringKey {
    switch self {
    case .safariBlur: "Blur explicit images in Safari"
    case .customBlockList: "Block any site you choose"
    case .safeSearch: "Choose where SafeSearch applies"
    }
  }

  var message: LocalizedStringKey {
    switch self {
    case .safariBlur: "Images and videos are checked on your Mac and blurred before you see them."
    case .customBlockList: "Add a domain above, then view or remove your blocked domains anytime."
    case .safeSearch: "Turn SafeSearch on or off for Google, YouTube, Bing, and DuckDuckGo."
    }
  }

  var actionTitle: LocalizedStringKey {
    switch self {
    case .safariBlur: "Turn on in Safari"
    case .customBlockList: "View list"
    case .safeSearch: "Open settings"
    }
  }
}
