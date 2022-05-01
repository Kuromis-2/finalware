const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    exit: (title) => ipcRenderer.invoke('exit'),
})

contextBridge.exposeInMainWorld('firmware', {
    getPorts: (key) => ipcRenderer.invoke('get-ports', key),
    getNewPorts: (beforePorts, afterPorts) => ipcRenderer.invoke('get-new-ports', JSON.stringify(beforePorts), JSON.stringify(afterPorts)),
    updateMouse: (pluggedInPorts, firmwareVersion) => ipcRenderer.invoke('update-mouse', JSON.stringify(pluggedInPorts), firmwareVersion)
})