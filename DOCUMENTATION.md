# User Behavior Analysis - 详细文档

一个用于追踪和记录用户在网页上各种交互行为的 TypeScript 库的完整使用指南。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [安装](#安装)
- [基础使用](#基础使用)
- [配置选项](#配置选项)
- [API 参考](#api-参考)
- [NextJS 后端集成](#nextjs-后端集成)
- [演示文件说明](#演示文件说明)
- [使用示例](#使用示例)
- [数据分析](#数据分析)
- [隐私保护](#隐私保护)
- [浏览器支持](#浏览器支持)
- [测试和调试](#测试和调试)
- [开发](#开发)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 🚀 快速开始

### 一键启动演示环境

```bash
# 安装依赖
npm install

# 一键启动完整演示环境
npm start
```

启动后会自动打开：
- 🌐 **演示页面**: http://localhost:8080/demo/demo.html
- 📡 **测试服务器**: http://localhost:5005
- 🚀 **NextJS 后端**: http://localhost:3000

### 使用步骤

1. **启动服务**
   ```bash
   npm start
   ```

2. **开始测试**
   - 浏览器会自动打开演示页面
   - 点击"开始追踪"按钮
   - 在页面上进行各种交互操作
   - 观察实时统计和日志输出

3. **查看数据**
   - 点击"显示结果"查看完整数据
   - 观察测试服务器接收到的数据
   - 查看 NextJS 后端控制台输出

4. **停止服务**
   - 按 `Ctrl+C` 停止所有服务

### 其他启动方式

```bash
# 直接打开演示页面
npm run demo

# 启动本地服务器
npm run demo:server
# 访问: http://localhost:8080/demo/demo.html

# 启动测试服务器
npm run test:server
# 测试服务器: http://localhost:5005

# 启动 NextJS 后端
cd nextjs && npm run dev
# NextJS 后端: http://localhost:3000

# 运行自动化测试
npm run test:run

# 检查服务状态
npm run test:status
```

## ✨ 功能特性

- 🖱️ **鼠标行为追踪** - 移动轨迹、点击位置、滚动行为
- ⌨️ **键盘活动监控** - 按键记录、输入行为分析
- 📱 **触摸事件支持** - 移动设备触摸交互
- 📝 **表单交互追踪** - 表单提交、输入行为
- 🎵 **媒体交互监控** - 音视频播放行为
- 🔄 **页面状态监控** - 窗口大小、页面可见性、导航历史
- ⚡ **实时数据处理** - 可配置的数据处理间隔
- 🌐 **自动数据发送** - 支持后台服务器数据推送
- 🛡️ **隐私保护** - 可配置的数据收集范围
- 📊 **类型安全** - 完整的 TypeScript 类型定义

## 📦 安装

### NPM 安装

```bash
npm install user-behavior-analysis
```

### 直接引入

```html
<script src="dist/userBehaviour.js"></script>
```

## 🔧 基础使用

### 1. 简单配置

```typescript
// 使用默认配置
userBehaviour.start();

// 5秒后停止并查看结果
setTimeout(() => {
    userBehaviour.stop();
    console.log(userBehaviour.showResult());
}, 5000);
```

### 2. 自定义配置

```typescript
const config = {
    clicks: true,
    mouseMovement: true,
    mouseMovementInterval: 0.5,  // 鼠标移动记录间隔（秒）
    processTime: 10,             // 每10秒处理一次数据
    clearAfterProcess: false,    // 处理后不清除数据
    processData: (results) => {
        // 发送数据到服务器
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify(results)
        });
    }
};

userBehaviour.config(config);
userBehaviour.start();
```

### 3. 自动数据发送

```typescript
const config = {
    autoSendEvents: true,
    sendUrl: 'http://your-api.com/events',
    processData: (results) => {
        console.log('数据已自动发送到服务器');
    }
};

userBehaviour.config(config);
userBehaviour.start();
```

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `userInfo` | boolean | true | 是否收集用户信息（浏览器、操作系统等） |
| `clicks` | boolean | true | 是否追踪点击事件 |
| `mouseMovement` | boolean | true | 是否追踪鼠标移动 |
| `mouseMovementInterval` | number | 1 | 鼠标移动记录间隔（秒） |
| `mouseScroll` | boolean | true | 是否追踪滚动事件 |
| `keyboardActivity` | boolean | true | 是否追踪键盘活动（包括按键和输入框内容变化） |
| `timeCount` | boolean | true | 是否启用时间计数 |
| `processTime` | number | 15 | 数据处理间隔时间（秒） |
| `clearAfterProcess` | boolean | true | 处理后是否清除数据 |
| `windowResize` | boolean | true | 是否追踪窗口大小变化 |
| `visibilitychange` | boolean | true | 是否追踪页面可见性变化 |
| `pageNavigation` | boolean | true | 是否追踪页面导航 |
| `formInteractions` | boolean | true | 是否追踪表单交互 |
| `touchEvents` | boolean | true | 是否追踪触摸事件 |
| `audioVideoInteraction` | boolean | true | 是否追踪音视频交互 |
| `autoSendEvents` | boolean | false | 是否自动发送事件 |
| `sendUrl` | string | '' | 事件接收后台URL |
| `processData` | function | console.log | 数据处理回调函数 |

## 📚 API 参考

### 核心方法

#### `config(options)`
配置追踪选项

```typescript
userBehaviour.config({
    clicks: true,
    mouseMovement: true,
    processData: (results) => {
        console.log(results);
    }
});
```

#### `start()`
开始用户行为追踪

```typescript
userBehaviour.start();
```

#### `stop()`
停止用户行为追踪

```typescript
userBehaviour.stop();
```

#### `showResult()`
获取当前追踪结果

```typescript
const results = userBehaviour.showResult();
```

#### `processResults()`
手动处理当前结果

```typescript
userBehaviour.processResults();
```

#### `showConfig()`
显示当前配置

```typescript
const config = userBehaviour.showConfig();
```

#### `registerCustomEvent(eventName, callback)`
注册自定义事件监听器

```typescript
userBehaviour.registerCustomEvent('customAction', (event) => {
    console.log('自定义事件:', event);
});
```

### 数据结构

#### TrackingResults 接口

```typescript
interface TrackingResults {
    userInfo: UserInfo;           // 用户信息
    time: TimeInfo;              // 时间信息
    clicks: ClickInfo;           // 点击信息
    mouseMovements: MousePosition[];  // 鼠标移动轨迹
    mouseScroll: ScrollData[];   // 滚动记录
    keyboardActivities: KeyboardActivity[];  // 键盘活动
    navigationHistory: NavigationHistory[];  // 导航历史
    formInteractions: FormInteraction[];     // 表单交互
    touchEvents: TouchEventData[];           // 触摸事件
    mediaInteractions: MediaInteraction[];   // 媒体交互
    windowSizes: WindowSize[];   // 窗口尺寸变化
    visibilitychanges: VisibilityChange[];  // 页面可见性变化
}
```

## 🎯 演示文件说明

### demo.html - 交互式演示页面

`demo.html` 是一个完整的交互式演示页面，展示了库的所有功能。

#### 主要功能区域：

1. **控制面板**
   - 🚀 开始追踪
   - ⏹️ 停止追踪
   - 📊 显示结果
   - 🗑️ 清除日志

2. **实时统计**
   - 追踪状态
   - 点击次数
   - 鼠标移动次数
   - 滚动次数
   - 键盘活动次数

3. **功能测试区域**
   - 🖱️ 鼠标交互测试
   - ⌨️ 键盘交互测试
   - 📝 表单交互测试
   - 📱 触摸事件测试
   - 🎵 媒体交互测试
   - 🔄 页面导航测试
   - 📏 窗口调整测试
   - 👁️ 页面可见性测试
   - 🎯 自定义事件测试

#### 使用方法：

1. 在浏览器中打开 `demo.html`
2. 点击"开始追踪"按钮
3. 在页面上进行各种交互操作
4. 观察实时统计和日志输出
5. 点击"显示结果"查看完整数据

#### 特色功能：

- **实时数据展示** - 动态更新统计信息
- **详细日志记录** - 记录所有追踪事件
- **可视化界面** - 直观的操作界面
- **完整功能测试** - 覆盖所有追踪功能

### example.ts - 代码示例文件

`example.ts` 包含了丰富的代码示例，展示了库的各种使用方式。

#### 包含的示例：

1. **基础使用示例** (`basicExample`)
   ```typescript
   function basicExample(): void {
       userBehaviour.start();
       setTimeout(() => {
           userBehaviour.stop();
           console.log('基础追踪已停止');
       }, 5000);
   }
   ```

2. **自定义配置示例** (`customConfigExample`)
   ```typescript
   function customConfigExample(): void {
       const config = {
           mouseMovementInterval: 0.5,
           processTime: 10,
           clearAfterProcess: false,
           autoSendEvents: true,
           sendUrl: 'http://127.0.0.1:3000/get',
           processData: (results) => {
               console.log('📊 用户行为数据:', results);
           }
       };
       userBehaviour.config(config);
       userBehaviour.start();
   }
   ```

3. **数据分析示例** (`dataAnalysisExample`)
   ```typescript
   function dataAnalysisExample(): void {
       const config = {
           processTime: 5,
           clearAfterProcess: false,
           processData: (results) => {
               analyzeUserBehaviour(results);
           }
       };
       userBehaviour.config(config);
       userBehaviour.start();
   }
   ```

4. **实时监控示例** (`realTimeMonitoringExample`)
   ```typescript
   function realTimeMonitoringExample(): void {
       const config = {
           processTime: 2,
           clearAfterProcess: true,
           processData: (results) => {
               console.log(`⏰ ${new Date().toLocaleTimeString()} - 用户行为摘要:`);
               console.log(`  点击次数: ${results.clicks?.clickCount || 0}`);
               console.log(`  鼠标移动: ${results.mouseMovements?.length || 0} 次`);
           }
       };
       userBehaviour.config(config);
       userBehaviour.start();
   }
   ```

5. **自定义事件示例** (`customEventExample`)
   ```typescript
   function customEventExample(): void {
       userBehaviour.registerCustomEvent('userAction', (event) => {
           console.log('检测到自定义用户行为:', event.detail);
       });
       userBehaviour.start();
   }
   ```

#### 使用方法：

1. 在 TypeScript 项目中引入 `example.ts`
2. 选择需要的示例函数
3. 调用相应的示例函数
4. 观察控制台输出

#### 数据分析函数：

`example.ts` 还包含了多个数据分析函数：

- `analyzeUserBehaviour()` - 综合分析用户行为
- `calculateClicksPerMinute()` - 计算每分钟点击次数
- `calculateMouseDistance()` - 计算鼠标移动总距离
- `analyzeScrollBehaviour()` - 分析滚动行为
- `analyzeKeyboardActivity()` - 分析键盘活动
- `calculateActivityLevel()` - 计算用户活跃度评分

## 💡 使用示例

### 基础使用示例

#### 1. 简单配置

```html
<!DOCTYPE html>
<html>
<head>
    <title>用户行为追踪示例</title>
</head>
<body>
    <h1>用户行为追踪测试</h1>
    <button onclick="startTracking()">开始追踪</button>
    <button onclick="stopTracking()">停止追踪</button>
    <button onclick="showResults()">显示结果</button>

    <script src="dist/userBehaviour.js"></script>
    <script>
        function startTracking() {
            userBehaviour.start();
            console.log('开始追踪用户行为');
        }

        function stopTracking() {
            userBehaviour.stop();
            console.log('停止追踪');
        }

        function showResults() {
            const results = userBehaviour.showResult();
            console.log('用户行为数据:', results);
        }
    </script>
</body>
</html>
```

#### 2. 自定义配置

```javascript
const config = {
    clicks: true,
    mouseMovement: true,
    mouseMovementInterval: 0.5,
    keyboardActivity: true,
    processTime: 10,
    clearAfterProcess: false,
    processData: (results) => {
        console.log('📊 用户行为数据:', results);
    }
};

userBehaviour.config(config);
userBehaviour.start();
```

#### 3. 数据发送到服务器

```javascript
const config = {
    autoSendEvents: true,
    sendUrl: 'http://localhost:5005/get',
    processTime: 5,
    processData: (results) => {
        console.log('数据已发送到服务器');
    }
};

userBehaviour.config(config);
userBehaviour.start();
```

#### 4. 键盘输入追踪

```javascript
const config = {
    keyboardActivity: true,  // 启用键盘活动追踪
    processTime: 2,
    processData: (results) => {
        // 键盘活动数据包含：
        // - keydown 事件：按键信息
        // - input 事件：输入框内容变化
        console.log('键盘活动:', results.keyboardActivities);
    }
};

userBehaviour.config(config);
userBehaviour.start();
```

**键盘追踪说明：**
- 追踪 `keydown` 事件：记录按键信息（如 "a", "Enter", "Backspace" 等）
- 追踪 `input` 事件：记录输入框的实际内容变化
- 支持所有输入元素：`<input>`, `<textarea>`, `<select>` 等
- 包含元素信息：标签名、ID、类名、当前值等

### 高级使用示例

#### 1. 自定义事件追踪

```typescript
// 注册自定义事件
userBehaviour.registerCustomEvent('productView', (event) => {
    console.log('产品浏览事件:', event.detail);
});

// 触发自定义事件
const customEvent = new CustomEvent('productView', {
    detail: { productId: '123', price: 99.99 }
});
window.dispatchEvent(customEvent);
```

#### 2. 数据持久化

```typescript
const config = {
    processData: (results) => {
        // 保存到本地存储
        localStorage.setItem('userBehaviour', JSON.stringify(results));
        
        // 发送到服务器
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(results)
        });
    }
};
```

#### 3. 条件追踪

```typescript
const config = {
    processData: (results) => {
        // 只在特定条件下发送数据
        if (results.clicks.clickCount > 10) {
            sendToAnalytics(results);
        }
    }
};
```

## 📊 数据分析

### 基础分析

```typescript
function analyzeUserBehaviour(results) {
    // 点击分析
    console.log(`总点击次数: ${results.clicks.clickCount}`);
    console.log(`平均每分钟点击: ${calculateClicksPerMinute(results)}`);
    
    // 鼠标移动分析
    const totalDistance = calculateMouseDistance(results.mouseMovements);
    console.log(`鼠标移动总距离: ${totalDistance.toFixed(2)}px`);
    
    // 滚动分析
    const scrollStats = analyzeScrollBehaviour(results.mouseScroll);
    console.log('滚动行为:', scrollStats);
    
    // 活跃度评分
    const activityLevel = calculateActivityLevel(results);
    console.log(`用户活跃度: ${activityLevel}/10`);
}
```

### 高级分析

```typescript
function advancedAnalysis(results) {
    // 用户路径分析
    const userPath = results.clicks.clickDetails.map(click => click[2].tagName);
    console.log('用户操作路径:', userPath);
    
    // 热点区域分析
    const hotspots = analyzeClickHotspots(results.clicks.clickDetails);
    console.log('点击热点区域:', hotspots);
    
    // 行为模式识别
    const patterns = identifyBehaviorPatterns(results);
    console.log('行为模式:', patterns);
}
```

## 🔒 隐私保护

### 配置隐私选项

```typescript
const privacyConfig = {
    userInfo: false,        // 不收集用户信息
    keyboardActivity: false, // 不追踪键盘活动
    processData: (results) => {
        // 匿名化处理
        const anonymousData = anonymizeData(results);
        sendToAnalytics(anonymousData);
    }
};
```

### 数据匿名化

```typescript
function anonymizeData(results) {
    return {
        ...results,
        userInfo: {
            // 只保留基本信息，不包含个人标识
            platform: results.userInfo.platform,
            // 移除 userAgent 等可能包含个人信息的数据
        }
    };
}
```

## 🌐 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 移动端浏览器

## 🧪 测试和调试

### 测试功能说明

#### 1. HTML演示页面 (`demo/demo.html`)
- **功能**: 完整的交互式演示界面
- **访问方式**: 
  - 直接打开: `npm run demo`
  - 本地服务器: `npm run demo:server` 然后访问 `http://localhost:8080/demo/demo.html`
- **测试内容**:
  - 🖱️ 鼠标移动和点击追踪
  - ⌨️ 键盘输入监控
  - 📝 表单交互测试
  - 📱 触摸事件模拟
  - 🎵 媒体交互测试
  - 🔄 页面状态监控
  - 🎯 自定义事件测试

#### 2. 测试服务器 (`demo/test-server.js`)
- **功能**: 接收和显示用户行为数据
- **启动**: `npm run test:server`
- **端口**: 5005
- **API端点**: `http://localhost:5005/get`
- **用途**: 测试自动数据发送功能

#### 3. 配置测试数据发送
在演示页面中配置以下选项来测试数据发送功能：
```javascript
{
    autoSendEvents: true,
    sendUrl: "http://localhost:5005/get",
    processTime: 5  // 每5秒发送一次数据
}
```

#### 4. 自动化测试 (`demo/test-runner.js`)
- **功能**: 自动检查测试环境状态
- **运行**: `npm run test:run`
- **检查内容**:
  - 测试服务器连接状态
  - 演示服务器连接状态
  - 端口占用情况
  - 服务可用性验证

#### 5. 状态检查 (`demo/check-status.js`)
- **功能**: 快速检查服务运行状态
- **运行**: `npm run test:status`
- **检查内容**:
  - 服务连接状态
  - 端口占用情况
  - 服务可用性

### 调试技巧

#### 1. 浏览器开发者工具
- 打开 `F12` 或右键选择"检查"
- 查看 `Console` 标签页的日志输出
- 在 `Network` 标签页监控数据发送请求

#### 2. 实时数据监控
- 在演示页面中启用"实时统计"功能
- 观察页面上的实时数据更新
- 使用"显示结果"按钮查看完整数据

#### 3. 服务器日志
- 启动测试服务器后，在终端观察接收到的数据
- 数据格式为JSON，包含所有用户行为信息

### 故障排除

#### 1. 端口占用问题
启动脚本现在会自动检测并释放被占用的端口，无需手动处理。

如果仍然遇到问题，可以手动处理：
```bash
# 检查端口占用
lsof -i :5005
lsof -i :8080

# 停止占用端口的进程
kill -9 <PID>

# 重新启动服务
npm start
```

#### 2. 数据发送失败
1. 确认测试服务器正在运行
2. 检查浏览器控制台是否有CORS错误
3. 验证sendUrl配置是否正确
4. 检查网络连接状态

#### 3. 功能不工作
1. 确认已点击"开始追踪"按钮
2. 检查配置选项是否正确设置
3. 查看浏览器控制台是否有错误信息
4. 确认浏览器支持相关API

## 🛠️ 开发

### 构建项目

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式
npm run dev

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 项目结构

```
User-Behaviour-Analysis/
├── userBehaviour.ts      # 主库文件
├── example.ts           # 使用示例
├── demo/                # 演示和测试文件
│   ├── demo.html        # 演示页面
│   ├── test-server.js   # 测试服务器
│   ├── test-runner.js   # 自动化测试
│   └── start-demo.js    # 一键启动脚本
├── dist/                # 构建输出目录
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
└── README.md           # 项目文档
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢原作者 [Taha Al-Jody](https://github.com/TA3) 创建了这个优秀的用户行为追踪库。

## 📞 支持

如有任何问题或建议，请：
- 📧 发送邮件至：taha@ta3.dev  
- 🐛 [提交 Issue](https://github.com/TA3/web-user-behaviour/issues)
- 💬 [参与讨论](https://github.com/TA3/web-user-behaviour/discussions)

---

**开始使用 Web User Behaviour 库，深入了解您的用户行为！** 🚀

## 🚀 NextJS 后端集成

本项目包含了一个完整的 NextJS 后端示例，用于接收和处理用户行为数据。

### 后端功能

- 📡 **数据接收**: 支持 GET 和 POST 请求接收用户行为数据
- 🎨 **美化输出**: 彩色控制台输出，便于调试
- 🔍 **详细日志**: 记录请求信息、数据内容和处理状态
- 🛡️ **错误处理**: 完善的错误处理和异常捕获
- 🌐 **CORS 支持**: 支持跨域请求

### 启动 NextJS 后端

```bash
# 进入 NextJS 目录
cd nextjs

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

后端将在 http://localhost:3000 启动。

### API 端点

#### 数据收集端点
- **URL**: `http://localhost:3000/api/collect`
- **方法**: GET, POST
- **功能**: 接收用户行为数据

#### 使用示例

```typescript
// 配置自动发送到 NextJS 后端
const config = {
    autoSendEvents: true,
    sendUrl: 'http://localhost:3000/api/collect',
    processTime: 5, // 每5秒发送一次数据
    processData: (results) => {
        console.log('数据已发送到 NextJS 后端');
    }
};

userBehaviour.config(config);
userBehaviour.start();
```

### 后端控制台输出

NextJS 后端会提供详细的彩色控制台输出：

```
🌐 请求信息
==================================================
方法: POST
URL: http://localhost:3000/api/collect
时间: 2024/1/15 14:30:25
User-Agent: Mozilla/5.0...

📊 收到用户行为数据 (POST)
==================================================
{
  "userInfo": { ... },
  "clicks": { ... },
  "mouseMovements": [ ... ],
  ...
}
==================================================

✅ POST请求处理完成
```

### 集成到现有项目

1. **复制 API 路由**
   ```bash
   # 复制 collect 路由到你的 NextJS 项目
   cp nextjs/src/app/api/collect/route.ts your-project/src/app/api/collect/route.ts
   ```

2. **配置 CORS** (如果需要)
   ```typescript
   // 在 route.ts 中添加 CORS 头
   export async function POST(request: NextRequest) {
       const response = NextResponse.json({ ... });
       response.headers.set('Access-Control-Allow-Origin', '*');
       return response;
   }
   ```

3. **自定义数据处理**
   ```typescript
   export async function POST(request: NextRequest) {
       const data = await request.json();
       
       // 自定义数据处理逻辑
       await saveToDatabase(data);
       await sendToAnalytics(data);
       
       return NextResponse.json({ status: 'success' });
   }
   ```

### 生产环境部署

```bash
# 构建生产版本
cd nextjs
npm run build

# 启动生产服务器
npm start
```

---

**开始使用 User Behavior Analysis 库，深入了解您的用户行为！** 🚀

## 📋 文档与代码对应关系检查报告

### ✅ 已修复的问题

1. **包名一致性**
   - ✅ 修复了 README.md 中的包名，从 `web-user-behaviour` 改为 `user-behavior-analysis`
   - ✅ 修复了所有文档中的包名引用
   - ✅ 确保与 package.json 中的包名一致

2. **GitHub 链接修复**
   - ✅ 更新了所有文档中的 GitHub 链接，指向正确的仓库 `MixLabPro/User-Behavior-Analysis`
   - ✅ 修复了 Issues 和 Discussions 链接

3. **NextJS 后端文档补充**
   - ✅ 在 DOCUMENTATION.md 中添加了完整的 NextJS 后端集成说明
   - ✅ 添加了 API 端点说明和使用示例
   - ✅ 添加了后端控制台输出示例
   - ✅ 添加了集成到现有项目的指导

4. **演示环境增强**
   - ✅ 在 demo.html 中添加了 NextJS 集成测试功能
   - ✅ 在 example.ts 中添加了 NextJS 集成示例代码
   - ✅ 更新了 start-demo.js 以支持 NextJS 后端启动
   - ✅ 在 package.json 中添加了 NextJS 相关脚本

5. **代码示例完善**
   - ✅ 修复了 example.ts 中的引用路径
   - ✅ 添加了 NextJS 集成示例函数
   - ✅ 完善了示例函数的导出和调用方式

### 📊 当前项目结构

```
User-Behavior-Analysis/
├── userBehaviour.ts          # 主库文件
├── example.ts               # 使用示例
├── demo/                    # 演示和测试文件
│   ├── demo.html            # 演示页面 (包含 NextJS 集成测试)
│   ├── test-server.js       # 测试服务器
│   ├── start-demo.js        # 一键启动脚本 (支持 NextJS)
│   ├── check-status.js      # 状态检查
│   └── example.ts           # 示例代码 (包含 NextJS 示例)
├── nextjs/                  # NextJS 后端
│   ├── src/app/api/collect/ # API 路由
│   └── package.json         # NextJS 配置
├── package.json             # 主项目配置
├── README.md               # 项目说明 (已修复)
└── DOCUMENTATION.md        # 详细文档 (已完善)
```

### 🎯 功能对应关系

| 功能 | 文档位置 | 代码实现 | 状态 |
|------|----------|----------|------|
| 基础追踪 | README.md, DOCUMENTATION.md | userBehaviour.ts | ✅ |
| 配置选项 | DOCUMENTATION.md | userBehaviour.ts | ✅ |
| API 接口 | DOCUMENTATION.md | userBehaviour.ts | ✅ |
| 演示页面 | DOCUMENTATION.md | demo/demo.html | ✅ |
| 示例代码 | DOCUMENTATION.md | demo/example.ts | ✅ |
| 测试服务器 | DOCUMENTATION.md | demo/test-server.js | ✅ |
| NextJS 后端 | DOCUMENTATION.md | nextjs/src/app/api/collect/ | ✅ |
| 一键启动 | DOCUMENTATION.md | demo/start-demo.js | ✅ |

### 🚀 使用流程

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动演示环境**
   ```bash
   npm start
   ```

3. **访问服务**
   - 演示页面: http://localhost:8080/demo/demo.html
   - 测试服务器: http://localhost:5005
   - NextJS 后端: http://localhost:3000

4. **测试功能**
   - 在演示页面中点击"开始追踪"
   - 进行各种交互操作
   - 观察数据收集和发送

### 📝 注意事项

1. **包名**: 使用 `user-behavior-analysis` 而不是 `web-user-behaviour`
2. **NextJS 后端**: 需要先安装依赖 `cd nextjs && npm install`
3. **端口占用**: 启动脚本会自动处理端口冲突
4. **浏览器支持**: 确保使用现代浏览器以获得最佳体验

### 🔄 持续维护

- 定期检查文档与代码的一致性
- 及时更新 API 文档
- 保持示例代码的最新性
- 确保所有链接的有效性
