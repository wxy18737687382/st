@echo off
chcp 65001 >nul
cd /d "%~dp0"

if exist "algo-quiz-app\release\win-unpacked\算法岗刷题客户端.exe" (
    start "" "algo-quiz-app\release\win-unpacked\算法岗刷题客户端.exe"
    exit
)

if exist "算法岗刷题客户端.exe" (
    start "" "算法岗刷题客户端.exe"
    exit
)

echo ========================================================
echo   算法岗笔试面试刷题客户端 - 启动中...
echo ========================================================
echo.
cd /d "%~dp0algo-quiz-app"
npm run electron:dev
