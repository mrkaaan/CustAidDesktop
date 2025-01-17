// 关闭和最小化按钮的事件处理
document.getElementById('minimize-btn').addEventListener('click', () => {
    electronAPI.send('minimize-window');
});

document.getElementById('close-btn').addEventListener('click', () => {
    electronAPI.send('close-window');
});