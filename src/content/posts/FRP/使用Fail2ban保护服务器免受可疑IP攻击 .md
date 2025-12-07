---
title: 使用Fail2ban保护服务器免受可疑IP攻击 
date:  2025-06-08 21:11:00
expires: 2025-08-21 23:59:59
mathjax: true
categories: frp
tags: [frp]
---


Fail2ban是一个强大的安全工具，能够监控服务器日志文件，检测可疑活动，并自动配置防火墙规则来阻止发起这些活动的IP地址。下面是详细的配置和使用方法：

## 安装Fail2ban

在Debian/Ubuntu系统上：
```bash
sudo apt update
sudo apt install fail2ban
```

在CentOS/RHEL系统上：
```bash
sudo yum install epel-release
sudo yum install fail2ban
```

## 基本配置

1. 首先，创建自定义配置文件：
```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

2. 编辑自定义配置文件：
```bash
sudo nano /etc/fail2ban/jail.local
```

3. 设置全局参数，例如：
```ini
[DEFAULT]
# 禁止时间（秒）
bantime = 3600
# 查找失败尝试的时间窗口（秒）
findtime = 600
# 在findtime期间允许的最大失败尝试次数
maxretry = 5
# 默认使用的防火墙
banaction = iptables-multiport
```

## 为frps创建自定义规则

1. 创建自定义过滤器来匹配frps日志中的异常行为：
```bash
sudo nano /etc/fail2ban/filter.d/frps.conf
```

2. 添加以下内容来检测RDP连接尝试：
```ini
[Definition]
failregex = frps\[\d+\]: .* \[proxy/proxy\.go:\d+\] \[.*\] \[rdp\] get a user connection \[<HOST>:\d+\]
ignoreregex =
```

3. 创建一个专门监控HTTP代理错误的过滤器：
```bash
sudo nano /etc/fail2ban/filter.d/frps-http.conf
```

4. 添加以下内容：
```ini
[Definition]
failregex = frps\[\d+\]: .* \[httputil/reverseproxy\.go:\d+\] do http proxy request \[host: .*\] error: .* <HOST> .*
ignoreregex =
```

5. 在jail.local文件中添加自定义规则：
```bash
sudo nano /etc/fail2ban/jail.local
```

6. 添加以下配置：
```ini
[frps-rdp]
enabled = true
port = 你的frp服务端口
filter = frps
logpath = /var/log/syslog
# 调整以下参数根据需要
maxretry = 3
findtime = 300
bantime = 3600

[frps-http]
enabled = true
port = 你的frp服务端口
filter = frps-http
logpath = /var/log/syslog
# 调整以下参数根据需要
maxretry = 5
findtime = 600
bantime = 3600
```

## 启动并测试Fail2ban

1. 重启Fail2ban服务：
```bash
sudo systemctl restart fail2ban
```

2. 检查服务状态：
```bash
sudo systemctl status fail2ban
```

3. 查看当前监狱状态：
```bash
sudo fail2ban-client status
```

4. 检查特定监狱详情：
```bash
sudo fail2ban-client status frps-rdp
```

5. 手动解除IP封禁（如有需要）：
```bash
sudo fail2ban-client set frps-rdp unbanip 123.45.67.89
```

## 监控和维护

- 定期查看Fail2ban日志：
```bash
sudo tail -f /var/log/fail2ban.log
```

- 查看当前被封禁的IP列表：
```bash
sudo iptables -L -n
```

- 考虑设置永久忽略的IP（白名单）：
在jail.local中的[DEFAULT]部分添加：
```ini
ignoreip = 127.0.0.1/8 192.168.1.0/24 你的固定IP地址
```

通过这种配置，Fail2ban将自动识别并阻止对frps服务的可疑访问尝试，从而大大提高服务器的安全性。

