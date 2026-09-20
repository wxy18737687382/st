@echo off
chcp 65001 >nul
title 算法刷题手机端扫码连接
echo ========================================================
echo   算法岗笔试面试刷题软件 - 手机/平板扫码极速启动
echo ========================================================
echo.
cd /d "%~dp0"
python scripts\serve_mobile_qr.py
pause
