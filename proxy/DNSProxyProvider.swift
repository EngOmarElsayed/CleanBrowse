//
//  DNSProxyProvider.swift
//  DNSProxy
//
//  Created by Omar Elsayed on 13/02/2026.
//

import NetworkExtension

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
class DNSProxyProvider: NEDNSProxyProvider {

    /// Set of blocked domains loaded from the shared container.
    private var blockedDomains: Set<String> = []

    /// Whether a reload has been requested via Darwin notification.
    private var needsReload = false

    /// Upstream DNS server address.
    private let upstreamDNS = "8.8.8.8"
    private let upstreamPort: UInt16 = 53

    /// The App Group identifier.
    private let appGroupID = "group.com.omarelsayed.cleanbrowse"

    /// The Darwin notification name used to signal blocklist updates.
    private static let reloadNotification = "com.omarelsayed.cleanbrowse.blocklistUpdated" as CFString

    // MARK: - Lifecycle

    override func startProxy(options: [String: Any]? = nil, completionHandler: @escaping (Error?) -> Void) {
        NSLog("[CleanBrowse DNS] Starting DNS proxy...")
        loadBlocklist()
        registerForReloadNotification()
        NSLog("[CleanBrowse DNS] Loaded \(blockedDomains.count) blocked domains")
        completionHandler(nil)
    }

    override func stopProxy(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        NSLog("[CleanBrowse DNS] Stopping DNS proxy, reason: \(reason.rawValue)")
        CFNotificationCenterRemoveEveryObserver(
            CFNotificationCenterGetDarwinNotifyCenter(),
            Unmanaged.passUnretained(self).toOpaque()
        )
        completionHandler()
    }

    // MARK: - Darwin Notification (Cross-Process Reload Signal)

    /// Registers for the Darwin notification that the main app posts when the blocklist changes.
    private func registerForReloadNotification() {
        let observer = Unmanaged.passUnretained(self).toOpaque()

        CFNotificationCenterAddObserver(
            CFNotificationCenterGetDarwinNotifyCenter(),
            observer,
            { _, observer, _, _, _ in
                guard let observer = observer else { return }
                let provider = Unmanaged<DNSProxyProvider>.fromOpaque(observer).takeUnretainedValue()
                NSLog("[CleanBrowse DNS] Received reload notification from main app")
                provider.needsReload = true
            },
            DNSProxyProvider.reloadNotification,
            nil,
            .deliverImmediately
        )

        NSLog("[CleanBrowse DNS] Registered for blocklist reload notifications")
    }

    // MARK: - DNS Flow Handling

    override func handleNewFlow(_ flow: NEAppProxyFlow) -> Bool {
        guard let udpFlow = flow as? NEAppProxyUDPFlow else {
            return false
        }

        handleDNSFlow(udpFlow)
        return true
    }

    private func handleDNSFlow(_ flow: NEAppProxyUDPFlow) {
        flow.open(withLocalEndpoint: nil) { error in
            if let error = error {
                NSLog("[CleanBrowse DNS] Failed to open flow: \(error)")
                flow.closeReadWithError(error)
                flow.closeWriteWithError(error)
                return
            }
            self.readFromFlow(flow)
        }
    }

    private func readFromFlow(_ flow: NEAppProxyUDPFlow) {
        flow.readDatagrams { datagrams, endpoints, error in
            if let error = error {
                NSLog("[CleanBrowse DNS] Read error: \(error)")
                flow.closeReadWithError(error)
                flow.closeWriteWithError(error)
                return
            }

            guard let datagrams = datagrams, let endpoints = endpoints else {
                return
            }

            for (index, datagram) in datagrams.enumerated() {
                self.processDNSQuery(datagram, flow: flow, remoteEndpoint: endpoints[index])
            }

            self.readFromFlow(flow)
        }
    }

    // MARK: - DNS Packet Processing

    private func processDNSQuery(_ queryData: Data, flow: NEAppProxyUDPFlow, remoteEndpoint: NWEndpoint) {
        // Reload blocklist if the main app signaled a change
        if needsReload {
            needsReload = false
            loadBlocklist()
        }

        guard let domainName = parseDomainFromDNS(queryData) else {
            forwardToUpstream(queryData, flow: flow, remoteEndpoint: remoteEndpoint)
            return
        }

        let normalizedDomain = domainName.lowercased()

        if isDomainBlocked(normalizedDomain) {
            NSLog("[CleanBrowse DNS] BLOCKED: \(normalizedDomain)")
            let nxdomainResponse = buildNXDOMAINResponse(for: queryData)
            flow.writeDatagrams([nxdomainResponse], sentBy: [remoteEndpoint]) { error in
                if let error = error {
                    NSLog("[CleanBrowse DNS] Write error: \(error)")
                }
            }
        } else {
            forwardToUpstream(queryData, flow: flow, remoteEndpoint: remoteEndpoint)
        }
    }

