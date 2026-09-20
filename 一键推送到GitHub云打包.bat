@echo off
chcp 65001 >nul
cd /d "%~dp0"
python scripts\push_to_github.py
if errorlevel 1 (
    echo.
    echo 正在使用 Git 备用方式推送...
    git push -u origin main
    pause
)
