import { NextRequest, NextResponse } from 'next/server';
import { trackCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    
    // 验证参数
    const validLimit = Math.min(Math.max(limit, 1), 1000); // 限制最大1000条
    const validPage = Math.max(page, 1);
    
    // 获取所有记录
    const allRecords = trackCache.getRecentRecords();
    
    // 计算分页
    const startIndex = (validPage - 1) * validLimit;
    const endIndex = startIndex + validLimit;
    const records = allRecords.slice(startIndex, endIndex);
    
    // 计算分页信息
    const totalRecords = allRecords.length;
    const totalPages = Math.ceil(totalRecords / validLimit);
    
    return NextResponse.json({
      success: true,
      data: {
        records,
        pagination: {
          currentPage: validPage,
          totalPages,
          totalRecords,
          limit: validLimit,
          hasNextPage: validPage < totalPages,
          hasPrevPage: validPage > 1
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取埋点记录时出错:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '获取记录失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// 添加一个清除缓存的接口（仅用于开发调试）
export async function DELETE(request: NextRequest) {
  try {
    // 在生产环境中，你可能需要添加认证
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          message: '生产环境中不允许清除缓存'
        },
        { status: 403 }
      );
    }
    
    trackCache.clearRecords();
    
    return NextResponse.json({
      success: true,
      message: '缓存已清除',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('清除缓存时出错:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '清除缓存失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
