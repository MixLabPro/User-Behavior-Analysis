/**
 * 用户行为数据聚合器 (TypeScript版本)
 * 将后端收集的单个事件数据整理成与 userBehaviour.showResult() 相同的数据结构
 */

// 类型定义
interface ElementSummary {
    tagName: string;
    id: string;
    className: string;
    name: string;
    value: string;
    textContent: string;
}

interface UserInfo {
    windowSize: [number, number];
    appCodeName: string;
    appName: string;
    vendor: string;
    platform: string;
    userAgent: string;
}

interface TimeInfo {
    startTime: string;
    currentTime: string;
    stopTime: string;
}

interface ClickInfo {
    clickCount: number;
    clickDetails: [number, number, ElementSummary, string][];
}

interface TrackingResults {
    userInfo: UserInfo | null;
    time: TimeInfo;
    clicks: ClickInfo;
    mouseMovements: [number, number, string][];
    mouseScroll: [number, number, string][];
    keyboardActivities: [string, ElementSummary, string][];
    navigationHistory: [string, string][];
    formInteractions: [ElementSummary, string][];
    touchEvents: [string, number, number, ElementSummary, string][];
    mediaInteractions: [string, string, string][];
    windowSizes: [number, number, string][];
    visibilitychanges: [DocumentVisibilityState, string][];
}

interface EventData {
    type: string;
    data: any;
    timestamp: string;
    url: string;
    userInfo: UserInfo;
}

interface SessionStats {
    sessionDuration: number;
    sessionDurationFormatted: string;
    totalEvents: number;
    clickCount: number;
    mouseMovementCount: number;
    scrollCount: number;
    keyboardActivityCount: number;
}

interface ProcessOptions {
    includeStats?: boolean;
    cleanData?: boolean;
}

interface ProcessResult {
    sessionId: string;
    data: TrackingResults;
    processedAt: string;
    eventCount: number;
    stats?: SessionStats;
}

/**
 * 聚合用户行为数据
 * @param events - 事件数据数组，每个事件包含 {type, data, timestamp, url, userInfo}
 * @param sessionId - 会话ID
 * @returns 聚合后的用户行为数据，格式与 userBehaviour.showResult() 相同
 */
export function aggregateUserBehaviorData(events: EventData[], sessionId: string): TrackingResults {
    // 初始化结果结构
    const result: TrackingResults = {
        userInfo: null,
        time: {
            startTime: '',
            currentTime: '',
            stopTime: ''
        },
        clicks: {
            clickCount: 0,
            clickDetails: []
        },
        mouseMovements: [],
        mouseScroll: [],
        keyboardActivities: [],
        navigationHistory: [],
        formInteractions: [],
        touchEvents: [],
        mediaInteractions: [],
        windowSizes: [],
        visibilitychanges: []
    };

    // 如果没有事件数据，返回空结构
    if (!events || events.length === 0) {
        return result;
    }

    // 按时间戳排序事件
    const sortedEvents = [...events].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // 获取时间范围
    const timestamps = sortedEvents.map(e => new Date(e.timestamp));
    result.time.startTime = formatTimestamp(new Date(Math.min(...timestamps.map(t => t.getTime()))));
    result.time.currentTime = formatTimestamp(new Date());
    result.time.stopTime = formatTimestamp(new Date(Math.max(...timestamps.map(t => t.getTime()))));

    // 设置用户信息（取最新的）
    const latestEvent = sortedEvents[sortedEvents.length - 1];
    if (latestEvent && latestEvent.userInfo) {
        result.userInfo = latestEvent.userInfo;
    }

    // 按事件类型分类数据
    sortedEvents.forEach(event => {
        if (!event.type || !event.data) {
            return; // 跳过无效事件
        }

        switch (event.type) {
            case 'click':
                result.clicks.clickCount++;
                result.clicks.clickDetails.push(event.data);
                break;
            
            case 'mouseMovement':
                result.mouseMovements.push(event.data);
                break;
            
            case 'scroll':
                result.mouseScroll.push(event.data);
                break;
            
            case 'keyboardActivity':
            case 'inputActivity':
                result.keyboardActivities.push(event.data);
                break;
            
            case 'pageNavigation':
                result.navigationHistory.push(event.data);
                break;
            
            case 'formInteraction':
                result.formInteractions.push(event.data);
                break;
            
            case 'touchStart':
                result.touchEvents.push(event.data);
                break;
            
            case 'mediaInteraction':
                result.mediaInteractions.push(event.data);
                break;
            
            case 'windowResize':
                result.windowSizes.push(event.data);
                break;
            
            case 'visibilitychange':
                result.visibilitychanges.push(event.data);
                break;
            
            default:
                console.warn(`Unknown event type: ${event.type}`);
                break;
        }
    });

    return result;
}

