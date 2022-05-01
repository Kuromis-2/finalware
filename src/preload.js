const { contextBridge, ipcRenderer } = require('electron')
console.log('preload.js')
console.log('preload.js - before electronAPI')
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.invoke('set-title', title),
})
console.log('preload.js - before firmware')
contextBridge.exposeInMainWorld('firmware', {
    getPorts: (key) => ipcRenderer.invoke('get-ports', key),
    getNewPorts: (beforePorts, afterPorts) => ipcRenderer.invoke('get-new-ports', beforePorts, afterPorts),
    updateMouse: (pluggedInPorts, firmwareVersion) => ipcRenderer.invoke('update-mouse', JSON.parse(pluggedInPorts), firmwareVersion)
})
console.log('preload.js - before local')