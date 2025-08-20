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

### 一键演示

```bash
# 安装依赖
npm install

# 启动演示环境
npm start
```

访问 http://localhost:8080/demo/demo.html 查看完整演示。

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

## 📚 API 参考

### 核心方法

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

## 🌐 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 移动端浏览器

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📖 详细文档

查看 [DOCUMENTATION.md](DOCUMENTATION.md) 获取完整的使用指南、配置选项、API参考和示例代码。

## 🤝 支持

- 📧 邮件：taha@ta3.dev
- 🐛 [Issues](https://github.com/MixLabPro/User-Behavior-Analysis/issues)
- 💬 [Discussions](https://github.com/MixLabPro/User-Behavior-Analysis/discussions)

---

**开始使用 User Behavior Analysis 库，深入了解您的用户行为！** 🚀
