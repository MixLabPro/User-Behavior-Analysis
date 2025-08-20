/// <reference path="../userBehaviour.ts" />

declare const userBehaviour: {
    config: (config: any) => void;
    start: () => void;
    stop: () => void;
    showResult: () => any;
    processResults: () => void;
    registerCustomEvent: (eventName: string, callback: EventListener) => void;
    showConfig: () => any;
};

/**
 * Web 用户行为追踪库使用示例
 * 
 * 这个文件展示了如何使用 userBehaviour 库来追踪用户在网页上的各种行为
 */

/**
 * 基础使用示例
 * 使用默认配置开始追踪
 */
function basicExample(): void {
    console.log('=== 基础使用示例 ===');
    
    // 直接使用默认配置开始追踪
    userBehaviour.start();
    
    // 5秒后停止追踪
    setTimeout(() => {
        userBehaviour.stop();
        console.log('基础追踪已停止');
    }, 5000);
}

/**
 * 自定义配置示例
 * 展示如何配置各种追踪选项
 */
function customConfigExample(): void {
    console.log('=== 自定义配置示例 ===');
    
    // 自定义配置
    const config: any = {
        // 基础追踪选项
        userInfo: true,                    // 收集用户信息
        clicks: true,                      // 追踪点击事件
        mouseMovement: true,               // 追踪鼠标移动
        mouseMovementInterval: 0.5,        // 鼠标移动记录间隔（0.5秒）
        mouseScroll: true,                 // 追踪滚动事件
        keyboardActivity: true,            // 追踪键盘活动
        
        // 时间和处理选项
        timeCount: true,                   // 启用时间计数
        processTime: 10,                   // 每10秒处理一次数据
        clearAfterProcess: false,          // 处理后不清除数据
        
        // 窗口和页面选项
        windowResize: true,                // 追踪窗口大小变化
        visibilitychange: true,            // 追踪页面可见性变化
        pageNavigation: true,              // 追踪页面导航
        
        // 交互选项
        formInteractions: true,            // 追踪表单交互
        touchEvents: true,                 // 追踪触摸事件（移动设备）
        audioVideoInteraction: true,       // 追踪音视频交互
        
        // 新增：自动发送事件配置
        autoSendEvents: true,              // 启用自动发送
        sendUrl: 'http://127.0.0.1:3000/get', // 后台接收URL
        
        // 自定义数据处理函数
        processData: (results: any) => {
            console.log('📊 用户行为数据:', results);
            
            // 可以在这里发送数据到服务器
            // sendDataToServer(results);
            
            // 或者存储到本地存储
            // localStorage.setItem('userBehaviour', JSON.stringify(results));
        }
    };
    
    // 应用配置并开始追踪
    userBehaviour.config(config);
    userBehaviour.start();
    
    console.log('当前配置:', userBehaviour.showConfig());
}

/**
 * NextJS 后端集成示例
 * 展示如何与 NextJS 后端集成
 */
function nextjsIntegrationExample(): void {
    console.log('=== NextJS 后端集成示例 ===');
    
    const config: any = {
        // 基础追踪配置
        clicks: true,
        mouseMovement: true,
        keyboardActivity: true,
        mouseScroll: true,
        
        // 自动发送到 NextJS 后端
        autoSendEvents: true,
        sendUrl: 'http://localhost:3000/api/collect',
        processTime: 5, // 每5秒发送一次数据
        
        // 数据处理回调
        processData: (results: any) => {
            console.log('🚀 数据已发送到 NextJS 后端');
            console.log('📊 发送的数据摘要:');
            console.log(`   - 点击次数: ${results.clicks?.clickCount || 0}`);
            console.log(`   - 鼠标移动: ${results.mouseMovements?.length || 0} 次`);
            console.log(`   - 键盘活动: ${results.keyboardActivities?.length || 0} 次`);
        }
    };
    
    userBehaviour.config(config);
    userBehaviour.start();
    
    console.log('✅ NextJS 后端集成已启动');
    console.log('📡 数据将发送到: http://localhost:3000/api/collect');
    console.log('⏰ 发送间隔: 5秒');
}

