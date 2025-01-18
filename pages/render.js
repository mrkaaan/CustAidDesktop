// 关闭和最小化按钮的事件处理
document.getElementById('minimize-btn').addEventListener('click', () => {
    electronAPI.send('minimize-window');
});

document.getElementById('close-btn').addEventListener('click', () => {
    electronAPI.send('close-window');
});

// 监听主进程发送的数据
window.electronAPI.on('data-received', (data) => {
    const displayElement = document.getElementById('display');
    displayElement.innerText = data; // 将数据显示在页面上
    // displayElement.textContent = data; // 另一种方式
});