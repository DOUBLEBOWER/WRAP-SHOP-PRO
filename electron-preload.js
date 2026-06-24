const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  version: process.version,
  
  // Database operations
  getDbPath: () => ipcRenderer.invoke('get-db-path'),
  checkDbExists: () => ipcRenderer.invoke('check-db-exists'),
  exportData: () => ipcRenderer.invoke('export-data'),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  
  // Auto-update listeners
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  quitAndInstall: () => ipcRenderer.send('quit-and-install')
});
