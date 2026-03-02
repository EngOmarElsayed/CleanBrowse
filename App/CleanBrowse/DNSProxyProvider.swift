//
//  DNSProxyProvider.swift
//  DNSProxy
//
//  Created by Omar Elsayed on 13/02/2026.
//

import NetworkExtension
import os

/// A DNS proxy provider that intercepts all DNS queries on the system.
///
/// When a blocked domain is queried (any record type — A, AAAA, HTTPS/Type 65, etc.),
/// the provider returns an NXDOMAIN response, preventing Safari and all other apps
/// from resolving the domain. Non-blocked queries are forwarded to the upstream DNS server.
///
/// The blocklist is loaded from a shared App Group container so that the main
/// CleanBrowse app can update it without restarting the extension.
///
/// ### Reload Strategy
///
/// The extension listens for a Darwin notification (`com.omarelsayed.cleanbrowse.blocklistUpdated`)
/// posted by the main app whenever the blocklist changes. This avoids polling and ensures
/// the extension only reloads when a user actually adds a custom domain.
//class DNSProxyProvider: NEDNSProxyProvider {
//
//    /// Set of blocked domains loaded from the shared container.
//    private var blockedDomains: Set<String> = []
//
//    /// Whether a reload has been requested via Darwin notification.
//    private var needsReload = false
//
//    /// Upstream DNS server address.
//    private let upstreamDNS = "8.8.8.8"
//    private let upstreamPort: UInt16 = 53
//
//    /// The App Group identifier.
//    private let appGroupID = "group.com.omarelsayed.cleanbrowse"
//
//    // DNS logger for debugging purposes (can be removed in production)
//    private let logger = Logger(subsystem: "com.omarelsayed.cleanbrowse.network-extension", category: "dns")
//
//    /// The Darwin notification name used to signal blocklist updates.
//    private static let reloadNotification = "com.omarelsayed.cleanbrowse.blocklistUpdated" as CFString
//
//    // MARK: - Lifecycle
//
//    override func startProxy(options: [String: Any]? = nil, completionHandler: @escaping (Error?) -> Void) {
//        logger.info("[CleanBrowse DNS] Starting DNS proxy...")
//        loadBlocklist()
//        registerForReloadNotification()
//        logger.info("[CleanBrowse DNS] Loaded \(blockedDomains.count) blocked domains")
//        completionHandler(nil)
//    }
//
//    override func stopProxy(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
//        logger.error("[CleanBrowse DNS] Stopping DNS proxy, reason: \(reason.rawValue)")
//        CFNotificationCenterRemoveEveryObserver(
//            CFNotificationCenterGetDarwinNotifyCenter(),
//            Unmanaged.passUnretained(self).toOpaque()
//        )
//        completionHandler()
//    }
//
//    // MARK: - Darwin Notification (Cross-Process Reload Signal)
//
//    /// Registers for the Darwin notification that the main app posts when the blocklist changes.
//    private func registerForReloadNotification() {
//        let observer = Unmanaged.passUnretained(self).toOpaque()
//
//        CFNotificationCenterAddObserver(
//            CFNotificationCenterGetDarwinNotifyCenter(),
//            observer,
//            { _, observer, _, _, _ in
//                guard let observer = observer else { return }
//                let provider = Unmanaged<DNSProxyProvider>.fromOpaque(observer).takeUnretainedValue()
//                NSLog("[CleanBrowse DNS] Received reload notification from main app")
//                provider.needsReload = true
//            },
//            DNSProxyProvider.reloadNotification,
//            nil,
//            .deliverImmediately
//        )
//
//        logger.info("[CleanBrowse DNS] Registered for blocklist reload notifications")
//    }
//
//    // MARK: - DNS Flow Handling
//
//    override func handleNewFlow(_ flow: NEAppProxyFlow) -> Bool {
//        logger.info("[CleanBrowse DNS] handleNewFlow called")
//        guard let udpFlow = flow as? NEAppProxyUDPFlow else {
//            logger.warning("[CleanBrowse DNS] Flow is not UDP, ignoring")
//            return false
//        }
//
//        handleDNSFlow(udpFlow)
//        return true
//    }
//
//    override func handleNewUDPFlow(_ flow: NEAppProxyUDPFlow, initialRemoteEndpoint remoteEndpoint: NWEndpoint) -> Bool {
//        logger.info("[CleanBrowse DNS] handleNewUDPFlow called for endpoint: \(String(describing: remoteEndpoint))")
//        handleDNSFlow(flow)
//        return true
//    }
//
//    private func handleDNSFlow(_ flow: NEAppProxyUDPFlow) {
//        logger.info("[CleanBrowse DNS] Opening flow...")
//        flow.open(withLocalEndpoint: nil) { [weak self] error in
//            guard let self = self else { return }
//            if let error = error {
//                self.logger.error("[CleanBrowse DNS] Failed to open flow: \(error.localizedDescription)")
//                flow.closeReadWithError(error)
//                flow.closeWriteWithError(error)
//                return
//            }
//            self.logger.info("[CleanBrowse DNS] Flow opened successfully, starting to read")
//            self.readFromFlow(flow)
//        }
//    }
//
//    private func readFromFlow(_ flow: NEAppProxyUDPFlow) {
//        flow.readDatagrams { [weak self] datagrams, endpoints, error in
//            guard let self = self else { return }
//            
//            if let error = error {
//                self.logger.error("[CleanBrowse DNS] Read error: \(error.localizedDescription)")
//                flow.closeReadWithError(error)
//                flow.closeWriteWithError(error)
//                return
//            }
//
//            guard let datagrams = datagrams, let endpoints = endpoints else {
//                self.logger.warning("[CleanBrowse DNS] No datagrams received")
//                return
//            }
//
//            self.logger.info("[CleanBrowse DNS] Received \(datagrams.count) datagrams")
//            
//            for (index, datagram) in datagrams.enumerated() {
//                self.processDNSQuery(datagram, flow: flow, remoteEndpoint: endpoints[index])
//            }
//
//            self.readFromFlow(flow)
//        }
//    }
//
//    // MARK: - DNS Packet Processing
//
//    private func processDNSQuery(_ queryData: Data, flow: NEAppProxyUDPFlow, remoteEndpoint: NWEndpoint) {
//        // Reload blocklist if the main app signaled a change
//        if needsReload {
//            needsReload = false
//            loadBlocklist()
//        }
//
//        guard let domainName = parseDomainFromDNS(queryData) else {
//            forwardToUpstream(queryData, flow: flow, remoteEndpoint: remoteEndpoint)
//            return
//        }
//
//        let normalizedDomain = domainName.lowercased()
//
//        if normalizedDomain.contains("google.com") {
//            logger.info("[CleanBrowse DNS] BLOCKED: \(normalizedDomain)")
//            let nxdomainResponse = buildNXDOMAINResponse(for: queryData)
//            flow.writeDatagrams([nxdomainResponse], sentBy: [remoteEndpoint]) { [weak self] error in
//                if let error = error {
//                    self?.logger.error("[CleanBrowse DNS] Write error: \(error.localizedDescription)")
//                } else {
//                    self?.logger.info("[CleanBrowse DNS] NXDOMAIN response sent for \(normalizedDomain)")
//                }
//            }
//        } else {
//            forwardToUpstream(queryData, flow: flow, remoteEndpoint: remoteEndpoint)
//        }
//    }
//
//    /// Checks if a domain or any of its parent domains are in the blocklist.
//    private func isDomainBlocked(_ domain: String) -> Bool {
//        if blockedDomains.contains(domain) {
//            return true
//        }
//
//        // Check without www.
//        if domain.hasPrefix("www.") {
//            let withoutWWW = String(domain.dropFirst(4))
//            if blockedDomains.contains(withoutWWW) {
//                return true
//            }
//        }
//
//        // Check parent domains (e.g., sub.example.com → example.com)
//        var components = domain.split(separator: ".")
//        while components.count > 2 {
//            components.removeFirst()
//            let parent = components.joined(separator: ".")
//            if blockedDomains.contains(parent) {
//                return true
//            }
//        }
//
//        return false
//    }
//
//    // MARK: - DNS Packet Parsing
//
//    /// Parses the domain name from a raw DNS query packet.
//    private func parseDomainFromDNS(_ data: Data) -> String? {
//        guard data.count > 12 else { return nil }
//
//        var offset = 12
//        var labels: [String] = []
//
//        while offset < data.count {
//            let length = Int(data[offset])
//            if length == 0 { break }
//            if length & 0xC0 == 0xC0 { break }
//
//            offset += 1
//            guard offset + length <= data.count else { return nil }
//
//            let labelData = data[offset..<(offset + length)]
//            guard let label = String(data: labelData, encoding: .utf8) else { return nil }
//            labels.append(label)
//            offset += length
//        }
//
//        guard !labels.isEmpty else { return nil }
//        return labels.joined(separator: ".")
//    }
//
//    /// Builds an NXDOMAIN response for the given DNS query.
//    private func buildNXDOMAINResponse(for query: Data) -> Data {
//        guard query.count >= 12 else { return query }
//
//        var response = Data(query)
//
//        // Byte 2: QR=1, Opcode=0000, AA=1, TC=0, RD=1 → 0x85
//        // Byte 3: RA=1, Z=000, RCODE=0011 (NXDOMAIN) → 0x83
//        response[2] = 0x85
//        response[3] = 0x83
//
//        // ANCOUNT, NSCOUNT, ARCOUNT = 0
//        response[6] = 0; response[7] = 0
//        response[8] = 0; response[9] = 0
//        response[10] = 0; response[11] = 0
//
//        return response
//    }
//
//    // MARK: - Upstream Forwarding
//
//    private func forwardToUpstream(_ queryData: Data, flow: NEAppProxyUDPFlow, remoteEndpoint: NWEndpoint) {
//        let endpoint = NWHostEndpoint(hostname: upstreamDNS, port: String(upstreamPort))
//        let session = createUDPSession(to: endpoint, from: nil)
//        
//        logger.info("[CleanBrowse DNS] Creating upstream session to \(self.upstreamDNS)")
//        
//        session.setReadHandler({ [weak self] datagrams, error in
//            if let error = error {
//                self?.logger.error("[CleanBrowse DNS] Upstream read error: \(error.localizedDescription)")
//                session.cancel()
//                return
//            }
//            guard let datagrams = datagrams, !datagrams.isEmpty else {
//                self?.logger.warning("[CleanBrowse DNS] No response from upstream")
//                session.cancel()
//                return
//            }
//            
//            self?.logger.info("[CleanBrowse DNS] Received \(datagrams.count) response(s) from upstream")
//            let endpoints = Array(repeating: remoteEndpoint, count: datagrams.count)
//            flow.writeDatagrams(datagrams, sentBy: endpoints) { writeError in
//                if let writeError = writeError {
//                    self?.logger.error("[CleanBrowse DNS] Forward write error: \(writeError.localizedDescription)")
//                } else {
//                    self?.logger.info("[CleanBrowse DNS] Forwarded response back to client")
//                }
//                session.cancel()
//            }
//        }, maxDatagrams: 1)
//
//        session.writeDatagram(queryData) { [weak self] error in
//            if let error = error {
//                self?.logger.error("[CleanBrowse DNS] Upstream write error: \(error.localizedDescription)")
//                session.cancel()
//            } else {
//                self?.logger.info("[CleanBrowse DNS] Sent query to upstream DNS")
//            }
//        }
//    }
//
//    // MARK: - Blocklist Loading
//
//    /// Loads the blocklist from the shared App Group container.
//    private func loadBlocklist() {
//        guard let containerURL = FileManager.default.containerURL(
//            forSecurityApplicationGroupIdentifier: appGroupID
//        ) else {
//            logger.error("[CleanBrowse DNS] Failed to access App Group container")
//            return
//        }
//
//        let blocklistURL = containerURL.appendingPathComponent("blocklist.txt")
//
//        guard let content = try? String(contentsOf: blocklistURL, encoding: .utf8) else {
//            logger.error("[CleanBrowse DNS] No blocklist file found at \(blocklistURL.path)")
//            return
//        }
//
//        let domains = content.components(separatedBy: .newlines)
//            .map { $0.trimmingCharacters(in: .whitespaces).lowercased() }
//            .filter { !$0.isEmpty && !$0.hasPrefix("#") }
//
//        blockedDomains = Set(domains)
//        logger.info("[CleanBrowse DNS] Reloaded blocklist: \(blockedDomains.count) domains")
//    }
//}
