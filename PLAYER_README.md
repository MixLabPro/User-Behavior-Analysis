# User Behaviour Player 用户行为播放器

用户行为播放器是一个用于播放和重现通过 `userBehaviour.ts` 收集的用户行为数据的工具。它可以将用户的鼠标轨迹、点击、滚动等行为以动画的形式重新播放。

## 安装

```bash
npm install user-behavior-analysis
```

## 基本使用

### 1. 导入播放器

```javascript
// ES6 模块导入
import userBehaviourPlayer from 'user-behavior-analysis/player';

// CommonJS 导入
const userBehaviourPlayer = require('user-behavior-analysis/player');

// 直接在浏览器中使用
<script src="path/to/userBehaviourPlayer.js"></script>
```

### 2. 加载和播放数据

```javascript
// 假设你有通过 userBehaviour.showResult() 获取的追踪数据
const trackingData = {
    userInfo: { /* 用户信息 */ },
    time: { /* 时间信息 */ },
    clicks: { /* 点击数据 */ },
    mouseMovements: [ /* 鼠标移动数据 */ ],
    // ... 其他数据
};

// 配置播放器选项
const playerConfig = {
    playbackSpeed: 1.0,           // 播放速度倍率
    showMouseTrail: true,         // 显示鼠标轨迹
    mouseTrailColor: '#ff0000',   // 鼠标轨迹颜色
    showClickEffect: true,        // 显示点击效果
    clickEffectColor: '#00ff00',  // 点击效果颜色
    autoPlay: false,              // 是否自动播放
    loop: false                   // 是否循环播放
};

// 加载数据并开始播放
userBehaviourPlayer.load(trackingData, playerConfig);
```

## 配置选项

### PlayerConfig 接口

```typescript
interface PlayerConfig {
    /** 播放速度倍率 (默认: 1.0) */
    playbackSpeed?: number;
    
    /** 是否显示鼠标轨迹 (默认: true) */
    showMouseTrail?: boolean;
    
    /** 鼠标轨迹颜色 (默认: '#ff0000') */
    mouseTrailColor?: string;
    
    /** 鼠标轨迹宽度 (默认: 2) */
    mouseTrailWidth?: number;
    
    /** 是否显示点击效果 (默认: true) */
    showClickEffect?: boolean;
    
    /** 点击效果颜色 (默认: '#00ff00') */
    clickEffectColor?: string;
    
    /** 点击效果大小 (默认: 20) */
    clickEffectSize?: number;
    
    /** 是否显示滚动指示器 (默认: true) */
    showScrollIndicator?: boolean;
    
    /** 是否显示键盘输入 (默认: true) */
    showKeyboardInput?: boolean;
    
    /** 播放控制面板位置 (默认: 'bottom') */
    controlPanelPosition?: 'top' | 'bottom' | 'left' | 'right';
    
    /** 是否自动播放 (默认: false) */
    autoPlay?: boolean;
    
    /** 是否循环播放 (默认: false) */
    loop?: boolean;
}
```

## API 方法

### 基本控制方法

```javascript
// 配置播放器
userBehaviourPlayer.configure(config);

// 加载追踪数据
userBehaviourPlayer.load(trackingData, config);

// 开始播放
userBehaviourPlayer.play();

// 暂停播放
userBehaviourPlayer.pause();

// 停止播放
userBehaviourPlayer.stop();

// 跳转到指定进度 (0-1)
userBehaviourPlayer.seekTo(0.5); // 跳转到50%位置

// 获取播放器状态
const state = userBehaviourPlayer.getState();
console.log(state.progress); // 当前播放进度

// 销毁播放器
userBehaviourPlayer.destroy();
```

### 播放器状态

