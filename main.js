const { app, BrowserWindow, screen, ipcMain, protocol } = require('electron');
const path = require('path');
const WebSocket = require('ws');

let win;

function createWindow () {
    // 获取主显示器的工作区尺寸
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // 窗口的宽度和高度
    const winWidth = 300;
    const winHeight = 400;

    // 计算窗口的 x 和 y 坐标
    const x = Math.floor((width - winWidth) * 9 / 10); // 四分之三位置
    const y = Math.floor((height - winHeight) / 2);   // 居中垂直位置

    win = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        x: x,
        y: y,
        autoHideMenuBar: true,  //自动隐藏菜单栏
        alwaysOnTop: true,     //置顶
        titleBarStyle: 'hidden', //隐藏标题栏
        skipTaskbar: true,     //不显示在任务栏
        webSecurity: false,    //允许跨域请求
        webPreferences: {
          contextIsolation: true, // 推荐开启以提高安全性
          nodeIntegration: false, // 推荐关闭以提高安全性
          preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('./pages/index.html');

    ipcMain.on('minimize-window', () => {
        if (win) {
            win.minimize();
        }
    });

    ipcMain.on('close-window', () => {
        if (win) {
            win.close();
        }
    });

}

app.whenReady().then(() => {
  createWindow();

  // 创建 WebSocket 服务器
  const wss = new WebSocket.Server({ port: 8082 });

    // 添加启动成功日志
  wss.on('listening', () => {
    console.log('WebSocket server started on port 8082');
  });

  wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received data from plugin:', data);
        if (win) {
            console.log('Sending data to renderer');
            win.webContents.send('data-from-plugin', JSON.stringify({type: 'data', ...data}));
        } else {
            console.log('No window found');
        }
      });

      ws.on('close', () => {
          console.log('Client disconnected');
      });

      // 发送消息给客户端
      ws.send(JSON.stringify({ type: 'initial', message: 'Hello from Electron app!' }));

      ipcMain.on('focus-tab', (event, tabId) => {
        console.log('Focusing tab', tabId);
        
        // 发送消息给浏览器扩展
        ws.send(JSON.stringify({ type:'data', action: 'focusTab', tabId: tabId }));
      });
  });

  ipcMain.on('delete-tab', (event, tabId) => {
    // 发送删除命令给插件端
    socket.send(JSON.stringify({ action: 'delete', tabId }));
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });


});