/**
 * 格式化时间戳为字符串格式 (YYYY-MM-DD HH:mm:ss)
 * @param date - 日期对象
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 验证事件数据格式
 * @param event - 单个事件数据
 * @returns 是否为有效的事件数据
 */
export function validateEventData(event: any): event is EventData {
    if (!event || typeof event !== 'object') {
        return false;
    }

    // 必需字段检查
    const requiredFields = ['type', 'data', 'timestamp'];
    for (const field of requiredFields) {
        if (!(field in event)) {
            return false;
        }
    }

    // 时间戳格式检查
    const timestamp = new Date(event.timestamp);
    if (isNaN(timestamp.getTime())) {
        return false;
    }

    return true;
}

/**
 * 过滤和清理事件数据
 * @param events - 原始事件数据数组
 * @returns 清理后的事件数据数组
 */
export function cleanEventData(events: any[]): EventData[] {
    if (!Array.isArray(events)) {
        return [];
    }

    return events.filter((event): event is EventData => {
        // 验证事件数据格式
        if (!validateEventData(event)) {
            console.warn('Invalid event data:', event);
            return false;
        }

        return true;
    });
}

/**
 * 获取会话统计信息
 * @param aggregatedData - 聚合后的用户行为数据
 * @returns 会话统计信息
 */
export function getSessionStats(aggregatedData: TrackingResults): SessionStats | undefined {
    if (!aggregatedData) {
        return undefined;
    }

    const startTime = new Date(aggregatedData.time.startTime);
    const stopTime = new Date(aggregatedData.time.stopTime);
    const duration = stopTime.getTime() - startTime.getTime();

    return {
        sessionDuration: Math.max(0, duration), // 毫秒
        sessionDurationFormatted: formatDuration(duration),
        totalEvents: (
            aggregatedData.clicks.clickCount +
            aggregatedData.mouseMovements.length +
            aggregatedData.mouseScroll.length +
            aggregatedData.keyboardActivities.length +
            aggregatedData.navigationHistory.length +
            aggregatedData.formInteractions.length +
            aggregatedData.touchEvents.length +
            aggregatedData.mediaInteractions.length +
            aggregatedData.windowSizes.length +
            aggregatedData.visibilitychanges.length
        ),
        clickCount: aggregatedData.clicks.clickCount,
        mouseMovementCount: aggregatedData.mouseMovements.length,
        scrollCount: aggregatedData.mouseScroll.length,
        keyboardActivityCount: aggregatedData.keyboardActivities.length
    };
}

/**
 * 格式化持续时间
 * @param duration - 持续时间（毫秒）
 * @returns 格式化后的持续时间字符串
 */
export function formatDuration(duration: number): string {
    if (duration < 0) {
        return '0秒';
    }

    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}小时${minutes % 60}分钟${seconds % 60}秒`;
    } else if (minutes > 0) {
        return `${minutes}分钟${seconds % 60}秒`;
    } else {
        return `${seconds}秒`;
    }
}

/**
 * 主要的聚合函数，包含数据清理和验证
 * @param events - 原始事件数据数组
 * @param sessionId - 会话ID
 * @param options - 可选配置
 * @returns 包含聚合数据和统计信息的对象
 */
export function processUserBehaviorData(
    events: any[], 
    sessionId: string, 
    options: ProcessOptions = {}
): ProcessResult {
    const {
        includeStats = false,
        cleanData = true
    } = options;

    // 清理数据（如果启用）
    const processedEvents = cleanData ? cleanEventData(events) : events as EventData[];

    // 聚合数据
    const aggregatedData = aggregateUserBehaviorData(processedEvents, sessionId);

    // 构建结果对象
    const result: ProcessResult = {
        sessionId,
        data: aggregatedData,
        processedAt: formatTimestamp(new Date()),
        eventCount: processedEvents.length
    };

    // 添加统计信息（如果需要）
    if (includeStats) {
        result.stats = getSessionStats(aggregatedData);
    }

    return result;
}

// 默认导出
export default {
    aggregateUserBehaviorData,
    processUserBehaviorData,
    cleanEventData,
    validateEventData,
    getSessionStats,
    formatTimestamp,
    formatDuration
};

// 类型导出
export type {
    ElementSummary,
    UserInfo,
    TimeInfo,
    ClickInfo,
    TrackingResults,
    EventData,
    SessionStats,
    ProcessOptions,
    ProcessResult
};