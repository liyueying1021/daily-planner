#!/bin/bash

echo "🚀 启动每日计划助手应用..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

# 启动后端服务器
echo "📡 启动后端服务器..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

# 在后台启动后端服务器
node server.js &
BACKEND_PID=$!

# 等待后端服务器启动
sleep 3

# 启动前端服务器
echo "🎨 启动前端服务器..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 在后台启动前端服务器
npm start &
FRONTEND_PID=$!

echo "✅ 应用启动成功！"
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# 保持脚本运行
wait 