/**
 * 数据分析示例
 * 展示如何分析收集到的用户行为数据
 */
function dataAnalysisExample(): void {
    console.log('=== 数据分析示例 ===');
    
    const config: any = {
        processTime: 5, // 每5秒处理一次数据
        clearAfterProcess: false, // 保留数据用于分析
        processData: (results: any) => {
            analyzeUserBehaviour(results);
        }
    };
    
    userBehaviour.config(config);
    userBehaviour.start();
}

/**
 * 分析用户行为数据
 * @param results 追踪结果数据
 */
function analyzeUserBehaviour(results: any): void {
    console.log('🔍 开始分析用户行为数据...');
    
    // 分析点击行为
    if (results.clicks) {
        console.log(`总点击次数: ${results.clicks.clickCount}`);
        console.log(`平均每分钟点击次数: ${calculateClicksPerMinute(results)}`);
        
        // 分析最常点击的元素
        const clickTargets = results.clicks.clickDetails.map((click: any) => click[2]); // DOM路径
        const targetCounts = countOccurrences(clickTargets);
        console.log('最常点击的元素:', targetCounts);
    }
    
    // 分析鼠标移动
    if (results.mouseMovements && results.mouseMovements.length > 0) {
        const totalDistance = calculateMouseDistance(results.mouseMovements);
        console.log(`鼠标移动总距离: ${totalDistance.toFixed(2)}px`);
        console.log(`鼠标移动点数: ${results.mouseMovements.length}`);
    }
    
    // 分析滚动行为
    if (results.mouseScroll && results.mouseScroll.length > 0) {
        const scrollStats = analyzeScrollBehaviour(results.mouseScroll);
        console.log('滚动行为分析:', scrollStats);
    }
    
    // 分析键盘活动
    if (results.keyboardActivities && results.keyboardActivities.length > 0) {
        const keyStats = analyzeKeyboardActivity(results.keyboardActivities);
        console.log('键盘活动分析:', keyStats);
    }
    
    // 分析用户活跃度
    const activityLevel = calculateActivityLevel(results);
    console.log(`用户活跃度评分: ${activityLevel}/10`);
}

/**
 * 计算每分钟点击次数
 */
function calculateClicksPerMinute(results: any): number {
    if (!results.time || !results.clicks) return 0;
    
    const timeSpan = (results.time.currentTime - results.time.startTime) / 1000 / 60; // 转换为分钟
    return timeSpan > 0 ? results.clicks.clickCount / timeSpan : 0;
}

/**
 * 计算鼠标移动总距离
 */
function calculateMouseDistance(movements: Array<[number, number, number]>): number {
    let totalDistance = 0;
    
    for (let i = 1; i < movements.length; i++) {
        const prev = movements[i - 1];
        const curr = movements[i];
        
        const dx = curr[0] - prev[0];
        const dy = curr[1] - prev[1];
        totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    
    return totalDistance;
}

/**
 * 分析滚动行为
 */
function analyzeScrollBehaviour(scrollData: Array<[number, number, number]>): any {
    if (scrollData.length === 0) return {};
    
    const scrollDistances = [];
    for (let i = 1; i < scrollData.length; i++) {
        const prev = scrollData[i - 1];
        const curr = scrollData[i];
        scrollDistances.push(Math.abs(curr[1] - prev[1])); // 垂直滚动距离
    }
    
    return {
        totalScrollEvents: scrollData.length,
        averageScrollDistance: scrollDistances.reduce((a, b) => a + b, 0) / scrollDistances.length,
        maxScrollPosition: Math.max(...scrollData.map(s => s[1])),
        minScrollPosition: Math.min(...scrollData.map(s => s[1]))
    };
}

/**
 * 分析键盘活动
 */
function analyzeKeyboardActivity(keyboardData: Array<[string, number]>): any {
    const keys = keyboardData.map(k => k[0]);
    const keyCounts = countOccurrences(keys);
    
    return {
        totalKeyPresses: keyboardData.length,
        uniqueKeys: Object.keys(keyCounts).length,
        mostUsedKeys: Object.entries(keyCounts)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5)
    };
}

