const { app, BrowserWindow, session } = require("electron");
const path = require("path");
const log = require('electron-log');
const ipcMain = require("electron").ipcMain;
const fs = require('fs');
const os = require('os');
const {
  getVersionLookup,
  getComPorts,
  getNewlyPluggedInPorts,
  updateMouseHelper,
  isInDfuMode
} = require("./firmwarehelpers.js");


function getAppDataPath() {
  switch (process.platform) {
    case "darwin": {
      return path.join(process.env.HOME, "Library", "Application Support", "Finalware");
    }
    case "win32": {
      return path.join(process.env.APPDATA, "Finalware");
    }
    case "linux": {
      return path.join(process.env.HOME, ".Finalware");
    }
    default: {
      log.error("Unsupported platform!");
      process.exit(1);
    }
  }
}
const APP_DATA = getAppDataPath();

log.transports.file.resolvePath = () => path.join(APP_DATA, `logs/main.log`);
log.info(`Log file gets saved in Directory ${path.join(APP_DATA, 'logs/')}`);
log.info("main.js loaded and modules imported");


log.info(`${arguments.callee.name} got executed`);
log.info(`Platform: ${process.platform} version ${os.release()}`);
log.info(`App is ${!app.isPackaged ? "not" : ""} packaged`);





function createWindow() {
  // https://github.com/electron/electron/issues/13670
  let windowWidth = 453;
  let windowHeight = 453;
  if (process.platform === "win32") {
    // Windows and Mac had some window size issues
    windowWidth += 15;
    windowHeight += 30;
  } else if (process.platform === "darwin") {
    windowWidth -= 1;
    windowHeight += 22;
  }

  const debug = false;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      devTools: !app.isPackaged,
      preload: `${__dirname}/preload.js`,
    },
    enableRemoteModule: true,
    nodeIntegration: true,
    autoHideMenuBar: true,
    icon: `${__dirname}/../app/finalmouse-logo.ico`,

  });

  // and load the index.html of the app.
  log.info("Loading index.html");
  mainWindow.loadFile("app/index.html");
  log.info("Loaded index.html");

  if (!app.isPackaged) {
    mainWindow.setAlwaysOnTop(true, "screen");
  }

}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //log the status of the app with electron-log
  log.info("app.whenReady got executed");
  createWindow();
  ipcMain.handle("exit", (event, title) => {
    app.quit();
  });
  ipcMain.handle("infolog", (event, message) => {
    log.info(message);
  });
  ipcMain.handle("errorlog", (event ,message) => {
    log.error(message);
  });


  ipcMain.handle("get-versions", async (event) => {
    return await getVersionLookup();
  });

  ipcMain.handle("get-ports", async (event) => {
    return await getComPorts();
  });
  ipcMain.handle(
    "update-mouse",
    async (event, port, firmwareVersion) => {
      return await updateMouseHelper(
        port,
        firmwareVersion
      );
    }
  );

  app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

try {
  require("electron-reloader")(module);
} catch (_) { }
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
//ipc function that exits the app
