# Dark Hollow - Desktop Build Guide

## Quick Start (Build .exe)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed
- [Yarn](https://yarnpkg.com/) package manager
- Git (to clone the repo)

### Steps

```bash
# 1. Clone your repo from GitHub
git clone <your-github-repo-url>
cd <repo-name>

# 2. Install frontend dependencies
cd frontend
yarn install
cd ..

# 3. Build the desktop app
cd electron
chmod +x build.sh
./build.sh win        # For Windows .exe
```

The `.exe` will appear in `electron/dist/`.

---

## Build Options

| Command | Output | Platform |
|---------|--------|----------|
| `./build.sh win` | `.exe` installer + portable | Windows |
| `./build.sh mac` | `.dmg` disk image | macOS |
| `./build.sh linux` | `.AppImage` | Linux |
| `./build.sh all` | All of the above | Cross-platform |
| `./build.sh` | Current OS | Auto-detect |

## Manual Build (Without Script)

```bash
# Build the React frontend first
cd frontend
yarn install
yarn build
cd ..

# Install Electron deps and build
cd electron
npm install
npx electron-builder --win    # or --mac or --linux
```

## Output Files

After building, find your files in `electron/dist/`:
- **Windows**: `Dark Hollow Setup X.X.X.exe` (installer) + `DarkHollow-Portable-X.X.X.exe`
- **macOS**: `Dark Hollow-X.X.X.dmg`
- **Linux**: `Dark Hollow-X.X.X.AppImage`

## Running in Development

```bash
# Quick test without packaging
cd electron
npm run dev
```

This builds the frontend and opens it in an Electron window.

## Game Controls
| Key | Action |
|-----|--------|
| WASD / Arrows | Move |
| Space | Jump (double-tap for double jump) |
| J | Attack (3-hit combo) |
| K | Soul Blast (uses mana) |
| Shift | Dash (invincible) |
| I or E | Inventory |
| Escape | Pause |
| F11 | Toggle Fullscreen |

## Notes
- The game runs fully offline as a desktop app
- Save/Load requires the backend server (optional)
- The portable `.exe` requires no installation
