# -*- coding: utf-8 -*-
"""
算法岗刷题软件 - 手机/平板端一键扫码启动器
自动获取本机局域网 IP，并在终端生成清晰二维码，手机扫码即可直接访问刷题！
"""

import os
import sys
import socket
import subprocess

def get_local_ip():
    """获取本机局域网 IPv4 地址"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        try:
            ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def try_print_qr(url):
    """尝试在终端打印字符二维码"""
    try:
        import qrcode
    except ImportError:
        print("[提示] 正在自动安装轻量二维码支持库 (qrcode)...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "qrcode"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            import qrcode
        except Exception:
            print("[说明] 未安装 qrcode 库，可通过上方网址在手机浏览器直接打开。")
            return

    qr = qrcode.QRCode(border=1)
    qr.add_data(url)
    qr.make(fit=True)
    print("\n" + "=" * 50)
    print("📱 请使用手机微信、系统相机或手机浏览器扫描下方二维码：")
    print("=" * 50 + "\n")
    qr.print_ascii(invert=True)
    print("\n" + "=" * 50)

def main():
    ip = get_local_ip()
    port = 5173
    url = f"http://{ip}:{port}"

    print("=" * 66)
    print("   算法岗笔试面试刷题软件 · 手机/平板免输IP极速互联")
    print("=" * 66)
    print(f"\n[+] 本机局域网 IP: {ip}")
    print(f"[+] 移动端访问地址: {url}")
    print("\n[⚡ 提示] 请确保手机与当前电脑连接在【同一个 Wi-Fi 网络】下。")

    try_print_qr(url)

    print("\n[🚀 正在启动题库服务，按 Ctrl+C 退出]...")
    app_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "algo-quiz-app")
    
    cmd = ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", str(port)]
    try:
        subprocess.run(cmd, cwd=app_dir, shell=True)
    except KeyboardInterrupt:
        print("\n[已退出题库服务]")

if __name__ == "__main__":
    main()
