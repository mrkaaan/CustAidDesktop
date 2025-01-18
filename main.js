const { app, BrowserWindow, screen, ipcMain, protocol } = require('electron');
const path = require('path');
const http = require('http');

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

  // 创建 HTTP 服务器
  const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/send-data') {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        console.log('Received data:', data);
        // 将数据发送到渲染进程
        if (win) {
          win.webContents.send('data-received', data);
        } else {
          console.log('Main window is not yet created');
        }
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': 'http://127.0.0.1:5500', // 允许来自 http://127.0.0.1:5500 的请求
        });
        res.end('Data received');
      });
    } else {
      res.writeHead(404, {
        'Access-Control-Allow-Origin': 'http://127.0.0.1:5500', // 允许来自 http://127.0.0.1:5500 的请求
      });
      res.end('Not Found');
    }
  });

  server.listen(3000, '127.0.0.1', () => {
    console.log('HTTP server running at http://127.0.0.1:3000/');
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


