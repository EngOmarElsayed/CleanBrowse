# CleanBrowse — Agent Context

macOS menu bar app (SwiftUI, macOS 14.6+) that blocks adult content system-wide. Three native layers — `/etc/hosts` rewrite, `NEDNSProxyProvider` DNS proxy (the `proxy` system-extension target), SafeSearch IP pinning — plus a **Safari Web Extension** that blurs NSFW images on-device with CoreML.

## Safari extension (ported from BlurShield)

The extension implementation was ported from `~/Desktop/MyApps/BlurShield` (2026-08-28). **BlurShield remains the testing environment**: all vitest suites, Swift conversion-regression tests, fixtures, the smoke page, and calibration tools live there — none of that is duplicated here. When changing extension logic here, mirror the change in BlurShield and run its gates (`npx vitest run`, `swift test`); architecture, verdict policy, and hostile-page hardening rationale are documented in BlurShield's `CLAUDE.md`.

Pieces in this repo (kept diff-identical to BlurShield where possible — internal names like `BlurShieldKit`, `data-bs-*`, `BlurShieldNSFW` are intentionally unchanged to keep the two repos in sync):

| Path | Role |
|---|---|
| `extension-src/content/{discovery,blur,acquire,video,main}.js` | content script: pre-paint veil, blur-first classification, video frame sampling, hostile-page hardening |
| `extension-src/background/{cache,router,main}.js` | LRU verdict cache, verdict policy (fail closed), fetch fallback, native bridge |
| `extension/manifest.json` | manifest (source of truth); `extension/{content,background}.js` are esbuild output, gitignored |
| `build.js` / `package.json` | `npm run build` — bundles extension-src → extension/ |
| `BlurShieldKit/` | local SPM package: `NSFWClassifier.classScores(jpegData:)` (implementation only, tests in BlurShield) |
| `Models/BlurShieldNSFW.mlpackage` | CoreML ViT (~164MB, **gitignored** — regenerate via `Tools/convert_model.py`) |
| `App/CleanBrowse Extension/` | appex: `SafariWebExtensionHandler.swift` (native messaging → classifier) + Info.plist |
| `scripts/add_safari_extension_target.rb` | idempotent pbxproj wiring (ruby `xcodeproj` gem) — created the target; re-run is safe |

## Build

```bash
npm install && npm run build                        # REQUIRED before any xcodebuild (appex references extension/ by relative path)
python3 -m venv .venv && .venv/bin/pip install -r Tools/requirements.txt
.venv/bin/python Tools/convert_model.py             # regenerate Models/BlurShieldNSFW.mlpackage (~350MB download)
xcodebuild -project App/CleanBrowse.xcodeproj -scheme "CleanBrowse Extension" -configuration Debug build   # appex-only gate
xcodebuild -project App/CleanBrowse.xcodeproj -scheme CleanBrowse -configuration Debug build               # full app
```

## Gotchas

- The **CleanBrowse scheme has a post-build action** that dittos the app to `/Applications` (needed for Network Extension testing). It fails in sandboxed shells — use the "CleanBrowse Extension" scheme to gate extension changes.
- SwiftPM products only resolve in **scheme** builds; `xcodebuild -target` fails on `import BlurShieldKit`.
- `COREML_CODEGEN_LANGUAGE = Swift` is pinned on the appex target: the JS resources make coremlc mis-detect the target language as TypeScript.
- Release signing is manual Developer ID (team 9PYC9KWKRS), same pattern as the app/proxy targets; the appex needs no provisioning profile.
- Enable in Safari: build & run once, then Safari ▸ Settings ▸ Extensions ▸ CleanBrowse. After rebuilding the appex, toggle the extension off/on to reload.
