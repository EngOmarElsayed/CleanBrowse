//
//  DNSProxyProvider.swift
//  proxy
//
//  Created by Omar Elsayed on 24/02/2026.
//

import NetworkExtension
import os

class DNSProxyProvider: NEDNSProxyProvider {
    private let logger = Logger(subsystem: "com.omarelsayed.cleanbrowse.network-extension", category: "dns")

    override func startProxy(options:[String: Any]? = nil, completionHandler: @escaping (Error?) -> Void) {
        // Add code here to start the DNS proxy.
        logger.info("We are Ready")
        completionHandler(nil)
    }

    override func stopProxy(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        // Add code here to stop the DNS proxy.
        completionHandler()
    }

    override func sleep(completionHandler: @escaping () -> Void) {
        // Add code here to get ready to sleep.
        completionHandler()
    }

    override func wake() {
        // Add code here to wake up.
    }

    override func handleNewFlow(_ flow: NEAppProxyFlow) -> Bool {
        // Add code here to handle the incoming flow.
        logger.info("We are Ready to block \(flow.remoteHostname ?? "")")
        return false
    }

}
