'use client';

import { useState, useEffect } from 'react';

interface TrackRecord {
  id: string;
  timestamp: string;
  data: any;
  userAgent?: string;
  ip?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    records: TrackRecord[];
    pagination: PaginationInfo;
  };
  timestamp: string;
}

export default function TracksPage() {
  const [records, setRecords] = useState<TrackRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(100);

  const fetchRecords = async (page: number = 1, limitCount: number = 100) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tracks?page=${page}&limit=${limitCount}`);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setRecords(data.data.records);
        setPagination(data.data.pagination);
      } else {
        setError('获取数据失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('获取记录失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      const response = await fetch('/api/tracks', { method: 'DELETE' });
      const data = await response.json();
      
      if (data.success) {
        alert('缓存已清除');
        fetchRecords(1, limit);
      } else {
        alert('清除缓存失败: ' + data.message);
      }
    } catch (err) {
      alert('清除缓存失败');
      console.error('清除缓存失败:', err);
    }
  };

  useEffect(() => {
    fetchRecords(currentPage, limit);
  }, [currentPage, limit]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">埋点记录</h1>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">每页显示:</label>
                <select 
                  value={limit} 
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <button
                onClick={clearCache}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                清除缓存
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {pagination && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
              总计 {pagination.totalRecords} 条记录，第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
            </div>
          )}

          {records.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无埋点记录</p>
              <p className="text-sm text-gray-400 mt-2">请先通过 /api/track 接口发送一些数据</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">ID: {record.id}</span>
                    <span className="text-sm text-gray-500">{formatTimestamp(record.timestamp)}</span>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 mb-1">数据内容:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(record.data, null, 2)}
                    </pre>
                  </div>
                  
                  {record.userAgent && (
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-700 text-sm">User Agent:</h4>
                      <p className="text-sm text-gray-600 break-all">{record.userAgent}</p>
                    </div>
                  )}
                  
                  {record.ip && (
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm">IP地址:</h4>
                      <p className="text-sm text-gray-600">{record.ip}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一页
              </button>
              
              <span className="px-4 py-2 text-gray-600">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
