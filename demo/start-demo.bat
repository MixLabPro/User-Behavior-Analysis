@echo off
chcp 65001 >nul
title 用户行为分析 Demo 启动器

echo 🎯 用户行为分析 Demo 启动器
echo ================================

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js，请先安装 Node.js
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
) else (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set PYTHON_CMD=py
    ) else (
        echo ❌ 未找到 Python，请先安装 Python
        echo    下载地址: https://www.python.org/
        pause
        exit /b 1
    )
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('%PYTHON_CMD% --version') do set PYTHON_VERSION=%%i

echo ✅ 检测到 Node.js: %NODE_VERSION%
echo ✅ 检测到 Python: %PYTHON_VERSION%
echo.

REM 构建项目
echo 🔨 构建项目...
cd ..
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)
echo ✅ 构建完成
echo.

REM 回到 demo 目录
cd demo

REM 启动 HTTP 服务器
echo 🚀 启动 Demo 服务器...
echo 📂 服务目录: %CD%
echo 🌐 访问地址: http://localhost:8080
echo.
echo 📋 可用的演示页面:
echo    • http://localhost:8080/index.html - 演示中心
echo    • http://localhost:8080/comprehensive-demo.html - 综合演示
echo    • http://localhost:8080/demo.html - 基础追踪演示
echo    • http://localhost:8080/player-demo.html - 行为回放演示
echo.
echo 💡 提示: 按 Ctrl+C 停止服务器
echo ================================
echo.

REM 自动打开浏览器
start http://localhost:8080/index.html

REM 启动 Python HTTP 服务器
%PYTHON_CMD% -m http.server 8080