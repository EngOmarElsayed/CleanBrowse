import SwiftUI

struct BlockedListView: View {
    let domains: [BlockedDomain]

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Custom Blocked Sites")
                .font(.caption)
                .foregroundStyle(.secondary)
                .padding(.top, 8)
                .padding(.horizontal, 16)
                .frame(maxWidth: .infinity, alignment: .leading)

            if domains.isEmpty {
                Text("No Custom domains added yet")
                    .font(.caption)
                    .foregroundStyle(.tertiary)
                    .padding(.vertical, 8)
                    .padding(.horizontal, 16)
                    .frame(maxWidth: .infinity, alignment: .leading)
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 4) {
                        ForEach(domains) { domain in
                            HStack(spacing: 8) {
                                Image(systemName: "xmark.shield.fill")
                                    .font(.caption)
                                    .foregroundStyle(.red)

                                Text(domain.domain)
                                    .font(.system(.caption, design: .monospaced))
                                    .lineLimit(1)

                                Spacer()

                                if domain.isPreloaded {
                                    Text("Built-in")
                                        .font(.caption2)
                                        .foregroundStyle(.secondary)
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(.secondary.opacity(0.1), in: Capsule())
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 3)
                        }
                    }
                }
                .frame(maxHeight: 200)
            }
        }
        .padding(.bottom, 8)
    }
}
