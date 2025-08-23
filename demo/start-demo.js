#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// MIME 类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

console.log('🎯 用户行为分析 Demo 启动器');
console.log('================================');

// 检查并构建项目
console.log('🔨 构建项目...');
exec('npm run build', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ 构建失败:', error.message);
        process.exit(1);
    }
    
    if (stderr) {
        console.log('构建警告:', stderr);
    }
    
    console.log('✅ 构建完成');
    console.log('');
    
    // 启动服务器
    startServer();
});

function startServer() {
    const PORT = 8080;
    const demoDir = __dirname;
    
    const server = http.createServer((req, res) => {
        // 解析请求的文件路径
        let filePath = path.join(demoDir, req.url === '/' ? '/index.html' : req.url);
        
        // 安全检查，防止目录遍历攻击
        if (!filePath.startsWith(demoDir)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        
        // 检查文件是否存在
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // 如果是请求 dist 目录下的文件，尝试从上级目录查找
                if (req.url.startsWith('/dist/')) {
                    filePath = path.join(demoDir, '..', req.url);
                    fs.access(filePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            serve404(res);
                        } else {
                            serveFile(filePath, res);
                        }
                    });
                } else {
                    serve404(res);
                }
            } else {
                serveFile(filePath, res);
            }
        });
    });
    
    function serveFile(filePath, res) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
    
    function serve404(res) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - 页面未找到</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #e74c3c; }
                    a { color: #3498db; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>404 - 页面未找到</h1>
                <p>请求的页面不存在</p>
                <a href="/">返回首页</a>
            </body>
            </html>
        `);
    }
    
    server.listen(PORT, () => {
        console.log('🚀 Demo 服务器已启动');
        console.log(`📂 服务目录: ${demoDir}`);
        console.log(`🌐 访问地址: http://localhost:${PORT}`);
        console.log('');
        console.log('📋 可用的演示页面:');
        console.log(`   • http://localhost:${PORT}/index.html - 演示中心`);
        console.log(`   • http://localhost:${PORT}/comprehensive-demo.html - 综合演示`);
        console.log(`   • http://localhost:${PORT}/demo.html - 基础追踪演示`);
        console.log(`   • http://localhost:${PORT}/player-demo.html - 行为回放演示`);
        console.log('');
        console.log('💡 提示: 按 Ctrl+C 停止服务器');
        console.log('================================');
        console.log('');
        
        // 尝试自动打开浏览器
        const url = `http://localhost:${PORT}/index.html`;
        const start = process.platform === 'darwin' ? 'open' :
                     process.platform === 'win32' ? 'start' : 'xdg-open';
        
        exec(`${start} ${url}`, (error) => {
            if (error) {
                console.log(`请手动打开浏览器访问: ${url}`);
            }
        });
    });
    
    // 优雅关闭
    process.on('SIGINT', () => {
        console.log('\n🛑 正在关闭服务器...');
        server.close(() => {
            console.log('✅ 服务器已关闭');
            process.exit(0);
        });
    });
}