    /// Checks if a domain or any of its parent domains are in the blocklist.
    private func isDomainBlocked(_ domain: String) -> Bool {
        if blockedDomains.contains(domain) {
            return true
        }

        // Check without www.
        if domain.hasPrefix("www.") {
            let withoutWWW = String(domain.dropFirst(4))
            if blockedDomains.contains(withoutWWW) {
                return true
            }
        }

        // Check parent domains (e.g., sub.example.com → example.com)
        var components = domain.split(separator: ".")
        while components.count > 2 {
            components.removeFirst()
            let parent = components.joined(separator: ".")
            if blockedDomains.contains(parent) {
                return true
            }
        }

        return false
    }

    // MARK: - DNS Packet Parsing

    /// Parses the domain name from a raw DNS query packet.
    private func parseDomainFromDNS(_ data: Data) -> String? {
        guard data.count > 12 else { return nil }

        var offset = 12
        var labels: [String] = []

        while offset < data.count {
            let length = Int(data[offset])
            if length == 0 { break }
            if length & 0xC0 == 0xC0 { break }

            offset += 1
            guard offset + length <= data.count else { return nil }

            let labelData = data[offset..<(offset + length)]
            guard let label = String(data: labelData, encoding: .utf8) else { return nil }
            labels.append(label)
            offset += length
        }

        guard !labels.isEmpty else { return nil }
        return labels.joined(separator: ".")
    }

    /// Builds an NXDOMAIN response for the given DNS query.
    private func buildNXDOMAINResponse(for query: Data) -> Data {
        guard query.count >= 12 else { return query }

        var response = Data(query)

        // Byte 2: QR=1, Opcode=0000, AA=1, TC=0, RD=1 → 0x85
        // Byte 3: RA=1, Z=000, RCODE=0011 (NXDOMAIN) → 0x83
        response[2] = 0x85
        response[3] = 0x83

        // ANCOUNT, NSCOUNT, ARCOUNT = 0
        response[6] = 0; response[7] = 0
        response[8] = 0; response[9] = 0
        response[10] = 0; response[11] = 0

        return response
    }

    // MARK: - Upstream Forwarding

    private func forwardToUpstream(_ queryData: Data, flow: NEAppProxyUDPFlow, remoteEndpoint: NWEndpoint) {
        let endpoint = NWHostEndpoint(hostname: upstreamDNS, port: String(upstreamPort))
        let session = createUDPSession(to: endpoint, from: nil)

        session.setReadHandler({ datagrams, error in
            if let datagrams = datagrams, !datagrams.isEmpty {
                let endpoints = Array(repeating: remoteEndpoint, count: datagrams.count)
                flow.writeDatagrams(datagrams, sentBy: endpoints) { writeError in
                    if let writeError = writeError {
                        NSLog("[CleanBrowse DNS] Forward write error: \(writeError)")
                    }
                }
            }
            session.cancel()
        }, maxDatagrams: 1)

        session.writeDatagram(queryData) { error in
            if let error = error {
                NSLog("[CleanBrowse DNS] Upstream write error: \(error)")
                session.cancel()
            }
        }
    }

    // MARK: - Blocklist Loading

    /// Loads the blocklist from the shared App Group container.
    private func loadBlocklist() {
        guard let containerURL = FileManager.default.containerURL(
            forSecurityApplicationGroupIdentifier: appGroupID
        ) else {
            NSLog("[CleanBrowse DNS] Failed to access App Group container")
            return
        }

        let blocklistURL = containerURL.appendingPathComponent("blocklist.txt")

        guard let content = try? String(contentsOf: blocklistURL, encoding: .utf8) else {
            NSLog("[CleanBrowse DNS] No blocklist file found at \(blocklistURL.path)")
            return
        }

        let domains = content.components(separatedBy: .newlines)
            .map { $0.trimmingCharacters(in: .whitespaces).lowercased() }
            .filter { !$0.isEmpty && !$0.hasPrefix("#") }

        blockedDomains = Set(domains)
        NSLog("[CleanBrowse DNS] Reloaded blocklist: \(blockedDomains.count) domains")
    }
}
