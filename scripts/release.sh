#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────────
# CleanBrowse Release Script
# Creates a GitHub release with the zipped app
# ─────────────────────────────────────────────

REPO="EngOmarElsayed/CleanBrowse"
APP_PATH=""

# ── Parse arguments ──
usage() {
  echo "Usage: $0 --app <path-to-CleanBrowse.app>"
  echo ""
  echo "Options:"
  echo "  --app   Path to the notarized CleanBrowse.app"
  echo ""
  echo "Example:"
  echo "  $0 --app ~/Documents/CleanBrowse.app"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --app)
      APP_PATH="$2"
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
if [[ -z "$APP_PATH" ]]; then
  echo "Error: --app is required."
  usage
fi

if [[ ! -d "$APP_PATH" ]]; then
  echo "Error: App not found at '$APP_PATH'"
  exit 1
fi

# ── Prompt for version ──
echo ""
read -rp "Enter release version (e.g. 1.5.0): " VERSION

if [[ -z "$VERSION" ]]; then
  echo "Error: Version cannot be empty."
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

# ── Resolve macOS name ──
MACOS_MAJOR="${MIN_MACOS%.*}"
case "$MACOS_MAJOR" in
  14) MACOS_NAME="Sonoma";;
  15) MACOS_NAME="Sequoia";;
  *) MACOS_NAME="";;
esac

if [[ -n "$MACOS_NAME" ]]; then
  MACOS_LABEL="macOS ${MACOS_MAJOR} (${MACOS_NAME}) or later"
else
  MACOS_LABEL="macOS ${MACOS_MAJOR} or later"
fi

# ── Collect release notes ──
echo ""
echo "Enter your release notes (press Enter twice to finish):"
echo "───────────────────────────────────────────"
CUSTOM_NOTES=""
EMPTY_LINE_COUNT=0
while IFS= read -r line; do
  if [[ -z "$line" ]]; then
    EMPTY_LINE_COUNT=$((EMPTY_LINE_COUNT + 1))
    if [[ $EMPTY_LINE_COUNT -ge 2 ]]; then
      break
    fi
    CUSTOM_NOTES="${CUSTOM_NOTES}
"
  else
    EMPTY_LINE_COUNT=0
    CUSTOM_NOTES="${CUSTOM_NOTES}${line}
"
  fi
done

# Trim trailing whitespace
CUSTOM_NOTES=$(echo "$CUSTOM_NOTES" | sed -e 's/[[:space:]]*$//')

# ── Build release notes ──
RELEASE_NOTES="## CleanBrowse ${TAG}

${CUSTOM_NOTES}

### Requirements
- ${MACOS_LABEL}

### Installation
1. Download \`${ZIP_NAME}\`
2. Unzip and move \`CleanBrowse.app\` to your Applications folder
3. Launch the app from your menu bar"

echo ""
echo "── Release Notes Preview ──"
echo "$RELEASE_NOTES"
echo "───────────────────────────"
echo ""
read -rp "Looks good? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  rm -f "$ZIP_PATH"
  echo "Release cancelled."
  exit 0
fi

# ── Create release ──
echo "→ Creating GitHub release $TAG..."

gh release create "$TAG" "$ZIP_PATH" \
  --repo "$REPO" \
  --title "CleanBrowse ${TAG}" \
  --notes "$RELEASE_NOTES"

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
