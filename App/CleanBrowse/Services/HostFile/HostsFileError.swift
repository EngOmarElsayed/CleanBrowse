//
//  HostsFileError.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 20/08/2026.
//

import Foundation

/// Errors thrown while reading or modifying `/etc/hosts`.
enum HostsFileError: LocalizedError, CustomStringConvertible, Equatable, Sendable {
    /// `/etc/hosts` could not be read.
    case readFailed(reason: String)
    /// The staging file in the temporary directory could not be written.
    case tempFileWriteFailed(reason: String)
    /// The `# CleanBrowse START` / `# CleanBrowse END` block is missing from `/etc/hosts`.
    case blockNotFound
    /// The user dismissed the admin password dialog (`-128` / "User canceled").
    case adminPasswordRequired
    /// `osascript` ran but exited with a non-zero status.
    case writeFailed(reason: String)
    /// `osascript` could not be launched at all.
    case privilegedCommandFailed(reason: String)
 
    var description: String {
        switch self {
        case .readFailed(let reason):
            "Failed to read /etc/hosts: \(reason)"
        case .tempFileWriteFailed(let reason):
            "Failed to write temp file: \(reason)"
        case .blockNotFound:
            "CleanBrowse block not found in /etc/hosts."
        case .adminPasswordRequired:
            "Admin password required to modify blocked sites."
        case .writeFailed(let reason):
            "Failed to write hosts file: \(reason)"
        case .privilegedCommandFailed(let reason):
            "Failed to run privileged command: \(reason)"
        }
    }
 
    var errorDescription: String? { description }
}
