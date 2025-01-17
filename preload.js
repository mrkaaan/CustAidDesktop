const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露特定的功能给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  get: (channel, func) => ipcRenderer.invoke(channel)
});
