# -*- coding: utf-8 -*-
"""
算法岗刷题软件 - GitHub 云端打包推送助手
"""

import subprocess
import sys
import os

def main():
    print("=" * 68)
    print("        算法岗刷题软件 · GitHub 云端全自动打包助手")
    print("=" * 68)
    print("\n[+] 目标仓库: https://github.com/wxy18737687382/st.git")
    print("[+] 正在推送代码至 GitHub 云端...")
    print("[⚡ 提示] 若系统弹出授权小窗，请点击 'Sign in with your browser' 完成登录。\n")

    # 1. 确保最新更改均已提交
    subprocess.run(["git", "add", "."], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["git", "commit", "-m", "update: sync for cloud apk build"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 2. 尝试推送到 main
    res = subprocess.run(["git", "push", "-u", "origin", "main"])
    if res.returncode != 0:
        print("\n[提示] 普通推送未完成（可能是远程新仓库已有默认文件）。正在尝试同步覆盖 (--force)...")
        res2 = subprocess.run(["git", "push", "-u", "origin", "main", "--force"])
        if res2.returncode != 0:
            print("\n" + "=" * 68)
            print(" [!] 推送遇到问题，可能的原因：")
            print(" 1. 未完成 GitHub 网页授权登录；")
            print(" 2. 账号没有该仓库的写权限；")
            print(" 3. 网络连接 GitHub 超时。")
            print("=" * 68)
            input("\n按回车键退出...")
            return

    print("\n" + "=" * 68)
    print("  🎉 [推送成功] GitHub Actions 云端已开始全自动编译 Android APK！")
    print("=" * 68)
    print("\n👉 请直接在浏览器打开你的 Actions 页面查看打包进度：")
    print("   https://github.com/wxy18737687382/st/actions")
    print("\n大约等待 2~3 分钟编译完成后：")
    print("在页面最底部的【Artifacts】直接点击下载【算法岗刷题-Android-Debug.apk】！")
    print("=" * 68)
    input("\n按回车键退出...")

if __name__ == "__main__":
    main()
