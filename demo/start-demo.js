#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🚀 启动用户行为分析演示环境...\n');

// 创建 Node.js HTTP 服务器
function createDemoServer() {
    const server = http.createServer((req, res) => {
        // 设置 CORS 头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        let filePath = req.url;

        // 默认提供 demo.html
        if (filePath === '/' || filePath === '/demo') {
            filePath = '/demo/demo.html';
        }

        // 构建完整的文件路径
        const fullPath = path.join(process.cwd(), filePath);

        // 检查文件是否存在
        fs.access(fullPath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - 文件未找到');
                return;
            }

            // 根据文件扩展名设置 Content-Type
            const ext = path.extname(fullPath);
            let contentType = 'text/plain';

            switch (ext) {
                case '.html':
                    contentType = 'text/html';
                    break;
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
            }

            // 读取并返回文件
            fs.readFile(fullPath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 - 服务器内部错误');
                    return;
                }

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        });
    });

    return server;
}

// 检查并释放端口
async function checkAndFreePorts() {
    console.log('🔍 检查端口占用情况...');

    const ports = [5005, 8080];
    const processes = [];

    for (const port of ports) {
        try {
            const result = await new Promise((resolve) => {
                exec(`lsof -i :${port} -t`, (error, stdout) => {
                    if (stdout.trim()) {
                        resolve(stdout.trim().split('\n'));
                    } else {
                        resolve([]);
                    }
                });
            });

            if (result.length > 0) {
                console.log(`⚠️  端口 ${port} 被占用，正在释放...`);
                for (const pid of result) {
                    try {
                        await new Promise((resolve) => {
                            exec(`kill -9 ${pid}`, () => resolve());
                        });
                    } catch (e) {
                        // 忽略错误
                    }
                }
                console.log(`✅ 端口 ${port} 已释放`);
            } else {
                console.log(`✅ 端口 ${port} 可用`);
            }
        } catch (e) {
            // 忽略错误
        }
    }

    // 等待端口完全释放
    await new Promise(resolve => setTimeout(resolve, 1000));
}

// 启动服务
async function startServices() {
    // 检查并释放端口
    await checkAndFreePorts();

    // 启动测试服务器
    console.log('\n📡 启动测试服务器 (端口: 5005)...');
    const testServer = spawn('node', ['demo/test-server.js'], {
        stdio: 'inherit',
        detached: false
    });

    // 启动演示服务器 (纯 Node.js)
    console.log('🌐 启动演示服务器 (端口: 8080)...');
    const demoServer = createDemoServer();
    demoServer.listen(8080, () => {
        console.log('✅ 演示服务器启动成功 (Node.js)');
    });

    // 等待服务启动
    setTimeout(() => {
        console.log('\n✅ 服务启动完成！');
        console.log('📋 访问地址:');
        console.log('  演示页面: http://localhost:8080/demo/demo.html');
        console.log('  测试服务器: http://localhost:5005');
        console.log('\n💡 使用说明:');
        console.log('  1. 在浏览器中打开演示页面');
        console.log('  2. 点击"开始追踪"按钮');
        console.log('  3. 在页面上进行各种交互操作');
        console.log('  4. 观察测试服务器接收到的数据');
        console.log('\n🛑 按 Ctrl+C 停止所有服务\n');

        // 自动打开浏览器
        console.log('🌐 正在打开演示页面...');
        const openBrowser = spawn('open', ['http://localhost:8080/demo/demo.html'], {
            stdio: 'inherit',
            detached: false
        });

        openBrowser.on('error', () => {
            console.log('💡 请手动在浏览器中访问: http://localhost:8080/demo/demo.html');
        });
    }, 2000);

    // 优雅关闭
    process.on('SIGINT', () => {
        console.log('\n🛑 正在停止服务...');
        testServer.kill();
        demoServer.close();
        process.exit(0);
    });

    // 错误处理
    testServer.on('error', (error) => {
        console.error('❌ 测试服务器启动失败:', error.message);
    });

    demoServer.on('error', (error) => {
        console.error('❌ 演示服务器启动失败:', error.message);
    });
}

// 启动服务
startServices().catch(console.error);