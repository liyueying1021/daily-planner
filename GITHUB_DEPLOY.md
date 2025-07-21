# 🚀 GitHub Pages 部署指南

## 📋 部署步骤

### 第一步：创建GitHub仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `daily-planner-app`
   - **Description**: 每日计划助手 - 智能规划您的每一天
   - **Visibility**: Public（推荐）或 Private
   - **不要**勾选 "Add a README file"（我们已经有了）
4. 点击 "Create repository"

### 第二步：推送代码到GitHub

在您的本地项目目录中运行以下命令：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/daily-planner-app.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

### 第三步：配置GitHub Pages

1. 在GitHub仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分：
   - 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages"
   - Folder 选择 "/ (root)"
4. 点击 "Save"

### 第四步：更新homepage URL

编辑 `frontend/package.json` 文件，将 `homepage` 字段更新为您的实际URL：

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/daily-planner-app",
  // ... 其他配置
}
```

然后重新构建和推送：

```bash
# 重新构建前端
cd frontend
npm run build
cd ..

# 提交更改
git add .
git commit -m "Update homepage URL"
git push
```

### 第五步：等待部署完成

1. GitHub Actions 会自动构建和部署您的应用
2. 您可以在 "Actions" 标签页查看部署进度
3. 部署完成后，您的应用将在以下地址可用：
   ```
   https://YOUR_USERNAME.github.io/daily-planner-app
   ```

## 🎯 部署后的操作

### 验证部署
1. 访问您的GitHub Pages URL
2. 测试所有功能是否正常
3. 检查移动端显示效果

### 分享应用
现在您可以分享这个链接给任何人：
```
🌐 每日计划助手
https://YOUR_USERNAME.github.io/daily-planner-app

✨ 功能特点：
• 美观的左右分栏界面
• 实时日历和任务管理
• AI智能分析和建议
• 支持优先级和时间设置
• 响应式设计，支持手机电脑

快来试试吧！📅✨
```

## 🔧 常见问题

### Q: 部署后页面显示404？
A: 检查以下几点：
- 确保GitHub Actions部署成功
- 检查homepage URL是否正确
- 等待几分钟让GitHub Pages生效

### Q: AI功能不工作？
A: 这是正常的，因为：
- GitHub Pages只支持静态文件
- 后端API需要单独部署
- 应用会自动使用模拟AI功能

### Q: 如何更新应用？
A: 每次推送代码到main分支时：
1. 修改代码
2. 提交更改：`git add . && git commit -m "Update" && git push`
3. GitHub Actions会自动重新部署

### Q: 如何添加自定义域名？
A: 在GitHub Pages设置中：
1. 在 "Custom domain" 字段输入您的域名
2. 在您的域名提供商处添加CNAME记录
3. 指向 `YOUR_USERNAME.github.io`

## 📊 部署优势

使用GitHub Pages部署的优势：
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自动部署
- ✅ 版本控制
- ✅ 易于维护

## 🎉 部署完成

恭喜！您的每日计划助手现在已经：
- 🌐 全球可访问
- 📱 支持所有设备
- 🔒 安全可靠
- ⚡ 快速加载

现在您可以分享给任何人使用了！🎊 