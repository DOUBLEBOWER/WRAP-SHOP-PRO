# Building the All-Pro Coast 2 Coast CRM Desktop App

This guide explains how to build standalone desktop installers for Windows, Mac, and Linux.

## Prerequisites

- Node.js 16+ and pnpm
- For Windows: Visual C++ Build Tools (for native module compilation)
- For Mac: Xcode Command Line Tools
- For Linux: build-essential, python3

## Installation

```bash
pnpm install
```

## Development

Run the app in development mode with hot-reload:

```bash
pnpm electron-dev
```

This starts both the backend server (port 5173) and the Electron app simultaneously.

## Building

### Build for All Platforms

```bash
pnpm electron-build
```

This creates installers for your current OS in the `dist-electron/` folder.

### Build for Specific Platform

**Windows (.exe + portable):**
```bash
pnpm electron-build-win
```

**macOS (.dmg + .zip):**
```bash
pnpm electron-build-mac
```

**Linux (.AppImage + .deb):**
```bash
pnpm electron-build-linux
```

## Output Files

After building, installers are located in `dist-electron/`:

- **Windows**: `All-Pro Coast 2 Coast CRM Setup 1.0.0.exe` (installer) + `All-Pro Coast 2 Coast CRM 1.0.0.exe` (portable)
- **macOS**: `All-Pro Coast 2 Coast CRM-1.0.0.dmg` (installer) + `.zip` (archive)
- **Linux**: `All-Pro Coast 2 Coast CRM-1.0.0.AppImage` (portable) + `.deb` (Debian package)

## Features

- ✅ **Standalone**: No internet required — all data stored locally
- ✅ **Cross-platform**: Windows, macOS, Linux
- ✅ **Auto-updates**: Built-in update checking
- ✅ **Portable**: Run from USB drive or any location
- ✅ **Data backup**: Export/import functionality

## Database

All customer, job, invoice, and inventory data is stored in a local SQLite database at:

- **Windows**: `C:\Users\YourUsername\AppData\Roaming\All-Pro Coast 2 Coast CRM\crm-database.db`
- **macOS**: `~/Library/Application Support/All-Pro Coast 2 Coast CRM/crm-database.db`
- **Linux**: `~/.config/All-Pro Coast 2 Coast CRM/crm-database.db`

## Distribution

To distribute the app:

1. Build for your target platform(s)
2. Upload the installer files to your website or GitHub Releases
3. Users download and run the installer
4. The app auto-updates when new versions are released

## Troubleshooting

**"Cannot find module 'stripe'"**
- Run `pnpm install` to ensure all dependencies are installed

**Build fails on Linux**
- Install build tools: `sudo apt-get install build-essential python3`

**macOS code signing errors**
- Signing is disabled by default. To enable, update `electron-main.js` and set up certificates.

## Version Updates

To release a new version:

1. Update `version` in `package.json`
2. Run `pnpm electron-build`
3. Upload new installers to your release channel
4. Users will be notified of the update automatically
