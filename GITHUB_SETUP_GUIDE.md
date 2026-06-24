# GitHub Setup Guide for All-Pro Coast 2 Coast CRM

This guide walks you through setting up a GitHub repository and enabling auto-updates for your desktop app.

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com/signup
2. Create your account with your email
3. Verify your email address

## Step 2: Create a New Repository

### Option A: Using GitHub Web Interface (Easiest)

1. Go to https://github.com/new
2. **Repository name:** `allprocoast2coast-crm`
3. **Description:** "All-Pro Coast 2 Coast CRM - Desktop App with Electron"
4. **Visibility:** Public (so customers can download)
5. **Initialize with:** Leave unchecked
6. Click **"Create repository"**

### Option B: Using GitHub CLI

```bash
gh repo create allprocoast2coast-crm --public --source=. --remote=origin --push
```

## Step 3: Push Your Code to GitHub

```bash
cd /home/ubuntu/saas-crm-dashboard

# Add GitHub as remote (if not already done)
git remote add origin https://github.com/YOUR_USERNAME/allprocoast2coast-crm.git

# Rename branch to main (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Create a Personal Access Token

This token allows the auto-updater to download releases.

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Token name:** `ELECTRON_BUILDER_TOKEN`
4. **Expiration:** 90 days (or longer)
5. **Select scopes:** Check `public_repo` and `repo`
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)

## Step 5: Build and Create a Release

### Build the Desktop App

```bash
cd /home/ubuntu/saas-crm-dashboard

# Set your GitHub token
export GH_TOKEN="your_token_here"

# Build for all platforms
pnpm electron-build
```

This creates installers in `dist-electron/`:
- `All-Pro Coast 2 Coast CRM Setup 1.0.0.exe` (Windows)
- `All-Pro Coast 2 Coast CRM-1.0.0.dmg` (macOS)
- `All-Pro Coast 2 Coast CRM-1.0.0.AppImage` (Linux)

### Create a GitHub Release

1. Go to your repository: `https://github.com/YOUR_USERNAME/allprocoast2coast-crm`
2. Click **"Releases"** (right side)
3. Click **"Draft a new release"**
4. **Tag version:** `v1.0.0`
5. **Release title:** `All-Pro Coast 2 Coast CRM v1.0.0`
6. **Description:** 
   ```
   Initial release of the All-Pro Coast 2 Coast CRM desktop app.
   
   Features:
   - Full CRM with customer database
   - Job pipeline and invoicing
   - Vehicle wrap and sticker designers
   - Offline-first with local database
   - Cross-platform (Windows, macOS, Linux)
   
   Download the installer for your operating system below.
   ```
7. **Upload files:** Drag and drop the 3 installer files from `dist-electron/`
8. Click **"Publish release"**

## Step 6: Share the Download Link

Your customers can now download the app from:

```
https://github.com/YOUR_USERNAME/allprocoast2coast-crm/releases
```

## Step 7: Test Auto-Updates

1. Install the app from the release
2. Update `package.json` version to `1.0.1`
3. Build again: `pnpm electron-build`
4. Create a new release with tag `v1.0.1`
5. Open the installed app — it should detect the update and ask to download

## Step 8 (Optional): Add a Download Button to Your Website

Add this to your landing page (`/`) to link directly to releases:

```html
<a href="https://github.com/YOUR_USERNAME/allprocoast2coast-crm/releases" 
   target="_blank" 
   class="btn btn-primary">
  📥 Download Desktop App
</a>
```

## Troubleshooting

**"Cannot find module 'stripe'"**
- Run `pnpm install` to ensure all dependencies are installed

**Build fails on Windows**
- Install Visual C++ Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/

**Release not appearing**
- Verify the tag matches `v{version}` format
- Check that the repository is public

**Auto-update not working**
- Verify the GitHub token is set correctly
- Check that release tag matches the version in `package.json`

## Quick Reference

| Task | Command |
|------|---------|
| Build app | `pnpm electron-build` |
| Test locally | `pnpm electron-dev` |
| Push to GitHub | `git push origin main` |
| Create release | Go to GitHub → Releases → Draft new release |

## Support

For more details, see:
- `GITHUB_RELEASES.md` — Detailed auto-update setup
- `DESKTOP_APP_QUICKSTART.md` — Build and test instructions
- `ELECTRON_BUILD.md` — Advanced build configuration

---

**You're all set!** Your app is ready to distribute. 🚀
