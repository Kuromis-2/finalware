const { contextBridge, ipcRenderer } = require('electron')
console.log('preload.js')
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})
contextBridge.exposeInMainWorld('firmware', {
    getports: () => ipcRenderer.send('get-ports', key)
})