/**
 * 计算用户活跃度评分
 */
function calculateActivityLevel(results: any): number {
    let score = 0;
    
    // 基于不同行为类型计算分数
    if (results.clicks && results.clicks.clickCount > 0) score += 2;
    if (results.mouseMovements && results.mouseMovements.length > 10) score += 2;
    if (results.mouseScroll && results.mouseScroll.length > 0) score += 1;
    if (results.keyboardActivities && results.keyboardActivities.length > 0) score += 3;
    if (results.formInteractions && results.formInteractions.length > 0) score += 2;
    
    return Math.min(score, 10);
}

/**
 * 统计数组元素出现次数
 */
function countOccurrences(arr: string[]): Record<string, number> {
    return arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

/**
 * 实时监控示例
 * 展示如何实时监控用户行为
 */
function realTimeMonitoringExample(): void {
    console.log('=== 实时监控示例 ===');
    
    const config: any = {
        processTime: 2, // 每2秒处理一次
        clearAfterProcess: true, // 处理后清除数据，避免内存累积
        processData: (results: any) => {
            // 实时显示用户行为摘要
            console.log(`⏰ ${new Date().toLocaleTimeString()} - 用户行为摘要:`);
            console.log(`  点击次数: ${results.clicks?.clickCount || 0}`);
            console.log(`  鼠标移动: ${results.mouseMovements?.length || 0} 次`);
            console.log(`  滚动事件: ${results.mouseScroll?.length || 0} 次`);
            console.log(`  键盘活动: ${results.keyboardActivities?.length || 0} 次`);
            console.log('---');
        }
    };
    
    userBehaviour.config(config);
    userBehaviour.start();
}

/**
 * 自定义事件示例
 * 展示如何注册和追踪自定义事件
 */
function customEventExample(): void {
    console.log('=== 自定义事件示例 ===');
    
    // 注册自定义事件监听器
    userBehaviour.registerCustomEvent('userAction', (event: Event) => {
        console.log('检测到自定义用户行为:', (event as CustomEvent).detail);
    });
    
    // 模拟触发自定义事件
    setTimeout(() => {
        const customEvent = new CustomEvent('userAction', {
            detail: { action: 'button_hover', target: 'main-cta-button' }
        });
        window.dispatchEvent(customEvent);
    }, 3000);
    
    userBehaviour.start();
}

/**
 * 主函数 - 运行所有示例
 */
function runExamples(): void {
    console.log('🚀 Web 用户行为追踪库示例');
    console.log('================================');
    
    // 可以选择运行不同的示例
    // basicExample();
    // customConfigExample();
    // dataAnalysisExample();
    realTimeMonitoringExample();
    // customEventExample();
    
    // 10秒后停止所有追踪
    setTimeout(() => {
        userBehaviour.stop();
        console.log('✅ 所有示例已完成');
    }, 10000);
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runExamples);
    } else {
        runExamples();
    }
}

// Node.js环境导出
export {
    basicExample,
    customConfigExample,
    dataAnalysisExample,
    realTimeMonitoringExample,
    customEventExample,
    runExamples
};

/**
 * 导出所有示例函数，方便在演示页面中调用
 */
(window as any).userBehaviourExamples = {
    basicExample,
    customConfigExample,
    nextjsIntegrationExample,
    dataAnalysisExample,
    realTimeMonitoringExample,
    customEventExample,
    analyzeUserBehaviour,
    calculateClicksPerMinute,
    calculateMouseDistance,
    analyzeScrollBehaviour,
    analyzeKeyboardActivity,
    calculateActivityLevel
};

// 在控制台中可以直接调用这些函数
console.log('🎯 可用的示例函数:');
console.log('  - userBehaviourExamples.basicExample()');
console.log('  - userBehaviourExamples.customConfigExample()');
console.log('  - userBehaviourExamples.nextjsIntegrationExample()');
console.log('  - userBehaviourExamples.dataAnalysisExample()');
console.log('  - userBehaviourExamples.realTimeMonitoringExample()');
console.log('  - userBehaviourExamples.customEventExample()');
