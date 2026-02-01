/**
 * Preload script for Electron
 * Runs before web content loads, can safely expose limited APIs to renderer
 */

import { contextBridge } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  version: process.versions.electron
});
