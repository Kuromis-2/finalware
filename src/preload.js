const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.invoke('set-title', title),
})

contextBridge.exposeInMainWorld('firmware', {
    getPorts: (key) => ipcRenderer.invoke('get-ports', key),
    getNewPorts: (beforePorts, afterPorts) => ipcRenderer.invoke('get-new-ports', beforePorts, afterPorts),
    updateMouse: (pluggedInPorts, firmwareVersion) => ipcRenderer.invoke('update-mouse', JSON.parse(pluggedInPorts), firmwareVersion)
})