const { app, BrowserWindow, screen, ipcMain  } = require('electron');
const path = require('path');

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

    const win = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        x: x,
        y: y,
        autoHideMenuBar: true,  //自动隐藏菜单栏
        alwaysOnTop: true,     //置顶
        titleBarStyle: 'hidden', //隐藏标题栏
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

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});