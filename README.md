# User Behavior Analysis - TypeScript 版本

一个用于追踪和记录用户在网页上各种交互行为的 TypeScript 库。

## 🚀 快速开始

### 安装

```bash
npm install user-behavior-analysis
```

### 基础使用

```typescript
import userBehaviour from 'user-behavior-analysis';

// 配置并开始追踪
userBehaviour.config({
    clicks: true,
    mouseMovement: true,
    keyboardActivity: true,
    processData: (results) => {
        console.log('用户行为数据:', results);
    }
});

userBehaviour.start();
```

### 数据聚合器使用

```typescript
// 后端数据聚合
import { aggregateUserBehaviorData } from 'user-behavior-analysis/aggregator';

// 将后端收集的事件数据聚合成完整的用户行为数据
const events = [/* 从后端获取的事件数据 */];
const aggregatedData = aggregateUserBehaviorData(events, 'session-123');
```

### 行为播放器使用

```typescript
// 用户行为回放
import userBehaviourPlayer from 'user-behavior-analysis/player';

// 加载并播放用户行为数据
const trackingData = userBehaviour.showResult();
userBehaviourPlayer.load(trackingData, {
    playbackSpeed: 1.5,
    showMouseTrail: true,
    autoPlay: true
});
```

## ✨ 功能特性

### 核心追踪功能
- 🖱️ **鼠标行为追踪** - 移动轨迹、点击位置、滚动行为
- ⌨️ **键盘活动监控** - 按键记录、输入行为分析
- 📱 **触摸事件支持** - 移动设备触摸交互
- 📝 **表单交互追踪** - 表单提交、输入行为
- 🎵 **媒体交互监控** - 音视频播放行为
- 🔄 **页面状态监控** - 窗口大小、页面可见性、导航历史

### 数据处理功能
- ⚡ **实时数据处理** - 可配置的数据处理间隔
- 🌐 **自动数据发送** - 支持后台服务器数据推送
- 📊 **数据聚合器** - 将后端事件数据整理成完整的用户行为数据集合
- 🛡️ **隐私保护** - 可配置的数据收集范围

### 可视化功能
- 🎬 **行为播放器** - 重现用户交互行为的动画播放
- 🎯 **鼠标轨迹回放** - 可视化鼠标移动路径
- 💥 **点击效果展示** - 动态显示用户点击位置
- ⌨️ **键盘输入回放** - 显示用户键盘输入过程

### 技术特性
- 📊 **类型安全** - 完整的 TypeScript 类型定义
- 🔧 **模块化设计** - 核心库、数据聚合器、播放器独立使用
- 🚀 **高性能** - 优化的事件处理和数据存储

## 📚 API 参考

### 核心追踪库 (userBehaviour)

```typescript
// 配置选项
userBehaviour.config(options);

// 开始/停止追踪
userBehaviour.start();
userBehaviour.stop();

// 获取结果
const results = userBehaviour.showResult();

// 注册自定义事件
userBehaviour.registerCustomEvent('eventName', callback);
```

### 数据聚合器 (aggregator)

```typescript
import { 
    aggregateUserBehaviorData, 
    processUserBehaviorData,
    cleanEventData 
} from 'user-behavior-analysis/aggregator';

// 聚合事件数据
const aggregatedData = aggregateUserBehaviorData(events, sessionId);

// 高级处理（包含数据清理和统计）
const processedResult = processUserBehaviorData(events, sessionId, {
    includeStats: true,
    cleanData: true
});
```

### 行为播放器 (player)

```typescript
import userBehaviourPlayer from 'user-behavior-analysis/player';

// 加载数据
userBehaviourPlayer.load(trackingData, config);

// 播放控制
userBehaviourPlayer.play();
userBehaviourPlayer.pause();
userBehaviourPlayer.stop();
userBehaviourPlayer.seekTo(0.5); // 跳转到50%位置

// 获取状态
const state = userBehaviourPlayer.getState();

// 销毁播放器
userBehaviourPlayer.destroy();
```

## 🌐 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 移动端浏览器

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📖 详细文档

- **[核心库文档](DOCUMENTATION.md)** - 完整的使用指南、配置选项、API参考和示例代码
- **[播放器文档](PLAYER_README.md)** - 用户行为播放器的详细使用说明和配置选项
- **[数据聚合器文档](#数据聚合器使用)** - 后端数据处理和聚合功能说明

### 模块导入方式

```typescript
// 核心追踪库
import userBehaviour from 'user-behavior-analysis';

// 数据聚合器
import { aggregateUserBehaviorData } from 'user-behavior-analysis/aggregator';

// 行为播放器
import userBehaviourPlayer from 'user-behavior-analysis/player';
```

### 完整工作流程

1. **前端数据收集** - 使用核心库收集用户行为数据
2. **后端数据处理** - 使用数据聚合器整理事件数据
3. **行为回放分析** - 使用播放器可视化用户行为

```typescript
// 1. 前端收集数据
userBehaviour.config({
    autoSendEvents: true,
    sendUrl: '/api/track'
});
userBehaviour.start();

// 2. 后端聚合数据 (Node.js)
const { aggregateUserBehaviorData } = require('user-behavior-analysis/aggregator');
const aggregatedData = aggregateUserBehaviorData(events, sessionId);

// 3. 前端播放回放
userBehaviourPlayer.load(aggregatedData, {
    playbackSpeed: 1.5,
    showMouseTrail: true
});
```



**开始使用 User Behavior Analysis 库，深入了解您的用户行为！** 🚀
