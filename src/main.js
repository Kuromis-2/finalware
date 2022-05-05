const { app, BrowserWindow } = require("electron");
const path = require("path");
const ipcMain = require("electron").ipcMain;
const {
    getVersionLookup,
    getComPorts,
    getNewlyPluggedInPorts,
    updateMouseHelper,
} = require("./firmwarehelpers.js");

console.log("main.js loaded");
function createWindow() {
    console.log("createWindow got executed");

    // https://github.com/electron/electron/issues/13670
    let windowWidth = 453;
    let windowHeight = 453;
    
    if (process.platform === "win32") { // Windows and Mac had some window size issues
        windowWidth += 15;
        windowHeight += 33;
    } 
    else if (process.platform === "darwin") {
        windowWidth -= 1;
        windowHeight += 22;
    }

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
        icon: `${__dirname}/../app/finalmouse-logo.ico`
    });

    // and load the index.html of the app.
    console.log("Loading index.html");
    mainWindow.loadFile("app/index.html");
    console.log("index.html loaded");

    if(app.isPackaged) {
        mainWindow.resizable = false;
        mainWindow.maximizable = false;
    }

    if(app.isPackaged) {
        mainWindow.setAlwaysOnTop(true, "screen");
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    console.log("App is ready!");
    createWindow();
    ipcMain.handle("exit", (event, title) => {
        app.quit();
    });

    ipcMain.handle("get-versions", async (event) => {
        return await getVersionLookup();
    });

    ipcMain.handle("get-ports", async (event) => {
        return await getComPorts();
    });

    ipcMain.handle("get-new-ports", async (event, beforePorts, afterPorts) => {
        return await getNewlyPluggedInPorts(
            JSON.parse(beforePorts),
            JSON.parse(afterPorts)
        );
    });

    ipcMain.handle(
        "update-mouse",
        async (event, pluggedInPorts, firmwareVersion) => {
            return await updateMouseHelper(
                JSON.parse(pluggedInPorts),
                firmwareVersion
            );
        }
    );

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

try {
    require("electron-reloader")(module);
} catch (_) {}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
//ipc function that exits the app
