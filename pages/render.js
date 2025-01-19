// 关闭和最小化按钮的事件处理
document.getElementById('minimize-btn').addEventListener('click', () => {
    electronAPI.send('minimize-window');
});

document.getElementById('close-btn').addEventListener('click', () => {
    electronAPI.send('close-window');
});

let storedData = []; // 存储数据

// 监听主进程发送的数据
window.electronAPI.receive('data-from-plugin', (data) => {
    const { action, ...tabData } = JSON.parse(data);
    if (action === 'update') {
        storedData.push(tabData);
    } else if (action === 'delete') {
        storedData = storedData.filter(item => item.tabId !== tabData.tabId);
    }
    console.log('Received data from main process:', data);
    
    // 更新页面显示
    updateDisplay();
});


function updateDisplay() {
    console.log('updateDisplay');
    
    const displayElement = document.getElementById('electron-display');
    displayElement.innerHTML = ''; // 清空现有内容

    storedData.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = `Title: ${item.title}, URL: ${item.url}, Window ID: ${item.windowId}, Tab ID: ${item.tabId}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'jumpTO';
        deleteButton.onclick = () => {
            window.electronAPI.send('focus-tab', item.tabId);
        };

        div.appendChild(deleteButton);
        displayElement.appendChild(div);
    });
}