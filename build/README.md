# App Icons for Desktop Build

This directory contains icons for the desktop application builds.

## Required Icons

To build the desktop app, you need the following icon files:

### Windows (.exe)
- **icon.ico** - Windows icon file (256x256 recommended)
  - Must contain multiple sizes: 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256

### macOS (.dmg)
- **icon.icns** - macOS icon file
  - Contains multiple sizes from 16x16 to 1024x1024

### Linux (.AppImage, .deb)
- **icon.png** - PNG icon (512x512 or 1024x1024 recommended)

## How to Generate Icons

### From a source PNG (1024x1024):

1. **For Windows (.ico):**
   ```bash
   # Using ImageMagick
   convert icon-1024.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
   ```

2. **For macOS (.icns):**
   ```bash
   # Using iconutil on macOS
   mkdir icon.iconset
   sips -z 16 16     icon-1024.png --out icon.iconset/icon_16x16.png
   sips -z 32 32     icon-1024.png --out icon.iconset/icon_16x16@2x.png
   sips -z 32 32     icon-1024.png --out icon.iconset/icon_32x32.png
   sips -z 64 64     icon-1024.png --out icon.iconset/icon_32x32@2x.png
   sips -z 128 128   icon-1024.png --out icon.iconset/icon_128x128.png
   sips -z 256 256   icon-1024.png --out icon.iconset/icon_128x128@2x.png
   sips -z 256 256   icon-1024.png --out icon.iconset/icon_256x256.png
   sips -z 512 512   icon-1024.png --out icon.iconset/icon_256x256@2x.png
   sips -z 512 512   icon-1024.png --out icon.iconset/icon_512x512.png
   sips -z 1024 1024 icon-1024.png --out icon.iconset/icon_512x512@2x.png
   iconutil -c icns icon.iconset
   ```

3. **For Linux (.png):**
   ```bash
   # Just use a high-res PNG (512x512 or 1024x1024)
   cp icon-1024.png icon.png
   ```

## Temporary Placeholder

Until custom icons are created, the build will use the default Electron icon.
For production, please replace with AeThex Education branded icons.
