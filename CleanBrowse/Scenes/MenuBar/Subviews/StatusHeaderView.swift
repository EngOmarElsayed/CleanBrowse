import SwiftUI

struct StatusHeaderView: View {
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "staroflife.shield.fill")
                .font(.system(size: 32))
                .foregroundStyle(.green)

            VStack(alignment: .leading, spacing: 4) {
                Text("Protected")
                    .font(.headline)
                    .foregroundStyle(.green)

                Text("All adult sites are blocked")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                HStack(spacing: 2) {
                    Image(systemName: "lock.shield")
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Text("SafeSearch Enabled")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()
        }
        .padding(16)
    }
}

#Preview {
    StatusHeaderView()
}
