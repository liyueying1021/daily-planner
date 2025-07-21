#!/bin/bash

echo "🚀 每日计划助手 - 部署脚本"
echo "================================"

# 检查Node.js和npm
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 构建前端
echo "📦 构建前端应用..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi
cd ..

# 创建生产环境配置
echo "⚙️ 配置生产环境..."

# 创建生产环境的后端配置
cat > backend/.env.production << EOF
NODE_ENV=production
PORT=3001
# 如果需要真实的AI功能，请设置您的OpenAI API密钥
# OPENAI_API_KEY=your_openai_api_key_here
EOF

# 创建PM2配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'daily-planner-backend',
      script: './backend/server.js',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF

echo "✅ 生产环境配置完成"

echo ""
echo "🎯 部署选项："
echo "1. 本地网络分享"
echo "2. Vercel部署（免费）"
echo "3. Heroku部署（免费）"
echo "4. 阿里云/腾讯云部署"
echo "5. Docker部署"
echo ""

read -p "请选择部署方式 (1-5): " choice

case $choice in
    1)
        echo "🌐 本地网络分享"
        echo "================================"
        echo "1. 启动应用："
        echo "   ./start.sh"
        echo ""
        echo "2. 查看您的IP地址："
        echo "   ifconfig | grep 'inet ' | grep -v 127.0.0.1"
        echo ""
        echo "3. 其他人访问："
        echo "   http://您的IP地址:3000"
        echo ""
        echo "注意：确保防火墙允许3000和3001端口"
        ;;
    2)
        echo "🚀 Vercel部署"
        echo "================================"
        echo "1. 安装Vercel CLI："
        echo "   npm install -g vercel"
        echo ""
        echo "2. 登录Vercel："
        echo "   vercel login"
        echo ""
        echo "3. 部署前端："
        echo "   cd frontend && vercel --prod"
        echo ""
        echo "4. 部署后端到Vercel Functions："
        echo "   创建vercel.json配置文件"
        ;;
    3)
        echo "☁️ Heroku部署"
        echo "================================"
        echo "1. 安装Heroku CLI："
        echo "   brew install heroku/brew/heroku"
        echo ""
        echo "2. 登录Heroku："
        echo "   heroku login"
        echo ""
        echo "3. 创建应用："
        echo "   heroku create your-app-name"
        echo ""
        echo "4. 部署："
        echo "   git add . && git commit -m 'Deploy' && git push heroku main"
        ;;
    4)
        echo "☁️ 阿里云/腾讯云部署"
        echo "================================"
        echo "1. 购买云服务器（推荐2核4G）"
        echo "2. 安装Node.js和PM2："
        echo "   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
        echo "   sudo apt-get install -y nodejs"
        echo "   npm install -g pm2"
        echo ""
        echo "3. 上传代码到服务器"
        echo "4. 运行部署脚本："
        echo "   ./deploy.sh"
        echo "5. 配置域名和SSL证书"
        ;;
    5)
        echo "🐳 Docker部署"
        echo "================================"
        echo "1. 创建Dockerfile："
        cat > Dockerfile << 'DOCKEREOF'
FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# 安装依赖
RUN cd frontend && npm install
RUN cd backend && npm install

# 复制源代码
COPY . .

# 构建前端
RUN cd frontend && npm run build

# 暴露端口
EXPOSE 3000 3001

# 启动命令
CMD ["npm", "run", "start:prod"]
DOCKEREOF

        echo "2. 构建镜像："
        echo "   docker build -t daily-planner ."
        echo ""
        echo "3. 运行容器："
        echo "   docker run -p 3000:3000 -p 3001:3001 daily-planner"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "📚 更多部署信息请查看："
echo "   https://github.com/your-username/daily-planner-app"
echo ""
echo "🎉 部署完成！" 