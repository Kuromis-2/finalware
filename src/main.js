const {app, BrowserWindow} = require('electron')
const path = require('path')
const ipcMain = require('electron').ipcMain;
const {saveComPorts, updateMouseHelper} =  require('./firmwarehelpers.js');
const storage = require('electron-json-storage');
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 453,
    height: 453,
    webPreferences: {
      
      preload: `${__dirname}/preload.js`
    },
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      autoHideMenuBar: true
  })
  //mainWindow.resizable = false;
  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')
  // TODO: Remove
  mainWindow.setAlwaysOnTop(true, 'screen');
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  ipcMain.on('set-title', (event, title) => {
    app.quit();
  })
  ipcMain.on('save-ports', (event, key) => {
    console.log("main.js");
    saveComPorts(key);
  })
  ipcMain.on('update-mouse', (event, key) => {
    console.log("main.js");
    updateMouseHelper();
  })
  ipcMain.on('save-in-localstorage', (event, firmware) => {
    console.log("savebefore");
    //save firmware to local storage with electron-json-storage
    storage.set('firmwareVersion', firmware, function(error) {
      if (error) throw error;
    });
    console.log("FirmwareVersion"+ firmware);
    console.log(`Saved ${firmware} to ${dataPath} under key ${key}`);
  })

  //console.log("Saved firmware version: " + version);
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

try {
    require('electron-reloader')(module)
  } catch (_) {}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
ipcMain.on('set-title', (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
})
//ipc function that exits the app
