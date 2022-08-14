const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    exit: (title) => ipcRenderer.invoke("exit"),
    
});
contextBridge.exposeInMainWorld("log", {
    info: (message) => ipcRenderer.invoke("infolog"),
    error: (message) => ipcRenderer.invoke("errorlog"),
});
contextBridge.exposeInMainWorld("firmware", {
    getVersions: () => ipcRenderer.invoke("get-versions"),
    getPorts: () => ipcRenderer.invoke("get-ports"),
    updateMouse: (port, firmwareVersion) =>
        ipcRenderer.invoke(
            "update-mouse",
            port,
            firmwareVersion
        ),
    
});
