import SwiftUI
import SwiftData

struct AddDomainView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(HostsFileService.self) private var hostsService
    @Environment(DNSProfileService.self) private var dnsService
    @Query private var blockedDomains: [BlockedDomain]

    @State private var domainText = ""
    @State private var errorMessage: String?
    @State private var showSuccess = false

    private var isValid: Bool {
        !domainText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            && domainText.isValidDomain
    }

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                TextField("Add domain to block...", text: $domainText)
                    .textFieldStyle(.roundedBorder)
                    .onSubmit { if isValid { addDomain() } }

                Button {
                    addDomain()
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title3)
                }
                .buttonStyle(.plain)
                .foregroundStyle(isValid ? .blue : .secondary)
                .disabled(!isValid)
            }

            if let error = errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(.red)
            }

            if showSuccess {
                Text("Domain blocked successfully!")
                    .font(.caption)
                    .foregroundStyle(.green)
                    .transition(.opacity)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .animation(.easeInOut(duration: 0.2), value: showSuccess)
        .animation(.easeInOut(duration: 0.2), value: errorMessage)
    }

    private func addDomain() {
        let normalized = domainText.normalizedDomain
        guard !normalized.isEmpty else { return }
        errorMessage = nil

        // Check if already blocked (custom domains or preloaded list)
        if blockedDomains.contains(where: { $0.domain == normalized }) {
            errorMessage = "This domain is already blocked."
            return
        }
        if PreloadedDomains.domainSet.contains(normalized) {
            errorMessage = "This domain is already in the built-in blocklist."
            return
        }

        // Write to hosts file + update DNS proxy blocklist
        Task {
            // Append the new domain to the DNS proxy blocklist
            dnsService.appendToBlocklist(normalized)

            // Save to SwiftData
            let blocked = BlockedDomain(domain: normalized)
            modelContext.insert(blocked)
            try? modelContext.save()

            if let error = hostsService.lastError {
                errorMessage = error
            } else {
                showSuccess = true
                domainText = ""
                try? await Task.sleep(for: .seconds(0.5))
                showSuccess = false
            }
        }
    }
}
