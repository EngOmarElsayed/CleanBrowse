#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────────
# CleanBrowse Release Script
# Creates a GitHub release with the zipped app
# ─────────────────────────────────────────────

REPO="EngOmarElsayed/CleanBrowse"
APP_PATH=""
VERSION=""

# ── Parse arguments ──
usage() {
  echo "Usage: $0 --app <path-to-CleanBrowse.app> --version <version>"
  echo ""
  echo "Options:"
  echo "  --app       Path to the notarized CleanBrowse.app"
  echo "  --version   Release version (e.g. 1.0.2)"
  echo ""
  echo "Example:"
  echo "  $0 --app ~/Documents/CleanBrowse.app --version 1.0.2"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --app)
      APP_PATH="$2"
      shift 2
      ;;
    --version)
      VERSION="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# ── Validate inputs ──
if [[ -z "$APP_PATH" || -z "$VERSION" ]]; then
  echo "Error: --app and --version are required."
  usage
fi

if [[ ! -d "$APP_PATH" ]]; then
  echo "Error: App not found at '$APP_PATH'"
  exit 1
fi

TAG="v${VERSION}"
ZIP_NAME="CleanBrowse.zip"
ZIP_PATH="/tmp/${ZIP_NAME}"

# ── Check for existing release ──
if gh release view "$TAG" --repo "$REPO" &>/dev/null; then
  echo "Error: Release $TAG already exists. Use a different version."
  exit 1
fi

# ── Check prerequisites ──
if ! command -v gh &>/dev/null; then
  echo "Error: GitHub CLI (gh) is required. Install with: brew install gh"
  exit 1
fi

if ! command -v ditto &>/dev/null; then
  echo "Error: ditto is required (should be available on macOS)."
  exit 1
fi

# ── Read app info ──
APP_VERSION=$(defaults read "${APP_PATH}/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || echo "unknown")
MIN_MACOS=$(defaults read "${APP_PATH}/Contents/Info.plist" LSMinimumSystemVersion 2>/dev/null || echo "unknown")

echo "╔══════════════════════════════════════════╗"
echo "║       CleanBrowse Release Script         ║"
echo "╠══════════════════════════════════════════╣"
echo "║  App version:    ${APP_VERSION}"
echo "║  Min macOS:      ${MIN_MACOS}"
echo "║  Release tag:    ${TAG}"
echo "║  Zip name:       ${ZIP_NAME}"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Zip the app ──
echo "→ Zipping app..."
rm -f "$ZIP_PATH"
ditto -c -k --sequesterRsrc --keepParent "$APP_PATH" "$ZIP_PATH"
ZIP_SIZE=$(du -h "$ZIP_PATH" | cut -f1 | xargs)
echo "  ✓ Created $ZIP_NAME ($ZIP_SIZE)"

# ── Create release ──
echo "→ Creating GitHub release $TAG..."
gh release create "$TAG" "$ZIP_PATH" \
  --repo "$REPO" \
  --title "CleanBrowse ${TAG}" \
  --notes "$(cat <<EOF
## CleanBrowse ${TAG}

System-level adult content blocker for macOS.

### Requirements
- macOS ${MIN_MACOS%.*} ($(
  case ${MIN_MACOS%.*} in
    14) echo "Sonoma";;
    15) echo "Sequoia";;
    *) echo "or later";;
  esac
)) or later

### What's Included
- Three-layer protection: Hosts file blocking, DNS proxy, and forced SafeSearch
- Blocks 249,000+ adult domains
- SafeSearch enforcement across 190+ country-code domains
- No subscriptions, no data collection

### Installation
1. Download \`${ZIP_NAME}\`
2. Unzip and move \`CleanBrowse.app\` to your Applications folder
3. Launch the app from your menu bar
EOF
)"

RELEASE_URL="https://github.com/${REPO}/releases/tag/${TAG}"
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${TAG}/${ZIP_NAME}"

echo ""
echo "✅ Release created successfully!"
echo ""
echo "  Release:  $RELEASE_URL"
echo "  Download: $DOWNLOAD_URL"
echo ""

# ── Clean up ──
rm -f "$ZIP_PATH"
echo "→ Cleaned up temp files."
echo "Done!"
