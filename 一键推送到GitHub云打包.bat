@echo off
cd /d "%~dp0"
git add .
git commit -m "update: sync questions and app code" 2>nul
git push -u origin main
echo.
echo ========================================================================
echo  GitHub Actions 正在云端全自动打包 APK！
echo  请打开查看进度: https://github.com/wxy18737687382/st/actions
echo ========================================================================
echo.
pause
