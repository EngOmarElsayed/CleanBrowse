//
//  DNSProxyExtension.swift
//  CleanBrowse
//
//  Created by Omar Elsayed on 03/10/2026.
//

import Foundation
import SystemExtensions
import NetworkExtension

// MARK: - DNSProxyExtensionMangerProtocol
protocol DNSProxyExtensionMangerProtocol {
  @concurrent func activateAndInstallProxyExtension() async
  @concurrent func checkProxyStatus() async
  @concurrent func isProxyEnabled() async -> Bool
  @concurrent func deactivateProxy() async
}

// MARK: - DNSProxyExtensionManger
final class DNSProxyExtensionManger: NSObject {

  /// Whether an activation/deactivation is in progress.
  var isInstalling: Bool = false

  /// Whether the DNS proxy is currently active.
  var isProxyActive: Bool = false

  /// Whether the system extension is installed.
  var isExtensionInstalled: Bool = false

  /// The bundle identifier of the DNS Proxy extension.
  private let proxyBundleIdentifier = "com.omarelsayed.cleanbrowse.proxy"

  /// Continuation for async extension installation.
  private var installationContinuation: CheckedContinuation<Void, Error>?
}

// MARK: - Protocol Implemntation
extension DNSProxyExtensionManger: DNSProxyExtensionMangerProtocol {
  /// Activates the DNS Proxy extension.
  ///
  /// This loads the DNS proxy manager configuration and enables it.
  /// The user will be prompted by macOS to allow the network extension
  /// in **System Settings → Privacy & Security → Network Extensions**.
  @concurrent func activateAndInstallProxyExtension() async {
    do {
      // Step 1: Install the system extension
      isInstalling = true
      try await installSystemExtension()
      isExtensionInstalled = true
      NSLog("[CleanBrowse] System extension installed successfully")

      // Step 2: Activate the DNS proxy
      try await activateDNSProxy()
      isProxyActive = true
      NSLog("[CleanBrowse] DNS proxy activated successfully")
    } catch {
      NSLog("[CleanBrowse] Failed to install/activate: \(error)")
    }

    isInstalling = false
  }

  /// Checks the current status of the DNS proxy.
  @concurrent func checkProxyStatus() async {
    do {
      let manager = NEDNSProxyManager.shared()
      try await manager.loadFromPreferences()
      isProxyActive = manager.isEnabled
      NSLog("[CleanBrowse] DNS proxy status: \(isProxyActive ? "active" : "inactive")")
    } catch {
      isProxyActive = false
      NSLog("[CleanBrowse] Failed to check proxy status: \(error)")
    }
  }

  /// Whether the DNS proxy is currently enabled in the system's network preferences.
  @concurrent func isProxyEnabled() async -> Bool {
    let manager = NEDNSProxyManager.shared()
    guard (try? await manager.loadFromPreferences()) != nil else { return false }
    return manager.isEnabled
  }

  /// Deactivates the DNS Proxy extension.
  @concurrent func deactivateProxy() async {
    do {
      let manager = NEDNSProxyManager.shared()
      try await manager.loadFromPreferences()
      manager.isEnabled = false
      try await manager.saveToPreferences()
      isProxyActive = false
      NSLog("[CleanBrowse] DNS proxy deactivated")
    } catch {
      NSLog("[CleanBrowse] Failed to deactivate proxy: \(error)")
    }
  }
}

// MARK: - Private Methods
private extension DNSProxyExtensionManger {
  /// Requests installation of the system extension.
  @concurrent private func installSystemExtension() async throws {
    try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
      self.installationContinuation = continuation

      let request = OSSystemExtensionRequest.activationRequest(
        forExtensionWithIdentifier: proxyBundleIdentifier,
        queue: .global()
      )
      request.delegate = self
      OSSystemExtensionManager.shared.submitRequest(request)

      NSLog("[CleanBrowse] Submitted system extension activation request")
    }
  }

  /// Internal method to activate the DNS proxy after extension is installed.
  @concurrent private func activateDNSProxy() async throws {
    let manager = NEDNSProxyManager.shared()
    try await manager.loadFromPreferences()

    let providerProtocol = NEDNSProxyProviderProtocol()
    providerProtocol.providerBundleIdentifier = proxyBundleIdentifier

    manager.providerProtocol = providerProtocol
    manager.isEnabled = true

    try await manager.saveToPreferences()
    try await manager.loadFromPreferences()
  }
}

// MARK: - OSSystemExtensionRequestDelegate
extension DNSProxyExtensionManger: OSSystemExtensionRequestDelegate {
  nonisolated func request(_ request: OSSystemExtensionRequest, actionForReplacingExtension existing: OSSystemExtensionProperties, withExtension ext: OSSystemExtensionProperties) -> OSSystemExtensionRequest.ReplacementAction {
    NSLog("[CleanBrowse] Replacing existing extension \(existing.bundleIdentifier) with \(ext.bundleIdentifier)")
    return .replace
  }

  nonisolated func requestNeedsUserApproval(_ request: OSSystemExtensionRequest) {
    NSLog("[CleanBrowse] System extension needs user approval - check System Settings → Privacy & Security → Network Extensions")
  }

  nonisolated func request(_ request: OSSystemExtensionRequest, didFinishWithResult result: OSSystemExtensionRequest.Result) {
    NSLog("[CleanBrowse] System extension request finished with result: \(result.rawValue)")

    switch result {
      case .completed:
        self.installationContinuation?.resume()
      case .willCompleteAfterReboot:
        self.installationContinuation?.resume(throwing: NSError(
          domain: "DNSProfileService",
          code: 1,
          userInfo: [NSLocalizedDescriptionKey: "System extension will be available after reboot"]
        ))
      @unknown default:
        self.installationContinuation?.resume()
    }

    self.installationContinuation = nil
  }

  nonisolated func request(_ request: OSSystemExtensionRequest, didFailWithError error: Error) {
    NSLog("[CleanBrowse] System extension request failed: \(error)")
    self.installationContinuation?.resume(throwing: error)
    self.installationContinuation = nil
  }
}

