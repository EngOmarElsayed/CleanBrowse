//
//  DNSProxyProvider.swift
//  proxy
//
//  Created by Omar Elsayed on 24/02/2026.
//
import NetworkExtension
import os.log

class DNSProxyProvider: NEDNSProxyProvider {
    // Safe DNS resolver (Cloudflare Family - blocks malware + adult content)
    private let safeDNSAddress = "1.1.1.3"
    private let safeDNSPort: UInt16 = 53

    // Your custom blocked domains (on top of Cloudflare's filtering)
    private let blockedDomains: Set<String> = [
        "linkedin.com",
        "www.linkedin.com"
    ]
    
    // MARK: - Lifecycle
    override func startProxy(options: [String: Any]? = nil, completionHandler: @escaping (Error?) -> Void) {
        completionHandler(nil)
    }
    
    override func stopProxy(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        completionHandler()
    }
    
    override func sleep(completionHandler: @escaping () -> Void) {
        completionHandler()
    }
    
    override func wake() {}
    
    // MARK: - Flow Handling
    
    override func handleNewFlow(_ flow: NEAppProxyFlow) -> Bool {
        guard let udpFlow = flow as? NEAppProxyUDPFlow else {
            return false
        }
        
        flow.open(withLocalEndpoint: nil) { [weak self] error in
            guard let self, error == nil else { return }
            self.readAndForwardDNS(udpFlow)
        }
        return true
    }
}

// MARK: - DNS Logic Impelmtation
extension DNSProxyProvider {
    private func readAndForwardDNS(_ flow: NEAppProxyUDPFlow) {
        flow.readDatagrams { [weak self] datagrams, endpoints, error in
            guard let self, let datagrams, let endpoints, error == nil else {
                flow.closeReadWithError(error)
                flow.closeWriteWithError(error)
                return
            }
            
            for (index, datagram) in datagrams.enumerated() {
                var shouldBlock: Bool = false
                let queriedDomain = self.extractDomainFromDNSQuery(datagram)
                if let domain = queriedDomain { shouldBlock = self.shouldBlock(hostname: domain) }

                self.forwardToSafeOrBlockedDNS(
                    query: datagram,
                    originalEndpoint: endpoints[index],
                    flow: flow,
                    isBlocked: shouldBlock
                )
            }
        }
    }
    
    // MARK: - DNS Forwarding
    private func forwardToSafeOrBlockedDNS(query: Data, originalEndpoint: NWEndpoint, flow: NEAppProxyUDPFlow, isBlocked: Bool) {
        // If blocked, craft a fake DNS response with 0.0.0.0 and return immediately
        guard !isBlocked else {
            responseWithInvalidDNS(flow: flow, query: query, originalEndpoint: originalEndpoint)
            return
        }
        
        let connection = Network.NWConnection(
            host: Network.NWEndpoint.Host(safeDNSAddress),
            port: Network.NWEndpoint.Port(rawValue: safeDNSPort)!,
            using: .udp
        )
        
        connection.stateUpdateHandler = { (state: Network.NWConnection.State) in
            switch state {
            case .ready:
                connection.send(content: query, completion: Network.NWConnection.SendCompletion.contentProcessed({ error in
                    if let error {
                        connection.cancel()
                        return
                    }
                    
                    connection.receiveMessage { data, _, _, error in
                        defer { connection.cancel() }
                        guard let data, error == nil else { return }
                        flow.writeDatagrams([data], sentBy: [originalEndpoint]) { _ in }
                    }
                }))
                
            case .failed(let error):
                connection.cancel()

            default:
                break
            }
        }
        
        connection.start(queue: .global(qos: .userInitiated))
    }

    private func responseWithInvalidDNS(flow: NEAppProxyUDPFlow, query: Data, originalEndpoint: NWEndpoint) {
        if let blockedResponse = buildBlockedDNSResponse(for: query) {
            flow.writeDatagrams([blockedResponse], sentBy: [originalEndpoint]) { _ in }
        }
    }
    
