import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { join } from 'path'
import { app } from 'electron'

// Custom APIs for renderer
const api = {
  saveImage: (fileData) => ipcRenderer.invoke('save-image', fileData),
  getImages: () => ipcRenderer.invoke('get-images'),
  getImagePath: (filename) => ipcRenderer.invoke('get-image-path', filename),
  getImageData: (filename) => ipcRenderer.invoke('get-image-data', filename),
  deleteImage: (filename) => ipcRenderer.invoke('delete-image', filename)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
