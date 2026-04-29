#!/bin/bash
# ============================================
#  Dark Hollow - Desktop Build Script
# ============================================
# This script builds the React frontend and
# packages it as a desktop app using Electron.
#
# Usage:
#   ./build.sh          # Build for current OS
#   ./build.sh win      # Build Windows .exe
#   ./build.sh mac      # Build macOS .dmg
#   ./build.sh linux    # Build Linux AppImage
#   ./build.sh all      # Build for all platforms
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/../frontend"
ELECTRON_DIR="$SCRIPT_DIR"

echo ""
echo "  ╔══════════════════════════════════╗"
echo "  ║       DARK HOLLOW Builder        ║"
echo "  ╚══════════════════════════════════╝"
echo ""

# Step 1: Build the React frontend
echo "[1/3] Building React frontend..."
cd "$FRONTEND_DIR"

# Remove REACT_APP_BACKEND_URL for offline desktop build
# The game works fully offline (save/load is optional)
REACT_APP_BACKEND_URL="" yarn build

echo "  ✓ Frontend build complete"

# Step 2: Install Electron dependencies
echo ""
echo "[2/3] Installing Electron dependencies..."
cd "$ELECTRON_DIR"
npm install
echo "  ✓ Dependencies installed"

# Step 3: Package with electron-builder
echo ""
echo "[3/3] Packaging desktop app..."

TARGET="${1:-}"

case "$TARGET" in
  win)
    echo "  Building for Windows..."
    npx electron-builder --win
    ;;
  mac)
    echo "  Building for macOS..."
    npx electron-builder --mac
    ;;
  linux)
    echo "  Building for Linux..."
    npx electron-builder --linux
    ;;
  all)
    echo "  Building for all platforms..."
    npx electron-builder --win --mac --linux
    ;;
  *)
    echo "  Building for current platform..."
    npx electron-builder
    ;;
esac

echo ""
echo "  ✓ Build complete!"
echo "  Output files are in: $ELECTRON_DIR/dist/"
echo ""
ls -la "$ELECTRON_DIR/dist/" 2>/dev/null || echo "  (check dist/ folder for output)"
