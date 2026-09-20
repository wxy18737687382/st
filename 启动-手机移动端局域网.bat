@echo off
chcp 65001 >nul
echo ========================================================
echo   算法岗笔试面试刷题软件 - 移动端局域网共享模式
echo   手机与电脑连接同一 Wi-Fi 后，用手机浏览器打开显示的 Network 地址
echo   支持 iOS Safari / 安卓 Chrome 点击“添加到主屏幕”安装为独立 PWA 原生应用！
echo ========================================================
echo.
cd /d "%~dp0algo-quiz-app"
npx vite --host
pause
