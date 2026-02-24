import Foundation
import Observation

/// An anti-bypass mechanism that requires solving a riddle before the app can quit.
///
/// `RiddleService` provides a friction layer that discourages casual attempts to
/// disable CleanBrowse. When the user clicks **Quit**, the ``AppDelegate`` intercepts
/// the termination and posts a `.showQuitRiddle` notification. The ``RiddleView``
/// sheet is then presented with a randomly selected riddle.
///
/// ### Riddle Pool
///
/// The service maintains 30 riddles in two categories:
/// - **Math puzzles** (15): Arithmetic, exponents, factorials, percentages
/// - **Logic riddles** (15): Classic word puzzles with single-word answers
///
/// ### Anti-Brute-Force
///
/// After **2 incorrect attempts** on the same riddle, a completely new riddle is
/// generated. This prevents guessing by elimination and forces the user to
/// actually solve the problem.
@Observable
@MainActor
final class RiddleService {

    // MARK: - State

    /// The currently active riddle, or `nil` if no riddle has been generated yet.
    var currentRiddle: Riddle?

    /// The number of incorrect attempts on the current riddle.
    var attempts: Int = 0

    // MARK: - Types

    /// A single riddle with a question, expected answer, and optional hint.
    struct Riddle {
        /// The riddle question displayed to the user.
        let question: String
        /// The expected answer (case-insensitive comparison).
        let answer: String
        /// A hint that can be revealed to help the user.
        let hint: String
    }

    // MARK: - Riddle Pool

    private static let riddles: [Riddle] = [
        // Math puzzles
        Riddle(
            question: "What is 17 x 23?",
            answer: "391",
            hint: "Break it down: 17 x 20 + 17 x 3"
        ),
        Riddle(
            question: "What is the square root of 729?",
            answer: "27",
            hint: "It's between 25 and 30"
        ),
        Riddle(
            question: "What is 256 divided by 16?",
            answer: "16",
            hint: "Both numbers are powers of 2"
        ),
        Riddle(
            question: "What is 13 squared?",
            answer: "169",
            hint: "13 x 13"
        ),
        Riddle(
            question: "What is 1024 / 32?",
            answer: "32",
            hint: "Think in powers of 2"
        ),
        Riddle(
            question: "If x + 15 = 47, what is x?",
            answer: "32",
            hint: "Subtract 15 from both sides"
        ),
        Riddle(
            question: "What is 3 to the power of 5?",
            answer: "243",
            hint: "3 x 3 x 3 x 3 x 3"
        ),
        Riddle(
            question: "What is 144 / 12 + 7 x 3?",
            answer: "33",
            hint: "Remember order of operations: 12 + 21"
        ),
        Riddle(
            question: "What is the next prime number after 37?",
            answer: "41",
            hint: "Check 38, 39, 40..."
        ),
        Riddle(
            question: "How many seconds are in 1.5 hours?",
            answer: "5400",
            hint: "90 minutes x 60 seconds"
        ),
        Riddle(
            question: "What is 19 x 19?",
            answer: "361",
            hint: "Think (20-1) squared"
        ),
        Riddle(
            question: "What is 7! (7 factorial)?",
            answer: "5040",
            hint: "7 x 6 x 5 x 4 x 3 x 2 x 1"
        ),
        Riddle(
            question: "What is the sum of all numbers from 1 to 20?",
            answer: "210",
            hint: "Use the formula: n(n+1)/2"
        ),
        Riddle(
            question: "What is 2 to the power of 10?",
            answer: "1024",
            hint: "Double 512"
        ),
        Riddle(
            question: "What is 15% of 420?",
            answer: "63",
            hint: "10% is 42, 5% is 21"
        ),

        // Logic riddles
        Riddle(
            question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
            answer: "echo",
            hint: "Think about sound bouncing back"
        ),
        Riddle(
            question: "The more you take, the more you leave behind. What am I?",
            answer: "footsteps",
            hint: "Think about walking"
        ),
        Riddle(
            question: "What has keys but no locks, space but no room, and you can enter but can't go inside?",
            answer: "keyboard",
            hint: "You're probably using one right now"
        ),
        Riddle(
            question: "What has a head and a tail but no body?",
            answer: "coin",
            hint: "You might flip it to make a decision"
        ),
        Riddle(
            question: "What can travel around the world while staying in a corner?",
            answer: "stamp",
            hint: "Think about mail"
        ),
        Riddle(
            question: "What gets wetter the more it dries?",
            answer: "towel",
            hint: "You use it after a shower"
        ),
        Riddle(
            question: "What has cities but no houses, forests but no trees, and water but no fish?",
            answer: "map",
            hint: "It represents the real world"
        ),
        Riddle(
            question: "What can you break even if you never pick it up or touch it?",
            answer: "promise",
            hint: "It's something you give someone"
        ),
        Riddle(
            question: "What has hands but can't clap?",
            answer: "clock",
            hint: "It tells you something important every day"
        ),
        Riddle(
            question: "What building has the most stories?",
            answer: "library",
            hint: "Think about books"
        ),
        Riddle(
            question: "What invention lets you look right through a wall?",
            answer: "window",
            hint: "Every house has several"
        ),
        Riddle(
            question: "What word becomes shorter when you add two letters to it?",
            answer: "short",
            hint: "The answer is literally in the question"
        ),
        Riddle(
            question: "What has a neck but no head?",
            answer: "bottle",
            hint: "You might drink from it"
        ),
        Riddle(
            question: "What has one eye but can't see?",
            answer: "needle",
            hint: "Used in sewing"
        ),
        Riddle(
            question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
            answer: "m",
            hint: "Look at the letters in each word"
        ),
    ]

    // MARK: - Methods

    /// Selects a new random riddle from the pool.
    ///
    /// Avoids repeating the current riddle (if one exists and the pool has more than one entry).
    /// Resets ``attempts`` to `0`.
    func generateRiddle() {
        var newRiddle: Riddle
        repeat {
            newRiddle = Self.riddles.randomElement()!
        } while newRiddle.question == currentRiddle?.question && Self.riddles.count > 1
        currentRiddle = newRiddle
        attempts = 0
    }

    /// Validates the user's answer against the current riddle.
    ///
    /// Comparison is case-insensitive and trims whitespace. If the answer is wrong
    /// and ``attempts`` reaches 2 or more, a new riddle is automatically generated
    /// to prevent brute-force guessing.
    ///
    /// - Parameter userAnswer: The user's typed answer.
    /// - Returns: `true` if the answer matches, `false` otherwise.
    func checkAnswer(_ userAnswer: String) -> Bool {
        guard let riddle = currentRiddle else { return false }
        attempts += 1

        let trimmed = userAnswer
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .lowercased()
        let correct = riddle.answer.lowercased()

        if trimmed == correct {
            return true
        } else {
            // Wrong answer — generate a new riddle so they can't brute force
            if attempts >= 2 {
                generateRiddle()
            }
            return false
        }
    }
}
