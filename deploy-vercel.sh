#!/bin/bash

echo "🚀 每日计划助手 - Vercel快速部署"
echo "================================"

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录Vercel..."
    vercel login
fi

# 构建前端
echo "📦 构建前端应用..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi
cd ..

# 部署到Vercel
echo "🚀 部署到Vercel..."
vercel --prod

echo ""
echo "✅ 部署完成！"
echo "🌐 您的应用现在可以通过以下地址访问："
echo "   https://your-app-name.vercel.app"
echo ""
echo "📝 后续步骤："
echo "1. 在Vercel控制台设置环境变量（可选）"
echo "2. 配置自定义域名（可选）"
echo "3. 分享链接给朋友使用"
echo ""
echo "🎉 享受您的在线每日计划助手！" 