const http = require('http');
const url = require('url');

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

        if (req.method === 'GET') {
            // 处理GET请求 - 从查询参数获取数据
            requestData = parsedUrl.query;
        } else if (req.method === 'POST') {
            // 处理POST请求 - 从请求体获取数据
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    requestData = JSON.parse(body);
                } catch (e) {
                    requestData = { rawBody: body };
                }

                console.log('📊 收到用户行为数据 (POST):');
                console.log(JSON.stringify(requestData, null, 2));

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

        console.log('📊 收到用户行为数据 (GET):');
        console.log(JSON.stringify(requestData, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'success',
            message: '数据接收成功',
            method: 'GET',
            receivedData: requestData
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 5005;
server.listen(PORT, () => {
    console.log(`🚀 测试服务器运行在 http://localhost:${PORT}`);
    console.log('📡 等待接收用户行为数据...');
    console.log('💡 在demo中配置 autoSendEvents: true 和 sendUrl: "http://localhost:5005/get" 来测试数据发送');
});