const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    title: 'Dark Hollow',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#050507',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Hide the default menu bar for a clean game experience
  Menu.setApplicationMenu(null);

  // Load the built React app
  // In packaged mode, extraResources puts files in resources/app/frontend/build/
  // In dev mode, it's at ../frontend/build/
  let buildPath;
  if (app.isPackaged) {
    buildPath = path.join(process.resourcesPath, 'app', 'frontend', 'build', 'index.html');
  } else {
    buildPath = path.join(__dirname, '..', 'frontend', 'build', 'index.html');
  }
  mainWindow.loadFile(buildPath);

  // Fullscreen toggle with F11
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
