import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'

// Ensure the images directory exists
const imagesDir = join(app.getPath('userData'), 'images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

function setupProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => { 
    try {
      const url = new URL(request.url)
      const filename = decodeURIComponent(url.pathname.substring(1)) // Remove app://
      const filePath = join(imagesDir, filename)
      if (fs.existsSync(filePath)) {
        callback(filePath)
      } else {
        callback({ error: -6 }) // FILE_NOT_FOUND
      }
    } catch (error) {
      console.error('Protocol error:', error)
      callback({ error: -2 }) // FAILED
    }
  })
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// File system handlers
ipcMain.handle('save-image', async (_, fileData) => {
  try {
    const { name, data } = fileData
    // Ensure unique filename
    const timestamp = Date.now()
    const extension = path.extname(name)
    const baseName = path.basename(name, extension)
    const uniqueName = `${baseName}_${timestamp}${extension}`
    const filePath = join(imagesDir, uniqueName)
    // const extension = path.extname(name) // 
    // const baseName = path.basename(name, extension) // 
    // const uniqueName = `${baseName}${extension}` // 
    // const filePath = join(imagesDir, uniqueName)


    const buffer = Buffer.from(data, 'base64')
    await fs.promises.writeFile(filePath, buffer)
    return { success: true, path: filePath, filename: uniqueName }
  } catch (error) {
  
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-images', async () => {
  try {
    const files = await fs.promises.readdir(imagesDir)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|avif)$/i.test(file))
   
    return imageFiles
  } catch (error) {
    return []
  }
})

ipcMain.handle('get-image-path', async (_, filename) => {
  const filePath = join(imagesDir, filename)
  
  return filePath
})

ipcMain.handle('get-image-data', async (event, filename) => {
  try {
    const imagesDir = join(app.getPath('userData'), 'images')
    const filePath = join(imagesDir, filename)
    const fileData = await fs.promises.readFile(filePath)
    return fileData.toString('base64')
  } catch (error) {
    
    return null
  }
})

ipcMain.handle('delete-image', async (_, filename) => {
  try {
    const filePath = join(imagesDir, filename)
    

    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File not found' }
    }

    await fs.promises.unlink(filePath)
    console.log('Image deleted successfully:', filePath)
    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error.message }
  }
})


app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Register the app protocol
  setupProtocol()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
