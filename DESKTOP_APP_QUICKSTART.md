# All-Pro Coast 2 Coast CRM — Desktop App Quick Start

## Installation

```bash
# Install dependencies
pnpm install
```

## Development & Testing

### Test the Electron App (Recommended First Step)

```bash
pnpm electron-dev
```

This starts both the backend server and the Electron app with hot-reload. You'll see:
1. A splash screen with your All-Pro logo
2. The main CRM app loading
3. All features working with local data storage

**What to test:**
- ✅ Add a customer and refresh — data persists
- ✅ Create a job and check the database
- ✅ Upload portfolio photos
- ✅ Test the Wrap Designer and Sticker Designer
- ✅ Verify Stripe checkout works

### Build Installers

**For your current OS:**
```bash
pnpm electron-build
```

**For specific platforms:**
```bash
pnpm electron-build-win    # Windows .exe
pnpm electron-build-mac    # macOS .dmg
pnpm electron-build-linux  # Linux .AppImage
```

Installers are created in `dist-electron/`

## File Locations

### Database
All your customer, job, invoice, and inventory data is stored locally:

- **Windows**: `C:\Users\YourUsername\AppData\Roaming\All-Pro Coast 2 Coast CRM\crm-database.db`
- **macOS**: `~/Library/Application Support/All-Pro Coast 2 Coast CRM/crm-database.db`
- **Linux**: `~/.config/All-Pro Coast 2 Coast CRM/crm-database.db`

### Logs
- **Windows**: `C:\Users\YourUsername\AppData\Roaming\All-Pro Coast 2 Coast CRM\logs`
- **macOS**: `~/Library/Logs/All-Pro Coast 2 Coast CRM`
- **Linux**: `~/.config/All-Pro Coast 2 Coast CRM/logs`

## Features

✅ **Offline-First** — Works without internet  
✅ **Local Database** — All data stays on your computer  
✅ **Auto-Updates** — Checks for new versions on startup  
✅ **Cross-Platform** — Windows, macOS, Linux  
✅ **Portable** — Run from USB drive or any location  

## Troubleshooting

**Port 5173 already in use?**
```bash
# Kill the process using port 5173
# Windows: netstat -ano | findstr :5173
# macOS/Linux: lsof -i :5173 | kill -9 <PID>
```

**Build fails?**
```bash
# Clear cache and rebuild
rm -rf dist dist-electron node_modules/.vite
pnpm install
pnpm electron-build
```

**App won't start?**
- Check that Node.js 16+ is installed: `node --version`
- Ensure all dependencies installed: `pnpm install`
- Check logs in the database directory

## Next Steps

1. **Test locally** with `pnpm electron-dev`
2. **Build installers** with `pnpm electron-build`
3. **Set up GitHub Releases** (see GITHUB_RELEASES.md)
4. **Share with customers** — they download and install

## Support

For issues or questions, check:
- `ELECTRON_BUILD.md` — Detailed build instructions
- `GITHUB_RELEASES.md` — Auto-update setup
- `.manus-logs/` — Dev server logs

---

**Ready to go live?** Follow the GitHub Releases guide to enable auto-updates and distribute your app!
