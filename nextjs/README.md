# Sarah的AI创造之旅 - Next.js演示项目

这是一个基于Next.js的用户行为分析演示项目，展示了如何集成`user-behavior-analysis`库来追踪用户行为。

## 功能特性

- 🎨 精美的UI设计，展示Sarah的AI编程之旅
- 📊 完整的用户行为追踪系统
- 🖼️ AI图片生成功能（需要SiliconFlow API密钥）
- 📋 富文本复制功能
- 🔒 本地API密钥存储
- 💾 埋点数据缓存和查询系统

## 用户行为追踪功能

项目集成了`user-behavior-analysis`库，自动追踪以下用户行为：

- **页面浏览**：自动记录页面访问
- **点击事件**：追踪按钮点击、链接点击等
- **滚动行为**：记录页面滚动深度
- **表单交互**：追踪表单提交和输入
- **自定义事件**：手动追踪特定业务事件

### 追踪的事件类型

1. **页面浏览** (`page_view`)
2. **按钮点击** (`button_click`)
3. **API密钥保存** (`api_key_saved`)
4. **内容复制** (`content_copied`)
5. **图片生成** (`image_generated`)
6. **图片生成失败** (`image_generation_failed`)

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

- 主页面：[http://localhost:3000](http://localhost:3000)
- 测试页面：[http://localhost:3000/test](http://localhost:3000/test)
- 埋点记录页面：[http://localhost:3000/tracks](http://localhost:3000/tracks)

## 配置说明

### 用户行为分析配置

在`src/app/page.tsx`中，你可以修改`userBehaviour`的配置：

```typescript
uba.config({
  sendUrl: 'http://localhost:3000/api/track', // 后端接口地址
  appId: 'sarah-ai-journey',                   // 应用标识
  userId: 'anonymous-user',                    // 用户标识
  debug: true,                                 // 调试模式
  autoSendEvents: true,                        // 自动发送事件
  clicks: true,                                // 追踪点击
  mouseScroll: true,                           // 追踪滚动
  formInteractions: true,                      // 追踪表单
  processData: (results) => {
    // 自定义数据处理逻辑
    console.log('用户行为数据:', results);
  }
});
```

### API接口

项目包含完整的API接口来处理用户行为数据：

#### 1. 用户行为追踪接口

- **POST** `/api/track` - 接收用户行为数据
- **GET** `/api/track` - 检查API状态

**POST /api/track 请求示例：**
```javascript
fetch('/api/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: 'page_view',
    page: '/home',
    userId: 'user123',
    timestamp: new Date().toISOString()
  })
});
```

**响应示例：**
```json
{
  "success": true,
  "message": "数据接收成功",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "event": "page_view",
    "page": "/home",
    "userId": "user123"
  }
}
```

#### 2. 埋点记录查询接口

- **GET** `/api/tracks` - 获取埋点记录（支持分页）
- **DELETE** `/api/tracks` - 清除缓存（仅开发环境）

**GET /api/tracks 请求参数：**
- `page` (可选): 页码，默认为1
- `limit` (可选): 每页记录数，默认为100，最大1000

**请求示例：**
```javascript
// 获取第1页，每页10条记录
fetch('/api/tracks?page=1&limit=10')

// 获取最近100条记录
fetch('/api/tracks')
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "abc123",
        "timestamp": "2024-01-01T12:00:00.000Z",
        "data": {
          "event": "page_view",
          "page": "/home",
          "userId": "user123"
        },
        "userAgent": "Mozilla/5.0...",
        "ip": "127.0.0.1"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 50,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 缓存系统

项目使用内存缓存系统来存储埋点记录：

- **最大记录数**: 1000条
- **自动清理**: 超过最大记录数时自动删除最旧的记录
- **数据持久性**: 内存缓存，服务器重启后数据会丢失
- **记录信息**: 包含ID、时间戳、数据内容、User Agent、IP地址

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── track/
│   │   │   └── route.ts          # 用户行为追踪API
│   │   └── tracks/
│   │       └── route.ts          # 埋点记录查询API
│   ├── tracks/
│   │   └── page.tsx              # 埋点记录展示页面
│   ├── test/
│   │   └── page.tsx              # 测试页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 布局组件
│   └── page.tsx                  # 主页面
├── lib/
│   └── cache.ts                  # 缓存系统
├── public/
│   └── user-behaviour.js         # 用户行为追踪库
└── ...
```

## 测试用户行为追踪

### 使用测试脚本

项目包含一个测试脚本来验证API功能：

```bash
# 在项目根目录运行
node test-api.js
```

### 手动测试

1. 访问主页面，触发一些用户行为
2. 访问 `/tracks` 页面查看埋点记录
3. 使用API接口直接查询数据

### 测试埋点数据发送

```javascript
// 在浏览器控制台中运行
fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'test_event',
    message: '测试数据',
    timestamp: new Date().toISOString()
  })
});
```

### 测试埋点记录查询

```javascript
// 获取最近10条记录
fetch('/api/tracks?limit=10')
  .then(response => response.json())
  .then(data => console.log(data));
```
