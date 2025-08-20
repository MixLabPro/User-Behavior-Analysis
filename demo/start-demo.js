#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 控制台颜色代码
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function logWithColor(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
    logWithColor(colors.green, `✅ ${message}`);
}

function logInfo(message) {
    logWithColor(colors.blue, `ℹ️  ${message}`);
}

function logWarning(message) {
    logWithColor(colors.yellow, `⚠️  ${message}`);
}

function logError(message) {
    logWithColor(colors.red, `❌ ${message}`);
}

// 检查端口是否被占用
function checkPort(port) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.listen(port, () => {
            server.close();
            resolve(false); // 端口可用
        });
        server.on('error', () => {
            resolve(true); // 端口被占用
        });
    });
}

// 释放端口
async function releasePort(port) {
    try {
        const { exec } = require('child_process');
        const platform = process.platform;

        if (platform === 'win32') {
            // Windows
            exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                if (stdout) {
                    const lines = stdout.split('\n');
                    lines.forEach(line => {
                        const parts = line.trim().split(/\s+/);
                        if (parts.length > 4) {
                            const pid = parts[4];
                            exec(`taskkill /PID ${pid} /F`, () => {});
                        }
                    });
                }
            });
        } else {
            // macOS/Linux
            exec(`lsof -ti:${port} | xargs kill -9`, () => {});
        }

        // 等待端口释放
        await new Promise(resolve => setTimeout(resolve, 1000));
        logInfo(`端口 ${port} 已释放`);
    } catch (error) {
        logWarning(`释放端口 ${port} 时出错: ${error.message}`);
    }
}

// 启动服务器
async function startServer(port, serverType) {
    const isPortOccupied = await checkPort(port);

    if (isPortOccupied) {
        logWarning(`端口 ${port} 被占用，正在释放...`);
        await releasePort(port);
    }

    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            // 设置CORS头
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            // 处理静态文件
            let filePath = req.url;

            // 默认提供 demo.html
            if (filePath === '/' || filePath === '/demo') {
                filePath = '/demo/demo.html';
            }

            // 构建完整的文件路径
            const fullPath = path.join(__dirname, '..', filePath);

            // 安全检查：确保文件路径在项目目录内
            const projectRoot = path.resolve(__dirname, '..');
            if (!fullPath.startsWith(projectRoot)) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }

            fs.readFile(fullPath, (err, data) => {
                if (err) {
                    console.log(`404 - 文件未找到: ${filePath} (${fullPath})`);
                    res.writeHead(404);
                    res.end('File not found');
                    return;
                }

                // 设置正确的Content-Type
                const ext = path.extname(fullPath);
                const mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.ts': 'application/typescript',
                    '.json': 'application/json',
                    '.mp4': 'video/mp4',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml'
                };

                res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
                res.end(data);
            });
        });

        server.listen(port, () => {
            logSuccess(`${serverType} 服务器已启动在端口 ${port}`);
            resolve(server);
        });

        server.on('error', (error) => {
            logError(`启动 ${serverType} 服务器失败: ${error.message}`);
            reject(error);
        });
    });
}

// 启动测试服务器
async function startTestServer(port) {
    const isPortOccupied = await checkPort(port);

    if (isPortOccupied) {
        logWarning(`端口 ${port} 被占用，正在释放...`);
        await releasePort(port);
    }

    return new Promise((resolve, reject) => {
        const testServer = require('./test-server.js');
        const server = testServer.createServer(port);

        server.listen(port, () => {
            logSuccess(`测试服务器已启动在端口 ${port}`);
            resolve(server);
        });

        server.on('error', (error) => {
            logError(`启动测试服务器失败: ${error.message}`);
            reject(error);
        });
    });
}


// 主函数
async function main() {
    console.log(`${colors.bright}${colors.cyan}🚀 启动 User Behavior Analysis 演示环境${colors.reset}\n`);

    const servers = [];
    const processes = [];

    try {
        // 启动演示服务器
        const demoServer = await startServer(8080, '演示');
        servers.push(demoServer);

        // 启动测试服务器
        const testServer = await startTestServer(5005);
        servers.push(testServer);


        // 等待一下让服务器完全启动
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 打开浏览器
        const open = require('open');
        try {
            await open('http://localhost:8080/demo/demo.html');
            logSuccess('浏览器已自动打开演示页面');
        } catch (error) {
            logWarning('无法自动打开浏览器，请手动访问: http://localhost:8080/demo/demo.html');
        }

        console.log(`\n${colors.bright}${colors.green}✅ 演示环境启动完成！${colors.reset}`);
        console.log(`\n${colors.cyan}📋 可用服务:${colors.reset}`);
        console.log(`   🌐 演示页面: ${colors.yellow}http://localhost:8080/demo/demo.html${colors.reset}`);
        console.log(`   📡 测试服务器: ${colors.yellow}http://localhost:5005${colors.reset}`);
        console.log(`\n${colors.cyan}💡 使用说明:${colors.reset}`);
        console.log(`   1. 在演示页面中点击"开始追踪"按钮`);
        console.log(`   2. 在页面上进行各种交互操作`);
        console.log(`   3. 观察实时统计和日志输出`);
        console.log(`   4. 点击"显示结果"查看完整数据`);
        console.log(`   5. 查看测试服务器接收到的数据`);
        console.log(`\n${colors.yellow}按 Ctrl+C 停止所有服务${colors.reset}\n`);

        // 处理退出信号
        process.on('SIGINT', async() => {
            console.log(`\n${colors.yellow}正在停止所有服务...${colors.reset}`);

            // 停止所有服务器
            for (const server of servers) {
                server.close();
            }

            // 停止所有进程
            for (const proc of processes) {
                proc.kill('SIGTERM');
            }

            logSuccess('所有服务已停止');
            process.exit(0);
        });

    } catch (error) {
        logError(`启动演示环境失败: ${error.message}`);
        process.exit(1);
    }
}

// 运行主函数
main();