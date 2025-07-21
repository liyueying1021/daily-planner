# 🚀 每日计划助手 - 部署指南

## 📋 部署选项概览

| 方式 | 难度 | 成本 | 推荐度 | 说明 |
|------|------|------|--------|------|
| 本地网络分享 | ⭐ | 免费 | ⭐⭐⭐ | 适合临时分享 |
| Vercel部署 | ⭐⭐ | 免费 | ⭐⭐⭐⭐⭐ | 推荐新手 |
| Heroku部署 | ⭐⭐ | 免费 | ⭐⭐⭐⭐ | 稳定可靠 |
| 云服务器部署 | ⭐⭐⭐ | 付费 | ⭐⭐⭐⭐ | 完全控制 |
| Docker部署 | ⭐⭐⭐⭐ | 免费 | ⭐⭐⭐ | 适合技术用户 |

## 🌐 方式一：本地网络分享（最简单）

### 适用场景
- 临时分享给同事或朋友
- 在同一个WiFi网络内使用
- 快速演示应用功能

### 步骤

1. **启动应用**
   ```bash
   cd /Users/a58/daily-planner-app
   ./start.sh
   ```

2. **查看IP地址**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   找到类似 `192.168.1.100` 的地址

3. **分享访问地址**
   - 其他人访问：`http://您的IP地址:3000`
   - 例如：`http://192.168.1.100:3000`

4. **注意事项**
   - 确保防火墙允许3000和3001端口
   - 您的电脑需要保持开机
   - 其他人必须在同一个网络内

## ☁️ 方式二：Vercel部署（推荐）

### 优势
- 完全免费
- 自动HTTPS
- 全球CDN
- 部署简单

### 步骤

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署应用**
   ```bash
   cd /Users/a58/daily-planner-app
   vercel --prod
   ```

4. **配置环境变量**
   - 在Vercel控制台设置 `OPENAI_API_KEY`（可选）

5. **获取访问地址**
   - 部署完成后会得到类似 `https://your-app.vercel.app` 的地址

## 🐳 方式三：Heroku部署

### 优势
- 免费额度
- 稳定可靠
- 支持自定义域名

### 步骤

1. **安装Heroku CLI**
   ```bash
   brew install heroku/brew/heroku
   ```

2. **登录Heroku**
   ```bash
   heroku login
   ```

3. **创建应用**
   ```bash
   heroku create your-daily-planner-app
   ```

4. **设置环境变量**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set OPENAI_API_KEY=your_api_key_here
   ```

5. **部署**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **访问应用**
   ```bash
   heroku open
   ```

## 🖥️ 方式四：云服务器部署

### 推荐配置
- **阿里云/腾讯云**: 2核4G内存
- **系统**: Ubuntu 20.04 LTS
- **带宽**: 5Mbps以上

### 步骤

1. **购买云服务器**
   - 选择Ubuntu系统
   - 配置安全组，开放80、443、3000、3001端口

2. **连接服务器**
   ```bash
   ssh root@your-server-ip
   ```

3. **安装Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pm2
   ```

4. **上传代码**
   ```bash
   # 在本地打包
   tar -czf daily-planner.tar.gz daily-planner-app/
   
   # 上传到服务器
   scp daily-planner.tar.gz root@your-server-ip:/root/
   
   # 在服务器解压
   tar -xzf daily-planner.tar.gz
   ```

5. **部署应用**
   ```bash
   cd daily-planner-app
   ./deploy.sh
   ```

6. **配置域名和SSL**
   ```bash
   # 安装Nginx
   sudo apt install nginx
   
   # 配置反向代理
   sudo nano /etc/nginx/sites-available/daily-planner
   ```

   Nginx配置示例：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api/ {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **启用配置**
   ```bash
   sudo ln -s /etc/nginx/sites-available/daily-planner /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🐳 方式五：Docker部署

### 优势
- 环境一致
- 易于迁移
- 支持容器编排

### 步骤

1. **安装Docker**
   ```bash
   # macOS
   brew install docker
   
   # 启动Docker Desktop
   open /Applications/Docker.app
   ```

2. **构建镜像**
   ```bash
   cd /Users/a58/daily-planner-app
   docker build -t daily-planner .
   ```

3. **运行容器**
   ```bash
   docker run -d -p 3000:3000 -p 3001:3001 --name daily-planner-app daily-planner
   ```

4. **访问应用**
   - 本地访问：`http://localhost:3000`
   - 网络访问：`http://your-ip:3000`

## 🔧 生产环境优化

### 1. 环境变量配置
```bash
# 创建生产环境配置
cp backend/env.example backend/.env.production

# 编辑配置文件
nano backend/.env.production
```

### 2. 数据库集成（可选）
```bash
# 安装MongoDB或PostgreSQL
# 配置数据库连接
# 修改后端代码支持数据持久化
```

### 3. 监控和日志
```bash
# 使用PM2监控
pm2 monit

# 查看日志
pm2 logs daily-planner-backend
```

### 4. 备份策略
```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz daily-planner-app/
echo "备份完成: backup_$DATE.tar.gz"
EOF
chmod +x backup.sh
```

## 🚨 常见问题

### Q: 部署后无法访问？
A: 检查以下几点：
- 端口是否正确开放
- 防火墙设置
- 域名解析是否正确
- 服务是否正常启动

### Q: AI功能不工作？
A: 确保设置了正确的OpenAI API密钥：
```bash
export OPENAI_API_KEY=your_api_key_here
```

### Q: 性能问题？
A: 优化建议：
- 使用CDN加速静态资源
- 启用Gzip压缩
- 配置缓存策略
- 使用PM2集群模式

## 📞 技术支持

如果遇到部署问题，可以：
1. 查看应用日志
2. 检查网络连接
3. 验证配置文件
4. 联系技术支持

## 🎉 部署完成

部署成功后，您就可以：
- 分享链接给朋友使用
- 在任何设备上访问
- 享受24/7在线服务
- 获得专业的用户体验

祝您部署顺利！🚀 