```typescript
interface PlayerState {
    /** 当前播放状态 */
    state: 'stopped' | 'playing' | 'paused' | 'finished';
    
    /** 当前播放时间 (毫秒) */
    currentTime: number;
    
    /** 总播放时长 (毫秒) */
    totalDuration: number;
    
    /** 当前事件索引 */
    currentEventIndex: number;
    
    /** 播放进度 (0-1) */
    progress: number;
}
```

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>用户行为播放器示例</title>
</head>
<body>
    <h1>用户行为回放</h1>
    <div id="content">
        <button id="btn1">按钮1</button>
        <button id="btn2">按钮2</button>
        <input type="text" placeholder="输入框" />
    </div>

    <script src="path/to/userBehaviourPlayer.js"></script>
    <script>
        // 模拟的追踪数据
        const trackingData = {
            userInfo: {
                windowSize: [1920, 1080],
                appCodeName: "Mozilla",
                appName: "Netscape",
                vendor: "Google Inc.",
                platform: "MacIntel",
                userAgent: "Mozilla/5.0..."
            },
            time: {
                startTime: "2025-08-23 21:00:00",
                currentTime: "2025-08-23 21:05:00",
                stopTime: "2025-08-23 21:05:00"
            },
            clicks: {
                clickCount: 3,
                clickDetails: [
                    [100, 200, {tagName: "BUTTON", id: "btn1", className: "", name: "", value: "", textContent: "按钮1"}, "2025-08-23 21:01:00"],
                    [200, 300, {tagName: "BUTTON", id: "btn2", className: "", name: "", value: "", textContent: "按钮2"}, "2025-08-23 21:02:00"],
                    [300, 100, {tagName: "INPUT", id: "", className: "", name: "", value: "", textContent: ""}, "2025-08-23 21:03:00"]
                ]
            },
            mouseMovements: [
                [50, 50, "2025-08-23 21:00:30"],
                [75, 75, "2025-08-23 21:00:31"],
                [100, 100, "2025-08-23 21:00:32"],
                // ... 更多鼠标移动数据
            ],
            mouseScroll: [
                [0, 100, "2025-08-23 21:01:30"],
                [0, 200, "2025-08-23 21:01:31"]
            ],
            keyboardActivities: [
                ["H", {tagName: "INPUT", id: "", className: "", name: "", value: "", textContent: ""}, "2025-08-23 21:03:30"],
                ["e", {tagName: "INPUT", id: "", className: "", name: "", value: "", textContent: ""}, "2025-08-23 21:03:31"],
                ["l", {tagName: "INPUT", id: "", className: "", name: "", value: "", textContent: ""}, "2025-08-23 21:03:32"],
                ["l", {tagName: "INPUT", id: "", className: "", name: "", value: "", textContent: ""}, "2025-08-23 21:03:33"],
                ["o", {tagName: "INPUT", id: "", className: "", name: "", value: "", textContent: ""}, "2025-08-23 21:03:34"]
            ],
            navigationHistory: [],
            formInteractions: [],
            touchEvents: [],
            mediaInteractions: [],
            windowSizes: [],
            visibilitychanges: []
        };

        // 配置播放器
        const config = {
            playbackSpeed: 1.5,
            showMouseTrail: true,
            mouseTrailColor: '#ff6b6b',
            mouseTrailWidth: 3,
            showClickEffect: true,
            clickEffectColor: '#4ecdc4',
            clickEffectSize: 25,
            showKeyboardInput: true,
            controlPanelPosition: 'bottom',
            autoPlay: true,
            loop: true
        };

        // 加载并播放
        userBehaviourPlayer.load(trackingData, config);

        // 监听播放状态变化
        setInterval(() => {
            const state = userBehaviourPlayer.getState();
            console.log(`播放进度: ${(state.progress * 100).toFixed(1)}%`);
        }, 1000);
    </script>
</body>
</html>
```

## 高级功能

### 自定义样式

播放器会在页面中创建控制面板和视觉效果元素，你可以通过 CSS 来自定义它们的样式：

```css
/* 自定义控制面板样式 */
.user-behaviour-player-control {
    background: rgba(0, 0, 0, 0.9) !important;
    border-radius: 15px !important;
}

/* 自定义鼠标指示器样式 */
.user-behaviour-player-mouse {
    border: 2px solid white !important;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.8) !important;
}
```

### 事件监听

```javascript
// 监听播放状态变化
function onStateChange() {
    const state = userBehaviourPlayer.getState();
    
    switch(state.state) {
        case 'playing':
            console.log('开始播放');
            break;
        case 'paused':
            console.log('播放暂停');
            break;
        case 'finished':
            console.log('播放完成');
            break;
    }
}

// 定期检查状态
setInterval(onStateChange, 100);
```

## 注意事项

1. **性能考虑**: 对于包含大量鼠标移动数据的追踪结果，播放器会自动进行优化以确保流畅播放。

2. **浏览器兼容性**: 播放器使用现代浏览器API，建议在支持ES6的浏览器中使用。

3. **数据格式**: 确保传入的追踪数据格式与 `userBehaviour.showResult()` 返回的格式一致。

4. **内存管理**: 播放完成后建议调用 `destroy()` 方法来清理资源。

5. **响应式设计**: 播放器会自动适应窗口大小变化，但建议在固定尺寸的容器中使用以获得最佳效果。

## 故障排除

### 常见问题

**Q: 播放器无法显示鼠标轨迹**
A: 检查 `showMouseTrail` 配置是否为 `true`，以及数据中是否包含 `mouseMovements` 数组。

**Q: 点击效果不显示**
A: 确认 `showClickEffect` 配置为 `true`，并检查 `clicks.clickDetails` 数据是否正确。

**Q: 播放速度异常**
A: 检查 `playbackSpeed` 配置值，建议设置在 0.1 到 5.0 之间。

**Q: 控制面板不显示**
A: 确保页面中没有其他元素遮挡控制面板，可以尝试调整 `controlPanelPosition` 配置。

## 更新日志

- **v2.0.2**: 初始版本发布
  - 支持鼠标轨迹播放
  - 支持点击效果显示
  - 支持键盘输入显示
  - 支持滚动行为重现
  - 提供完整的播放控制功能

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。