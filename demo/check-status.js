#!/usr/bin/env node

const http = require('http');
const { exec } = require('child_process');

console.log('🔍 检查服务状态...\n');

const services = [{
        name: '测试服务器',
        url: 'http://localhost:5005/get?test=status',
        port: 5005
    },
    {
        name: '演示服务器',
        url: 'http://localhost:8080/demo/demo.html',
        port: 8080
    }
];

async function checkService(service) {
    return new Promise((resolve) => {
        const req = http.get(service.url, (res) => {
            if (res.statusCode === 200) {
                resolve({ success: true, message: `${service.name} 运行正常` });
            } else {
                resolve({ success: false, message: `${service.name} 响应异常 (状态码: ${res.statusCode})` });
            }
        });

        req.on('error', () => {
            resolve({ success: false, message: `${service.name} 连接失败` });
        });

        req.setTimeout(3000, () => {
            req.destroy();
            resolve({ success: false, message: `${service.name} 连接超时` });
        });
    });
}

async function checkPortUsage(port) {
    return new Promise((resolve) => {
        exec(`lsof -i :${port}`, (error, stdout) => {
            if (stdout.trim()) {
                resolve({ inUse: true, processes: stdout.trim() });
            } else {
                resolve({ inUse: false, processes: '' });
            }
        });
    });
}

async function main() {
    console.log('📊 服务状态检查结果:\n');

    for (const service of services) {
        const status = await checkService(service);
        const portStatus = await checkPortUsage(service.port);

        if (status.success) {
            console.log(`✅ ${status.message}`);
        } else {
            console.log(`❌ ${status.message}`);
        }

        if (portStatus.inUse) {
            console.log(`   📡 端口 ${service.port} 正在被使用`);
        } else {
            console.log(`   📡 端口 ${service.port} 未被占用`);
        }
        console.log('');
    }

    console.log('💡 访问地址:');
    console.log('  演示页面: http://localhost:8080/demo/demo.html');
    console.log('  测试服务器: http://localhost:5005');
}

main().catch(console.error);