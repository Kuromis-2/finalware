const {app, BrowserWindow} = require('electron')
const path = require('path')
const ipcMain = require('electron').ipcMain;
const { getComPorts, updateMouseHelper} =  require('./firmwarehelpers.js');
const { getNewlyPluggedInPorts } = require('./firmwareutil.js');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 483,
    webPreferences: {
      
      preload: `${__dirname}/preload.js`
    },
      enableRemoteModule: true,
      nodeIntegration: true,
      autoHideMenuBar: true
  })

  //mainWindow.resizable = false;
  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')

  // TODO: Remove
  mainWindow.setAlwaysOnTop(true, 'screen');
  // mainWindow.webContents.openDevTools()
  //check if current os is windows and change window size
  if (process.platform === 'win32') {
    mainWindow.setSize(468, 486);
  }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  ipcMain.handle('exit', (event, title) => {
    app.quit();
  })

  ipcMain.handle('get-ports', async (event, beforePorts, afterPorts) => { 
    return await getComPorts(); 
  })

  ipcMain.handle('get-new-ports', (event, beforePorts, afterPorts) => {
    return getNewlyPluggedInPorts(beforePorts, afterPorts);
  })

  ipcMain.handle('update-mouse', async (event, pluggedInPorts, firmwareVersion) => {
    return await updateMouseHelper(pluggedInPorts, firmwareVersion);
  })

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
})}
//ipc function that exits the app
