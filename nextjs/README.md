# Sarah的AI创造之旅 - Next.js演示项目

这是一个基于Next.js的用户行为分析演示项目，展示了如何集成`user-behavior-analysis`库来追踪用户行为。

## 功能特性

- 🎨 精美的UI设计，展示Sarah的AI编程之旅
- 📊 完整的用户行为追踪系统
- 🖼️ AI图片生成功能（需要SiliconFlow API密钥）
- 📋 富文本复制功能
- 🔒 本地API密钥存储

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

项目包含一个简单的API接口来处理用户行为数据：

- **POST** `/api/track` - 接收用户行为数据
- **GET** `/api/track` - 检查API状态

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── track/
│   │       └── route.ts          # 用户行为追踪API
│   ├── test/
│   │   └── page.tsx              # 测试页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 布局组件
│   └── page.tsx                  # 主页面
├── public/
│   └── user-behaviour.js         # 用户行为追踪库
└── ...
```

## 测试用户行为追踪

### 1. 访问测试页面

打开浏览器访问 [http://localhost:3000/test](http://localhost:3000/test)

### 2. 查看控制台输出

打开浏览器开发者工具的控制台，你会看到：
- userBehaviour库的加载状态
- 当前配置信息
- 用户行为数据

### 3. 测试交互

在测试页面中：
- 点击按钮
- 滚动页面
- 在输入框中输入文字
- 观察控制台的输出变化

### 4. 查看API数据

用户行为数据会自动发送到 `/api/track` 接口，你可以在控制台看到：
- 点击事件数据
- 滚动事件数据
- 输入事件数据
- 页面浏览数据

## 自定义追踪事件

你可以通过以下方式手动触发数据处理：

```typescript
const uba = (window as any).uba;
if (uba) {
  // 手动触发数据处理
  uba.processResults();
}
```

## 数据持久化

当前API接口只是将数据打印到控制台。在生产环境中，你可以：

1. 将数据保存到数据库
2. 发送到第三方分析服务
3. 集成到现有的数据管道

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **用户行为分析**: user-behavior-analysis
- **字体**: Noto Sans SC (中文字体)

## 开发说明

### 添加新的追踪事件

1. 在页面组件中访问全局的`uba`对象
2. 使用`uba.processResults()`方法触发数据处理
3. 在API接口中处理新的事件类型

### 自定义样式

项目使用Tailwind CSS，你可以：
- 修改`tailwind.config.ts`配置
- 在`globals.css`中添加自定义样式
- 使用Tailwind的工具类快速构建UI

## 部署

### Vercel部署

```bash
npm run build
npm run start
```

### 环境变量

在生产环境中，建议设置以下环境变量：

```env
NEXT_PUBLIC_API_ENDPOINT=https://your-domain.com/api/track
NEXT_PUBLIC_APP_ID=your-app-id
```

## 故障排除

### 1. userBehaviour不可用

如果控制台显示"userBehaviour不可用"，请检查：
- 脚本是否正确加载
- 是否有JavaScript错误
- 网络连接是否正常

### 2. 数据没有发送到后端

如果数据没有发送到后端，请检查：
- API接口是否正常运行
- 网络请求是否有错误
- CORS配置是否正确

### 3. 页面无法加载

如果页面无法加载，请检查：
- 开发服务器是否正常运行
- 端口是否被占用
- 依赖是否正确安装

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！
