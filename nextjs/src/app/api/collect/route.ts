import { NextRequest, NextResponse } from 'next/server';

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
function logWithColor(color: string, message: string) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message: string) {
    logWithColor(colors.green, `✅ ${message}`);
}

function logInfo(message: string) {
    logWithColor(colors.blue, `ℹ️  ${message}`);
}

function logWarning(message: string) {
    logWithColor(colors.yellow, `⚠️  ${message}`);
}

function logError(message: string) {
    logWithColor(colors.red, `❌ ${message}`);
}

function logData(title: string, data: any) {
    console.log(`\n${colors.bgCyan}${colors.white}${colors.bright} 📊 ${title} ${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    if (typeof data === 'object') {
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log(data);
    }

    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function logRequestInfo(method: string, url: string, headers: any) {
    console.log(`\n${colors.bgBlue}${colors.white}${colors.bright} 🌐 请求信息 ${colors.reset}`);
    console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.cyan}方法:${colors.reset} ${colors.yellow}${method}${colors.reset}`);
    console.log(`${colors.cyan}URL:${colors.reset} ${colors.yellow}${url}${colors.reset}`);
    console.log(`${colors.cyan}时间:${colors.reset} ${colors.yellow}${new Date().toLocaleString()}${colors.reset}`);
    console.log(`${colors.cyan}User-Agent:${colors.reset} ${colors.dim}${headers['user-agent'] || '未知'}${colors.reset}`);
    console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const requestData = Object.fromEntries(searchParams.entries());

    // 记录请求信息
    logRequestInfo('GET', request.url, Object.fromEntries(request.headers.entries()));
    logData('收到用户行为数据 (GET)', requestData);
    logSuccess('GET请求处理完成');

    return NextResponse.json({
        status: 'success',
        message: '数据接收成功',
        method: 'GET',
        receivedData: requestData
    });
}

export async function POST(request: NextRequest) {
    try {
        // 记录请求信息
        logRequestInfo('POST', request.url, Object.fromEntries(request.headers.entries()));

        // 获取请求体数据
        const requestData = await request.json();
        
        logData('收到用户行为数据 (POST)', requestData);
        logSuccess('POST请求处理完成');

        return NextResponse.json({
            status: 'success',
            message: '数据接收成功',
            method: 'POST',
            receivedData: requestData
        });
    } catch (error) {
        logError(`处理POST请求时出错: ${error}`);
        
        // 尝试获取原始请求体
        const rawBody = await request.text();
        logWarning('JSON解析失败，使用原始数据');
        logData('原始请求数据', { rawBody });

        return NextResponse.json({
            status: 'error',
            message: '数据解析失败',
            method: 'POST',
            rawData: rawBody
        }, { status: 400 });
    }
}

export async function OPTIONS() {
    // 处理预检请求
    return new NextResponse(null, { status: 200 });
}