    // MARK: - DNS Packet Helpers
    private func extractDomainFromDNSQuery(_ data: Data) -> String? {
        guard data.count > 12 else { return nil }
        
        var domain = ""
        var offset = 12
        
        while offset < data.count {
            let labelLength = Int(data[offset])
            if labelLength == 0 { break }
            
            offset += 1
            guard offset + labelLength <= data.count else { return nil }
            
            let label = data[offset..<offset + labelLength]
            if let part = String(data: label, encoding: .utf8) {
                if !domain.isEmpty { domain += "." }
                domain += part
            }
            offset += labelLength
        }
        
        return domain.isEmpty ? nil : domain.lowercased()
    }
    
    // MARK: - Blocking Logic
    private func shouldBlock(hostname: String) -> Bool {
        let lowercased = hostname.lowercased()
        return blockedDomains.contains(lowercased) ||
        blockedDomains.contains(where: { lowercased.hasSuffix(".\($0)") })
    }

    // MARK: - Invalid DNS response
    private func buildBlockedDNSResponse(for query: Data) -> Data? {
        guard query.count > 12 else { return nil }
        
        var response = Data()
        
        // Transaction ID
        response.append(query[0...1])
        
        // Flags: Response, Recursion Desired, Recursion Available
        response.append(contentsOf: [0x81, 0x80])
        
        // Questions: 1
        response.append(query[4...5])
        
        // Answers: 1
        response.append(contentsOf: [0x00, 0x01])
        
        // Authority + Additional: 0
        response.append(contentsOf: [0x00, 0x00, 0x00, 0x00])
        
        // Copy question section
        var offset = 12
        while offset < query.count {
            let labelLength = Int(query[offset])
            if labelLength == 0 {
                offset += 1
                break
            }
            offset += 1 + labelLength
        }
        
        // Read QTYPE before skipping past it
        guard offset + 4 <= query.count else { return nil }
        let qtype = (UInt16(query[offset]) << 8) | UInt16(query[offset + 1])
        offset += 4 // skip QTYPE + QCLASS
        
        // Append the full question section
        response.append(query[12..<offset])
        
        // Answer section
        // Name pointer
        response.append(contentsOf: [0xC0, 0x0C])
        
        if qtype == 28 {
            // AAAA record (IPv6)
            response.append(contentsOf: [0x00, 0x1C]) // Type AAAA
            response.append(contentsOf: [0x00, 0x01]) // Class IN
            response.append(contentsOf: [0x00, 0x00, 0x00, 0x3C]) // TTL 60s
            response.append(contentsOf: [0x00, 0x10]) // RDLENGTH: 16 bytes
            response.append(contentsOf: [UInt8](repeating: 0, count: 16)) // :: (all zeros)
        } else if qtype == 65 {
            // HTTPS record — return NXDOMAIN-like response with 0 answers
            // Go back and change answer count to 0
            response = Data()
            response.append(query[0...1])
            response.append(contentsOf: [0x81, 0x83]) // 0x83 = NXDOMAIN (name doesn't exist)
            response.append(query[4...5])
            response.append(contentsOf: [0x00, 0x00]) // 0 answers
            response.append(contentsOf: [0x00, 0x00, 0x00, 0x00])
            response.append(query[12..<offset])
            return response
        } else {
            // A record (IPv4) — default
            response.append(contentsOf: [0x00, 0x01]) // Type A
            response.append(contentsOf: [0x00, 0x01]) // Class IN
            response.append(contentsOf: [0x00, 0x00, 0x00, 0x3C]) // TTL 60s
            response.append(contentsOf: [0x00, 0x04]) // RDLENGTH: 4 bytes
            response.append(contentsOf: [0x00, 0x00, 0x00, 0x00]) // 0.0.0.0
        }
        
        return response
    }
}
