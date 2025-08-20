# Next.js 用户行为追踪演示

这是一个使用 Next.js 构建的用户行为追踪演示应用，包含后端 API 用于收集用户数据。

## 功能特性

- 🎯 **用户行为追踪**: 追踪点击、滚动、鼠标移动、键盘输入等用户行为
- 🔧 **实时控制**: 可以启动/停止追踪，查看收集的事件数据
- 📊 **API 接口**: 提供 `/api/collect` 接口用于接收用户行为数据
- 🎨 **现代化 UI**: 使用 Tailwind CSS 构建的美观界面
- 🔒 **跨域支持**: API 支持跨域请求

## 快速开始

### 1. 安装依赖

```bash
cd demo/nextjs-demo
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 3. 访问应用

打开浏览器访问 `http://localhost:3000`，你将看到用户行为追踪演示界面。

## 使用方法

### 控制面板

- **开始追踪**: 点击绿色按钮开始收集用户行为数据
- **停止追踪**: 点击红色按钮停止数据收集
- **查看事件**: 点击蓝色按钮查看已收集的事件数据
- **清空事件**: 点击灰色按钮清空本地存储的事件

### 测试区域

应用提供了多个测试区域来演示不同类型的用户行为追踪：

1. **点击测试**: 点击按钮测试点击事件追踪
2. **表单测试**: 填写表单测试输入和提交事件追踪
3. **滚动测试**: 滚动页面测试滚动事件追踪

## API 接口

### POST /api/collect

接收用户行为数据的 API 接口。

**请求体格式:**
```json
{
  "type": "click",
  "data": {
    "x": 100,
    "y": 200,
    "target": "BUTTON",
    "text": "测试点击"
  },
  "timestamp": "2025-08-20T16:00:21.000Z",
  "url": "http://localhost:3000",
  "userInfo": {
    "windowSize": [1800, 871],
    "appCodeName": "Mozilla",
    "appName": "Netscape",
    "vendor": "Google Inc.",
    "platform": "MacIntel",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**响应格式:**
```json
{
  "status": "success",
  "message": "数据接收成功",
  "method": "POST",
  "receivedData": { ... }
}
```

## 追踪的事件类型

- `click`: 点击事件
- `scroll`: 滚动事件
- `mouseMovement`: 鼠标移动事件
- `keydown`: 键盘按下事件
- `visibilityChange`: 页面可见性变化
- `resize`: 窗口大小变化
- `formSubmit`: 表单提交事件
- `input`: 输入事件

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS
- **API**: Next.js API Routes
- **开发工具**: ESLint, PostCSS

## 与原始 test-server.js 的对比

这个 Next.js 示例实现了与 `test-server.js` 相同的功能：

1. ✅ **彩色控制台输出**: 使用相同的颜色代码和日志格式
2. ✅ **请求信息记录**: 记录请求方法、URL、时间、User-Agent 等
3. ✅ **数据接收处理**: 支持 GET 和 POST 请求
4. ✅ **错误处理**: 包含 JSON 解析错误处理
5. ✅ **跨域支持**: 自动处理 CORS 和预检请求

## 开发说明

### 项目结构

```
nextjs-demo/
├── src/
│   └── app/
│       ├── api/
│       │   └── collect/
│       │       └── route.ts          # API 路由
│       ├── globals.css               # 全局样式
│       ├── layout.tsx                # 根布局
│       └── page.tsx                  # 主页面
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── tsconfig.json
```

### 自定义配置

你可以通过修改以下文件来自定义应用：

- `src/app/api/collect/route.ts`: 修改 API 逻辑
- `src/app/page.tsx`: 修改前端界面和追踪逻辑
- `tailwind.config.ts`: 自定义 Tailwind CSS 配置

## 部署

### 构建生产版本

```bash
npm run build
npm start
```

### 环境变量

如果需要配置不同的 API 端点，可以在 `.env.local` 文件中设置：

```env
NEXT_PUBLIC_API_URL=http://your-api-domain.com/api/collect
```

## 许可证

MIT License
