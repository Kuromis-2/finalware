const { contextBridge, ipcRenderer } = require('electron')
console.log('preload.js')
console.log('preload.js - before electronAPI')
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    getport: (key) => ipcRenderer.send('get-port', key)
})
console.log('preload.js - before firmware')
contextBridge.exposeInMainWorld('firmware', {
    savePorts: (key) => ipcRenderer.send('save-ports', key),
    updateMouse: () => ipcRenderer.send('update-mouse', key)
})
console.log('preload.js - before local')
contextBridge.exposeInMainWorld('storage', {
    store: (firmware) => ipcRenderer.send('save-in-localstorage', firmware),
    get: (key) => ipcRenderer.send('get-from-localstorage', key)
})