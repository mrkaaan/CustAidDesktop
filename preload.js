const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露特定的功能给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    const validChannels = ['data-to-plugin'];
    if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
    } else {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    console.log('Receive', channel);
    
    const validChannels = ['data-from-plugin'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    } else {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  get: (channel) => ipcRenderer.invoke(channel),
  on: (channel, func) => {
    const validChannels = ['data-to-plugin'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    } else {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
