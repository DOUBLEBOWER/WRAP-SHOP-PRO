# Setting Up GitHub Releases for Auto-Updates

This guide explains how to set up GitHub Releases so your desktop app can auto-update when new versions are released.

## Prerequisites

- A GitHub account and repository
- GitHub CLI (`gh`) installed, or use GitHub web interface

## Step 1: Create a GitHub Repository

If you don't have one yet:

```bash
gh repo create allprocoast2coast-crm --public --source=. --remote=origin --push
```

Or create one manually at https://github.com/new

## Step 2: Configure electron-builder

The `electron-builder.yml` file is already configured to publish to GitHub:

```yaml
publish:
  provider: github
  owner: allprocoast2coast
  repo: crm-releases
```

Update the `owner` and `repo` fields to match your GitHub username and repository name.

## Step 3: Create a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `ELECTRON_BUILDER_TOKEN`
4. Select scopes: `public_repo`, `repo` (full control)
5. Copy the token

## Step 4: Set Environment Variable

Before building, set the GitHub token:

**Windows (Command Prompt):**
```cmd
set GH_TOKEN=your_token_here
```

**Windows (PowerShell):**
```powershell
$env:GH_TOKEN="your_token_here"
```

**macOS/Linux:**
```bash
export GH_TOKEN="your_token_here"
```

## Step 5: Build and Release

Build the app:
```bash
pnpm electron-build
```

Create a GitHub Release:

1. Go to your repository on GitHub
2. Click "Releases" → "Draft a new release"
3. Tag version: `v1.0.0` (must match `package.json` version)
4. Title: `All-Pro Coast 2 Coast CRM v1.0.0`
5. Upload the installer files from `dist-electron/`:
   - `All-Pro Coast 2 Coast CRM Setup 1.0.0.exe` (Windows)
   - `All-Pro Coast 2 Coast CRM-1.0.0.dmg` (macOS)
   - `All-Pro Coast 2 Coast CRM-1.0.0.AppImage` (Linux)
6. Click "Publish release"

## Step 6: Test Auto-Updates

1. Install the app from the release
2. Update the version in `package.json` to `1.0.1`
3. Build again: `pnpm electron-build`
4. Create a new release with tag `v1.0.1`
5. Open the installed app — it should detect and download the update

## Automating Releases with GitHub Actions

Create `.github/workflows/release.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build app
        run: pnpm electron-build
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload to Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist-electron/**/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting

**"Cannot find module 'electron-updater'"**
- Run `pnpm install` to ensure all dependencies are installed

**Auto-update not working**
- Verify the GitHub token is set correctly
- Check that release tag matches `v{version}` format
- Ensure installer files are uploaded to the release

**Release not appearing**
- Check that the tag matches the version in `package.json`
- Verify the repository name in `electron-builder.yml`

## Distribution

Share the release link with users:
```
https://github.com/allprocoast2coast/crm-releases/releases
```

Users can download and install the latest version. The app will automatically check for updates on startup and notify them when a new version is available.
