#!/bin/bash

# 用户行为分析 Demo 启动脚本

echo "🎯 用户行为分析 Demo 启动器"
echo "================================"

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查是否安装了 Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ 未找到 Python，请先安装 Python"
    echo "   下载地址: https://www.python.org/"
    exit 1
fi

echo "✅ 检测到 Node.js: $(node --version)"
echo "✅ 检测到 Python: $($PYTHON_CMD --version)"
echo ""

# 构建项目
echo "🔨 构建项目..."
cd ..
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
echo "✅ 构建完成"
echo ""

# 回到 demo 目录
cd demo

# 启动 HTTP 服务器
echo "🚀 启动 Demo 服务器..."
echo "📂 服务目录: $(pwd)"
echo "🌐 访问地址: http://localhost:8080"
echo ""
echo "📋 可用的演示页面:"
echo "   • http://localhost:8080/index.html - 演示中心"
echo "   • http://localhost:8080/comprehensive-demo.html - 综合演示"
echo "   • http://localhost:8080/demo.html - 基础追踪演示"
echo "   • http://localhost:8080/player-demo.html - 行为回放演示"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务器"
echo "================================"
echo ""

# 尝试自动打开浏览器
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:8080/index.html
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8080/index.html
elif command -v start &> /dev/null; then
    # Windows (Git Bash)
    start http://localhost:8080/index.html
fi

# 启动 Python HTTP 服务器
$PYTHON_CMD -m http.server 8080