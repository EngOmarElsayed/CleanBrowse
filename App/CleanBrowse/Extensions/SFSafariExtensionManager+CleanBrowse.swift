//
//  SFSafariExtensionManager+CleanBrowse.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 03/10/2026.
//

import SafariServices

extension SFSafariExtensionManager {
    static let cleanBrowseExtensionIdentifier = "com.omarelsayed.cleanbrowse.extension"

    /// Whether the CleanBrowse Safari Web Extension is enabled in Safari ▸ Settings ▸ Extensions.
    static func isCleanBrowseExtensionEnabled() async -> Bool {
        await withCheckedContinuation { continuation in
            getStateOfSafariExtension(withIdentifier: cleanBrowseExtensionIdentifier) { state, _ in
                continuation.resume(returning: state?.isEnabled ?? false)
            }
        }
    }
}
