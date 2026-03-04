#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────────
# CleanBrowse Release Script
# Creates a DMG and publishes a GitHub release
# ─────────────────────────────────────────────

REPO="EngOmarElsayed/CleanBrowse"
APP_PATH=""
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
BG_IMAGE="${REPO_ROOT}/assets/dmg-background.png"

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

if [[ ! -f "$BG_IMAGE" ]]; then
  echo "Error: Background image not found at '$BG_IMAGE'"
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

# ── Prompt for version ──
echo ""
read -rp "Enter release version (e.g. 1.5.0): " VERSION

if [[ -z "$VERSION" ]]; then
  echo "Error: Version cannot be empty."
  exit 1
fi

TAG="v${VERSION}"
DMG_NAME="CleanBrowse.dmg"
DMG_PATH="${REPO_ROOT}/${DMG_NAME}"
DMG_TEMP="/tmp/CleanBrowse-temp.dmg"
VOL_NAME="CleanBrowse"
MOUNT_POINT="/Volumes/${VOL_NAME}"

# ── Check for existing release ──
if gh release view "$TAG" --repo "$REPO" &>/dev/null; then
  echo "Error: Release $TAG already exists. Use a different version."
  exit 1
fi

# ── Read app info ──
APP_VERSION=$(defaults read "${APP_PATH}/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || echo "unknown")
MIN_MACOS=$(defaults read "${APP_PATH}/Contents/Info.plist" LSMinimumSystemVersion 2>/dev/null || echo "unknown")

VOLICON="${APP_PATH}/Contents/Resources/CleanBrowserLogo.icns"
if [[ ! -f "$VOLICON" ]]; then
  echo "Warning: Volume icon not found, DMG will use default icon."
  VOLICON=""
fi

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       CleanBrowse Release Script         ║"
echo "╠══════════════════════════════════════════╣"
echo "║  App version:    ${APP_VERSION}"
echo "║  Min macOS:      ${MIN_MACOS}"
echo "║  Release tag:    ${TAG}"
echo "║  Output:         ${DMG_NAME}"
echo "╚══════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════
# STEP 1: Create DMG
# ═══════════════════════════════════════════════
echo "── Step 1: Creating DMG ──"
echo ""

# ── Clean up previous ──
rm -f "$DMG_PATH" "$DMG_TEMP"
if [[ -d "$MOUNT_POINT" ]]; then
  hdiutil detach "$MOUNT_POINT" -quiet 2>/dev/null || true
fi

# ── Create writable DMG ──
echo "→ Creating writable DMG..."
hdiutil create -size 50m -fs HFS+ -volname "$VOL_NAME" "$DMG_TEMP" -quiet

# ── Mount it ──
echo "→ Mounting DMG..."
hdiutil attach "$DMG_TEMP" -quiet

# ── Copy app ──
echo "→ Copying app..."
cp -R "$APP_PATH" "${MOUNT_POINT}/CleanBrowse.app"

# ── Create Applications symlink ──
ln -s /Applications "${MOUNT_POINT}/Applications"

# ── Copy background ──
mkdir -p "${MOUNT_POINT}/.background"
cp "$BG_IMAGE" "${MOUNT_POINT}/.background/background.png"

# ── Set volume icon ──
if [[ -n "$VOLICON" ]]; then
  cp "$VOLICON" "${MOUNT_POINT}/.VolumeIcon.icns"
  SetFile -a C "$MOUNT_POINT" 2>/dev/null || true
fi

# ── Style with AppleScript ──
echo "→ Styling DMG window..."
osascript <<APPLESCRIPT
tell application "Finder"
  tell disk "${VOL_NAME}"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set the bounds of container window to {100, 100, 700, 530}
    set theViewOptions to the icon view options of container window
    set arrangement of theViewOptions to not arranged
    set icon size of theViewOptions to 128
    set text size of theViewOptions to 10
    set background picture of theViewOptions to file ".background:background.png"
    set label position of theViewOptions to bottom
    set position of item "CleanBrowse.app" of container window to {150, 180}
    set position of item "Applications" of container window to {450, 180}
    close
    open
    update without registering applications
    delay 2
    close
  end tell
end tell
APPLESCRIPT

# ── Hide background folder ──
SetFile -a V "${MOUNT_POINT}/.background" 2>/dev/null || true

# ── Unmount ──
echo "→ Finalizing DMG..."
sync
hdiutil detach "$MOUNT_POINT" -quiet

# ── Convert to compressed read-only DMG ──
echo "→ Compressing DMG..."
hdiutil convert "$DMG_TEMP" -format UDZO -imagekey zlib-level=9 -o "$DMG_PATH" -quiet

# ── Clean up temp DMG ──
rm -f "$DMG_TEMP"

DMG_SIZE=$(du -h "$DMG_PATH" | cut -f1 | xargs)
echo "  ✓ DMG created: ${DMG_PATH} (${DMG_SIZE})"
echo ""

# ═══════════════════════════════════════════════
# STEP 2: Create GitHub Release
# ═══════════════════════════════════════════════
echo "── Step 2: GitHub Release ──"
echo ""

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
1. Download \`${DMG_NAME}\`
2. Open the DMG and drag \`CleanBrowse.app\` to your Applications folder
3. Launch the app from your menu bar"

echo ""
echo "── Release Notes Preview ──"
echo "$RELEASE_NOTES"
echo "───────────────────────────"
echo ""
read -rp "Looks good? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  rm -f "$DMG_PATH"
  echo "Release cancelled. DMG deleted."
  exit 0
fi

# ── Create release ──
echo "→ Creating GitHub release $TAG..."

gh release create "$TAG" "$DMG_PATH" \
  --repo "$REPO" \
  --title "CleanBrowse ${TAG}" \
  --notes "$RELEASE_NOTES"

RELEASE_URL="https://github.com/${REPO}/releases/tag/${TAG}"
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${TAG}/${DMG_NAME}"

echo ""
echo "✅ Release created successfully!"
echo ""
echo "  Release:  $RELEASE_URL"
echo "  Download: $DOWNLOAD_URL"
echo ""

# ── Clean up DMG ──
rm -f "$DMG_PATH"
echo "→ Cleaned up local DMG."
echo "Done!"
