# AeThex Education Desktop App

Build native desktop applications (.exe for Windows, .dmg for macOS, .AppImage for Linux) from the AeThex Education web app, similar to how Roblox Studio works.

## 🎯 Features

- **Native Desktop Experience** - Standalone app with system integration
- **Offline Support** - Can bundle the web app for offline use
- **Auto-Updates** - Built-in update mechanism (can be configured)
- **System Tray** - Optional system tray integration
- **Cross-Platform** - Windows, macOS, and Linux support

## 📦 Prerequisites

Before building the desktop app, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. Platform-specific build tools:
   - **Windows**: No additional tools needed
   - **macOS**: Xcode Command Line Tools
   - **Linux**: `icnsutils`, `graphicsmagick`, `rpm` (for .rpm packages)

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Development Mode

Run the desktop app in development mode (with hot reload):

```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server on http://localhost:5000
2. Wait for the server to be ready
3. Launch the Electron app window
4. Enable dev tools for debugging

### Build for Production

#### Build for Windows (.exe)

```bash
npm run electron:build:win
```

This creates:
- **NSIS Installer**: `dist-electron/AeThex-Education-Setup-1.0.0.exe` (installable)
- **Portable**: `dist-electron/AeThex-Education-Portable-1.0.0.exe` (no install required)

Both 32-bit (ia32) and 64-bit (x64) versions are built.

#### Build for macOS (.dmg)

```bash
npm run electron:build:mac
```

Creates: `dist-electron/AeThex-Education-1.0.0.dmg`

#### Build for Linux

```bash
npm run electron:build:linux
```

Creates:
- **AppImage**: `dist-electron/AeThex-Education-1.0.0.AppImage`
- **Debian Package**: `dist-electron/AeThex-Education-1.0.0.deb`

#### Build for All Platforms

```bash
npm run electron:build
```

Builds for the current platform.

## 🎨 App Icons

App icons are located in the `build/` directory:

- **Windows**: `build/icon.ico` (256x256 multi-size)
- **macOS**: `build/icon.icns`
- **Linux**: `build/icon.png` (512x512 or 1024x1024)

### Creating Custom Icons

See `build/README.md` for instructions on generating icon files from a source image.

## ⚙️ Configuration

### electron-builder.json

Main configuration file for building the desktop app:

```json
{
  "appId": "com.aethex.education",
  "productName": "AeThex Education",
  ...
}
```

Key settings:
- **appId**: Unique application identifier
- **productName**: Display name of the app
- **directories.output**: Where builds are saved (`dist-electron/`)

### electron/main.ts

Main Electron process file. Key features:

- **Window Management**: Creates and manages the app window
- **Security**: Context isolation, no Node integration in renderer
- **External Links**: Opens external URLs in default browser
- **Development vs Production**: Different behavior for dev/prod

## 🌐 Online vs Bundled Mode

The desktop app supports two modes:

### 1. **Online Mode** (Default for production)

Loads from the live website (https://aethex.education):

```typescript
// In electron/main.ts
mainWindow.loadURL('https://aethex.education');
```

**Pros:**
- Always up-to-date content
- Smaller download size
- Easier updates

**Cons:**
- Requires internet connection
- Depends on server availability

### 2. **Bundled Mode**

Includes the web app files in the desktop build:

```typescript
// In electron/main.ts
mainWindow.loadFile(path.join(__dirname, '../dist/spa/index.html'));
```

**Pros:**
- Works offline
- Faster initial load
- No server dependency

**Cons:**
- Larger download size
- Need to rebuild for updates

To switch modes, edit `electron/main.ts` and change the `useOnline` variable.

## 🔐 Security

The app follows Electron security best practices:

- ✅ **Context Isolation**: Enabled
- ✅ **Node Integration**: Disabled in renderer
- ✅ **Sandbox**: Enabled
- ✅ **Web Security**: Enabled
- ✅ **External Link Protection**: Opens in browser

## 📝 Development Tips

### Debugging

The app opens dev tools automatically in development mode. In production:

```javascript
// Add to electron/main.ts
mainWindow.webContents.openDevTools();
```

### Hot Reload

Changes to the web app (client/*, components, etc.) will hot reload automatically. Changes to Electron code (electron/*) require restarting the app.

### Troubleshooting

**App won't start:**
- Check that port 5000 is not in use
- Run `npm run dev` first to ensure Vite works

**Build fails:**
- Ensure all icon files exist in `build/`
- Check Node.js version (should be 18+)
- Clear cache: `rm -rf node_modules dist-electron && npm install`

**White screen on launch:**
- Check the URL being loaded in `electron/main.ts`
- Open dev tools to see console errors
- Ensure `dist/spa` exists if using bundled mode

## 🚢 Distribution

### Windows

Upload the `.exe` files to your website or distribution platform:
- **Installer**: For standard installation
- **Portable**: For users who want no-install version

### macOS

The `.dmg` file needs to be **code signed** for distribution outside the Mac App Store. Without signing, users will see a security warning.

To sign:
```bash
# Requires Apple Developer account
electron-builder --mac --sign
```

### Linux

- **AppImage**: Universal, works on most distros
- **.deb**: For Debian/Ubuntu users

## 🔄 Auto-Updates

To enable auto-updates, configure a release server:

```json
// In electron-builder.json
"publish": {
  "provider": "github",
  "owner": "AeThex-Foundation",
  "repo": "PlatformOS"
}
```

Then use `electron-updater` in `electron/main.ts`.

## 📊 Build Output

After building, find your installers in `dist-electron/`:

```
dist-electron/
├── AeThex-Education-Setup-1.0.0.exe      # Windows installer (64-bit)
├── AeThex-Education-Setup-1.0.0-ia32.exe # Windows installer (32-bit)
├── AeThex-Education-Portable-1.0.0.exe   # Windows portable
├── AeThex-Education-1.0.0.dmg            # macOS disk image
├── AeThex-Education-1.0.0.AppImage       # Linux universal
└── AeThex-Education-1.0.0.deb            # Linux Debian/Ubuntu
```

## 🎓 Like Roblox Studio

This setup mirrors how Roblox Studio works:
- Desktop application that connects to online services
- Can work in online mode (like Studio connecting to Roblox.com)
- Native installation experience
- System integration (shortcuts, file associations)
- Auto-update capabilities

The main difference is this app is web-based under the hood, while Roblox Studio is a native C++ application.

## 📞 Support

For issues or questions about the desktop app:
- Check `electron/main.ts` for configuration
- Review `electron-builder.json` for build settings
- Open dev tools for debugging

---

**Built with:**
- [Electron](https://www.electronjs.org/) - Framework for native apps
- [electron-builder](https://www.electron.build/) - Building and packaging
- [Vite](https://vitejs.dev/) - Web app bundler
