@echo off
chcp 65001 >nul
title 算法岗刷题软件 - 一键推送到 GitHub 云端全自动打包

echo ========================================================================
echo        算法岗刷题软件 · GitHub 云端全自动打包助手 (免装 10GB 环境)
echo ========================================================================
echo.
echo [说明] 本脚本将帮助你一键将代码同步到 GitHub，触发云端全自动编译 APK。
echo.

cd /d "%~dp0"

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git 工具，请先安装 Git: https://git-scm.com/
    pause
    exit /b
)

if not exist ".git" (
    echo [1/4] 初始化本地 Git 仓库...
    git init
    git branch -M main
) else (
    echo [1/4] 本地 Git 仓库已就绪。
)

git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ========================================================================
    echo  请在 GitHub 上创建一个新仓库（公开或私有均可，不要勾选 Initialize README）
    echo ========================================================================
    echo.
    set /p REPO_URL="请输入你的 GitHub 仓库 HTTPS 地址 (例如 https://github.com/你的名字/algo-quiz.git): "
    if "%REPO_URL%"=="" (
        echo [错误] 仓库地址不能为空！
        pause
        exit /b
    )
    git remote add origin %REPO_URL%
) else (
    echo [2/4] 远程仓库已关联。
)

echo.
echo [3/4] 正在整理并提交代码...
git add .
git commit -m "feat: setup cloud automatic build for Android APK and PWA" 2>nul

echo.
echo [4/4] 正在推送到 GitHub 云端 (可能需要登录 GitHub 授权)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================================
    echo  🎉 [推送成功] GitHub Actions 云端正在全自动编译生成 Android APK 安装包！
    echo ========================================================================
    echo.
    echo  👉 如何获取你的手机 APK：
    echo  1. 打开你的 GitHub 仓库网页。
    echo  2. 点击顶部导航栏的【Actions】标签页。
    echo  3. 可以看到正在运行的【全自动云端打包 (Android APK)】流水线。
    echo  4. 等待 2~3 分钟完成后，进入页面下方的【Artifacts】，
    echo     直接点击下载【算法岗刷题-Android-Debug.apk】传输到手机安装即可！
    echo ========================================================================
) else (
    echo.
    echo [提示] 推送遇到问题，请检查：
    echo 1. 仓库地址是否输入正确？
    echo 2. 是否已登录 GitHub 账号并拥有该仓库写入权限？
)

echo.
pause
