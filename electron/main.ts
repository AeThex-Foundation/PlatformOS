import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'AeThex Education',
    icon: path.join(__dirname, '../build/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      sandbox: true
    },
    backgroundColor: '#1e40af', // Education blue color
    show: false, // Don't show until ready
  });

  // Determine what to load based on environment
  if (isDev) {
    // Development: use Vite dev server
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: check if we should use online or bundled version
    const useOnline = process.env.USE_ONLINE === 'true';

    if (useOnline) {
      // Load from production URL (like Roblox Studio connecting to roblox.com)
      mainWindow.loadURL('https://aethex.education');
    } else {
      // Load bundled app
      mainWindow.loadFile(path.join(__dirname, '../dist/spa/index.html'));
    }
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle external links - open in browser instead of in app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, recreate window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const allowedHosts = ['localhost', 'aethex.education', 'aethex.foundation'];

    if (!allowedHosts.includes(parsedUrl.hostname)) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
});
