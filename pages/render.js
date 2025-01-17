// import drag from 'electron-drag';

// // 获取自定义标题栏元素
// const customTitleBar = document.getElementById('custom-title-bar');

// if (customTitleBar) {
//     drag(customTitleBar);
// }

// let dragging = false;
// let initialClientX, initialClientY;
// let initialWindowX, initialWindowY;

// // 监听鼠标按下事件开始拖动
// customTitleBar.addEventListener('mousedown', async (e) => {
//   console.log('开始拖动窗口');
  
//   // 发送消息给主进程请求窗口当前位置
//   let position = await electronAPI.get('get-window-position');
  
//   if (position !== null && !dragging) {
//     dragging = true;

//     // 记录初始的鼠标点击位置和窗口位置
//     initialClientX = e.clientX;
//     initialClientY = e.clientY;
//     initialWindowX = position.x;
//     initialWindowY = position.y;
//   }
// });

// document.addEventListener('mousemove', (e) => {
//   if (!dragging) return;

//   // 计算新的窗口位置
//   const deltaX = e.clientX - initialClientX;
//   const deltaY = e.clientY - initialClientY;
//   const newX = initialWindowX + deltaX;
//   const newY = initialWindowY + deltaY;
//   const data = { x: newX, y: newY };

//   // 发送消息给主进程以更新窗口位置
//   electronAPI.send('update-window-position', data);
// });

// document.addEventListener('mouseup', () => {
//   dragging = false;
// });



// // 关闭和最小化按钮的事件处理
// document.getElementById('minimize-btn').addEventListener('click', () => {
//   ipcRenderer.send('minimize-window');
// });

// document.getElementById('close-btn').addEventListener('click', () => {
//   ipcRenderer.send('close-window');
// });