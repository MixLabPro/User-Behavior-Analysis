interface TrackRecord {
  id: string;
  timestamp: string;
  data: any;
  userAgent?: string;
  ip?: string;
}

class TrackCache {
  private records: TrackRecord[] = [];
  private maxRecords = 1000;

  addRecord(data: any, userAgent?: string, ip?: string): void {
    const record: TrackRecord = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      data,
      userAgent,
      ip
    };

    this.records.unshift(record); // 添加到开头

    // 保持最大记录数限制
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(0, this.maxRecords);
    }
  }

  getRecentRecords(limit: number = 100): TrackRecord[] {
    return this.records.slice(0, limit);
  }

  getRecordCount(): number {
    return this.records.length;
  }

  clearRecords(): void {
    this.records = [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// 创建全局缓存实例
export const trackCache = new TrackCache();
