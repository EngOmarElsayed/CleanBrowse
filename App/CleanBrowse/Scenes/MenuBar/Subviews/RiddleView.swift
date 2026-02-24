import SwiftUI

struct RiddleView: View {
    @Environment(RiddleService.self) private var riddleService
    @Binding var isPresented: Bool

    @State private var answer = ""
    @State private var errorMessage: String?
    @State private var showHint = false
    @FocusState private var answerFocused: Bool

    var body: some View {
        VStack(spacing: 20) {
            // Header
            VStack(spacing: 8) {
                Image(systemName: "brain.head.profile")
                    .font(.system(size: 40))
                    .foregroundStyle(.orange)

                Text("Solve to Quit")
                    .font(.title2)
                    .fontWeight(.bold)

                Text("You must solve this riddle before you can quit CleanBrowse.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }

            // Riddle
            if let riddle = riddleService.currentRiddle {
                Text(riddle.question)
                    .font(.body)
                    .fontWeight(.medium)
                    .multilineTextAlignment(.center)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(.orange.opacity(0.1), in: RoundedRectangle(cornerRadius: 12))

                if showHint {
                    HStack {
                        Image(systemName: "lightbulb.fill")
                            .foregroundStyle(.yellow)
                        Text(riddle.hint)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .transition(.opacity)
                }
            }

            // Answer field
            VStack(spacing: 8) {
                TextField("Your answer...", text: $answer)
                    .textFieldStyle(.roundedBorder)
                    .focused($answerFocused)
                    .onSubmit { submitAnswer() }

                if let error = errorMessage {
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(.red)
                        .transition(.opacity)
                }
            }

            // Buttons
            HStack(spacing: 12) {
                Button("Hint") {
                    withAnimation { showHint = true }
                }
                .buttonStyle(.bordered)
                .disabled(showHint)

                Spacer()

                Button("Cancel") {
                    isPresented = false
                }
                .buttonStyle(.bordered)

                Button("Submit") {
                    submitAnswer()
                }
                .buttonStyle(.borderedProminent)
                .disabled(answer.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
        .padding(24)
        .frame(width: 400)
        .onAppear { answerFocused = true }
        .animation(.easeInOut(duration: 0.2), value: errorMessage)
    }

    private func submitAnswer() {
        let correct = riddleService.checkAnswer(answer)
        if correct {
            isPresented = false
            // Allow quit and terminate
            if let appDelegate = NSApp.delegate as? AppDelegate {
                appDelegate.shouldAllowQuit = true
            }
            NSApp.terminate(nil)
        } else {
            answer = ""
            showHint = false
            if riddleService.attempts >= 2 {
                errorMessage = "Wrong! Here's a new riddle."
            } else {
                errorMessage = "Wrong answer. Try again!"
            }
        }
    }
}
