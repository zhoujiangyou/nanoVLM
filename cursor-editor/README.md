# Cursor Editor - AI-Powered Code Editor

一个类似 Cursor 的现代化代码编辑器，具有 AI 辅助功能。

## ✨ 特性

- 🎨 **Monaco Editor** - 使用 VSCode 同款编辑器引擎
- 📁 **文件浏览器** - 直观的文件系统浏览和管理
- 🤖 **AI 助手** - 智能代码建议和问答（可扩展接入真实 AI API）
- 💻 **集成终端** - 内置命令行终端
- 🎯 **语法高亮** - 支持多种编程语言
- ⚡ **快捷键** - Ctrl/Cmd+S 保存文件
- 🌗 **深色主题** - 舒适的编程界面

## 🚀 快速开始

### 安装依赖

```bash
cd cursor-editor
npm install
```

### 运行开发服务器

```bash
npm run dev
```

这将同时启动：
- 前端开发服务器（端口 3000）
- 后端 API 服务器（端口 3001）

然后在浏览器中打开 http://localhost:3000

### 单独运行

```bash
# 只运行前端
npm run dev:client

# 只运行后端
npm run dev:server
```

### 构建生产版本

```bash
npm run build
npm run preview
```

## 📂 项目结构

```
cursor-editor/
├── src/                      # 前端源代码
│   ├── components/          # React 组件
│   │   ├── Sidebar.jsx      # 侧边栏
│   │   ├── FileExplorer.jsx # 文件浏览器
│   │   ├── Editor.jsx       # 代码编辑器
│   │   ├── Terminal.jsx     # 终端
│   │   └── AIChat.jsx       # AI 聊天
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── server/                   # 后端服务器
│   ├── routes/              # API 路由
│   │   ├── files.js         # 文件操作 API
│   │   ├── terminal.js      # 终端命令 API
│   │   └── ai.js            # AI 聊天 API
│   └── index.js             # 服务器入口
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── index.html               # HTML 模板
```

## 🎮 使用说明

### 文件操作

1. **打开文件**：点击文件浏览器中的文件
2. **保存文件**：使用 `Ctrl+S` (Windows/Linux) 或 `Cmd+S` (Mac)
3. **切换文件**：点击顶部标签页
4. **关闭文件**：点击标签页上的 ×

### AI 助手

1. 点击右侧边栏的 💬 图标打开 AI 聊天
2. 输入您的问题或需求
3. AI 将提供代码建议、解释和帮助

**注意**：当前使用模拟响应。要使用真实 AI，需要在 `server/routes/ai.js` 中集成 OpenAI、Anthropic Claude 等 API。

### 终端

1. 点击侧边栏的终端图标切换终端显示
2. 输入命令并按 Enter 执行
3. 支持命令历史（上/下箭头键）

### 快捷键

- `Ctrl/Cmd + S` - 保存当前文件
- `Ctrl/Cmd + F` - 搜索
- `Ctrl/Cmd + H` - 查找替换
- `Ctrl/Cmd + /` - 切换注释

## 🔧 自定义配置

### 接入真实 AI API

编辑 `server/routes/ai.js`：

```javascript
// 示例：集成 OpenAI API
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  const { messages } = req.body;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages,
  });
  
  res.json({ response: completion.choices[0].message.content });
});
```

### 修改工作区路径

编辑 `server/routes/files.js` 中的 `WORKSPACE_ROOT` 变量：

```javascript
const WORKSPACE_ROOT = '/your/custom/path';
```

### 主题配置

在 `src/components/Editor.jsx` 中修改 theme 属性：
- `vs-dark` - 深色主题（默认）
- `vs-light` - 浅色主题
- `hc-black` - 高对比度黑色主题

## 🛠️ 技术栈

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **Monaco Editor** - 代码编辑器
- **React Icons** - 图标库

### 后端
- **Express** - Web 框架
- **Node.js** - 运行环境

## 📝 待实现功能

- [ ] 多标签页拖拽排序
- [ ] 代码智能补全
- [ ] Git 集成
- [ ] 多文件搜索
- [ ] 设置面板
- [ ] 插件系统
- [ ] 实时协作
- [ ] 更多主题选项

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 强大的代码编辑器
- [VSCode](https://code.visualstudio.com/) - UI 设计灵感
- [Cursor](https://cursor.sh/) - 产品灵感来源
