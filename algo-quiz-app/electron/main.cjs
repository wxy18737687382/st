const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: '算法岗笔试面试刷题客户端',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Open external links in default system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Custom Application Menu
  const template = [
    {
      label: '题库模式',
      submenu: [
        { label: '刷题工作台', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('switch-mode', {detail: 'practice'}))") },
        { label: '速记背题模式', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('switch-mode', {detail: 'flashcard'}))") },
        { label: '手撕代码沙盒', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('switch-mode', {detail: 'code-sandbox'}))") },
        { label: '学习统计看板', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('switch-mode', {detail: 'stats'}))") },
        { type: 'separator' },
        { label: '退出', role: 'quit' },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' },
      ],
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '刷新界面' },
        { role: 'forceReload', label: '强制刷新' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏模式' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: 'LeetCode 力扣主页',
          click: () => shell.openExternal('https://leetcode.cn/'),
        },
        {
          label: '关于本软件',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '算法岗三端刷题软件',
              message: '算法岗笔试面试全真题库客户端 (v1.0.0)',
              detail: '包含 596+ 道高频算法、机器学习/大模型理论题与手撕算子。\n支持 Web、移动端 PWA 与 PC 桌面端三端无缝切换。',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
