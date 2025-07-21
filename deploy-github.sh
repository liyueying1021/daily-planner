#!/bin/bash

echo "🚀 每日计划助手 - GitHub Pages 部署脚本"
echo "========================================"

# 检查Git状态
if ! git status --porcelain | grep -q .; then
    echo "✅ 工作目录干净，可以部署"
else
    echo "⚠️  检测到未提交的更改，正在提交..."
    git add .
    git commit -m "Auto commit before deployment"
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

echo "✅ 前端构建成功"

# 推送代码到GitHub
echo "🚀 推送代码到GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo "========================================"
    echo "🌐 您的应用将在以下地址可用："
    echo "   https://liyueying1021.github.io/daily-planner"
    echo ""
    echo "📋 接下来的步骤："
    echo "1. 访问 https://github.com/liyueying1021/daily-planner"
    echo "2. 点击 'Settings' 标签"
    echo "3. 在左侧菜单找到 'Pages'"
    echo "4. Source 选择 'Deploy from a branch'"
    echo "5. Branch 选择 'gh-pages'"
    echo "6. 点击 'Save'"
    echo ""
    echo "⏳ 等待几分钟让GitHub Actions完成部署..."
    echo ""
    echo "🎊 部署完成后，您就可以分享链接给任何人使用了！"
else
    echo "❌ 推送失败，请检查："
    echo "1. 是否已在GitHub上创建了仓库"
    echo "2. 网络连接是否正常"
    echo "3. GitHub账户权限是否正确"
fi 