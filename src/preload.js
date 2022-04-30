const { contextBridge, ipcRenderer } = require('electron')
console.log('preload.js')
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    getport: (key) => ipcRenderer.send('get-port', key)
})
contextBridge.exposeInMainWorld('firmware', {
    savePorts: (key) => ipcRenderer.send('save-ports', key),
    updateMouse: () => ipcRenderer.send('update-mouse', key)
})
contextBridge.exposeInMainWorld('localStorage', {
    save: (firmware) => ipcRenderer.send('save-in-localstorage', firmware)
})