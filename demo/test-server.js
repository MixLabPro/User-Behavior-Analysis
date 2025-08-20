const http = require('http');
const url = require('url');

// 控制台颜色代码
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m'
};

// 美化输出函数
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

function logData(title, data) {
    console.log(`\n${colors.bgCyan}${colors.white}${colors.bright} 📊 ${title} ${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    if (typeof data === 'object') {
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log(data);
    }

    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function logRequestInfo(method, url, headers) {
    console.log(`\n${colors.bgBlue}${colors.white}${colors.bright} 🌐 请求信息 ${colors.reset}`);
    console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.cyan}方法:${colors.reset} ${colors.yellow}${method}${colors.reset}`);
    console.log(`${colors.cyan}URL:${colors.reset} ${colors.yellow}${url}${colors.reset}`);
    console.log(`${colors.cyan}时间:${colors.reset} ${colors.yellow}${new Date().toLocaleString()}${colors.reset}`);
    console.log(`${colors.cyan}User-Agent:${colors.reset} ${colors.dim}${headers['user-agent'] || '未知'}${colors.reset}`);
    console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
}

// 创建服务器的函数
function createServer(port = 5005) {
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);

        // 设置CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            // 处理预检请求
            res.writeHead(200);
            res.end();
            return;
        }

        if (parsedUrl.pathname === '/get') {
            let requestData = {};

            // 记录请求信息
            logRequestInfo(req.method, req.url, req.headers);

            if (req.method === 'GET') {
                // 处理GET请求 - 从查询参数获取数据
                requestData = parsedUrl.query;
                logData('收到用户行为数据 (GET)', requestData);
                logSuccess('GET请求处理完成');

            } else if (req.method === 'POST') {
                // 处理POST请求 - 从请求体获取数据
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        requestData = JSON.parse(body);
                        logData('收到用户行为数据 (POST)', requestData);
                        logSuccess('POST请求处理完成');
                    } catch (e) {
                        requestData = { rawBody: body };
                        logWarning('JSON解析失败，使用原始数据');
                        logData('原始请求数据', requestData);
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 'success',
                        message: '数据接收成功',
                        method: 'POST',
                        receivedData: requestData
                    }));
                });
                return; // 提前返回，避免重复响应
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'success',
                message: '数据接收成功',
                method: 'GET',
                receivedData: requestData
            }));
        } else {
            logError(`404 - 路径未找到: ${parsedUrl.pathname}`);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });

    return server;
}

// 导出 createServer 函数
module.exports = { createServer };

// 如果直接运行此文件，则启动服务器
if (require.main === module) {
    const server = createServer();
    server.listen(5005, () => {
        console.log(`\n${colors.bgGreen}${colors.white}${colors.bright} 🚀 测试服务器启动成功 ${colors.reset}`);
        console.log(`${colors.green}${'='.repeat(60)}${colors.reset}`);
        logSuccess(`服务器运行在: ${colors.yellow}http://localhost:5005${colors.reset}`);
        logInfo('等待接收用户行为数据...');
        logInfo('在demo中配置 autoSendEvents: true 和 sendUrl: "http://localhost:5005/get" 来测试数据发送');
        console.log(`${colors.green}${'='.repeat(60)}${colors.reset}\n`);
    });
}