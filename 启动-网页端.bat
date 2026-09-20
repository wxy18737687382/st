@echo off
chcp 65001 >nul
echo ========================================================
echo   算法岗笔试面试刷题软件 - Web 网页端启动中...
echo ========================================================
echo.
cd /d "%~dp0algo-quiz-app"
start http://localhost:5173
npm run dev
pause
