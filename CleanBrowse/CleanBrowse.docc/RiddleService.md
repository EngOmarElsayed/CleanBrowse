# ``RiddleService``

An anti-bypass mechanism that requires solving a randomly selected riddle before the app can be quit.

## Overview

`RiddleService` provides a friction layer that discourages casual attempts to disable CleanBrowse. When the user clicks the quit button, instead of immediately exiting, a riddle modal is presented. The user must correctly answer the riddle to proceed.

### How It Works

1. User clicks the **Quit** button
2. `AppDelegate` intercepts the termination via `applicationShouldTerminate(_:)` and posts a `.showQuitRiddle` notification
3. `MenuBarContentView` receives the notification and presents the ``RiddleView`` sheet
4. A random riddle is selected from the pool via ``generateRiddle()``
5. The user types their answer and submits
6. If correct, the app sets `shouldAllowQuit = true` and terminates
7. If wrong after 2 attempts, a **new riddle** is generated to prevent brute-force guessing

### Riddle Pool

The service maintains two categories of riddles:

**Math Puzzles** (15 riddles)
- Arithmetic: "What is 17 x 23?" -> "391"
- Square roots: "Square root of 729?" -> "27"
- Sequences: "Next prime after 31?" -> "37"

**Logic Riddles** (15 riddles)
- "What has keys but no locks?" -> "keyboard" / "piano"
- "I have cities but no houses..." -> "map"
- Each logic riddle accepts **multiple valid answers**

### Answer Validation

- Case-insensitive comparison
- Trims whitespace
- Supports multiple accepted answers per riddle (e.g., "keyboard" or "piano")
- Tracks attempt count per riddle

## Topics

### Riddle Management

- ``generateRiddle()``
- ``checkAnswer(_:)``

### State

- ``currentRiddle``
- ``attempts``
