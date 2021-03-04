const { ipcRenderer } = require('electron');

ipcRenderer.on('show-profile', (event, args) => {
    document.getElementById('username-profile').innerHTML = args[0]
});