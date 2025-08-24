import { NextRequest, NextResponse } from 'next/server';
import { trackCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 获取用户代理和IP信息
    const userAgent = request.headers.get('user-agent') || undefined;
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.ip || 
               undefined;
    
    // 将记录添加到缓存
    trackCache.addRecord(body, userAgent, ip);
    
    // 记录接收到的用户行为数据
    console.log('收到用户行为数据:', JSON.stringify(body, null, 2));
    console.log(`当前缓存记录数: ${trackCache.getRecordCount()}`);
    
    // 模拟数据处理延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '数据接收成功',
      timestamp: new Date().toISOString(),
      data: body
    });
    
  } catch (error) {
    console.error('处理用户行为数据时出错:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '数据处理失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '用户行为追踪API',
    status: 'running',
    timestamp: new Date().toISOString(),
    cacheInfo: {
      recordCount: trackCache.getRecordCount()
    }
  });
}
