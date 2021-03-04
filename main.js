const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron');
let formWin;
let profileWin;

let users = ['renato', 'sergio', 'sara', 'abigail'];

function createWindow() {
    formWin = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });

    formWin.loadFile('./registro.html');
}

app.whenReady().then(createWindow)

function createWindowProfile() {
    profileWin = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });

    profileWin.loadFile('./perfil.html');
}


ipcMain.on('username-check', (event, args) => {
    const check = users.includes(args[0]);
    event.reply('username-checked', check)  ;  
    });

ipcMain.on('signup-error', (event, args) => {
    console.log(args);
    let lines = parseInt(args);
    formWin.setSize(600, (500 + (lines * 20)));
});

ipcMain.on('signup-success', (event, args) => {
    formWin.setSize(600, 500);
    console.log(args);
    createWindowProfile();
    profileWin.webContents.once('did-finish-load', ()=>{
        profileWin.webContents.send('show-profile', args);
    });
});