# 使用指南

## 快速开始

### 方法 1：使用启动脚本（推荐）

```bash
cd cursor-editor
./start.sh
```

### 方法 2：手动启动

```bash
cd cursor-editor
npm install
npm run dev
```

## 界面介绍

### 1. 侧边栏（Sidebar）

左侧垂直工具栏包含以下功能：

- **📁 文件浏览器** - 查看和打开项目文件
- **🔍 搜索** - 全局搜索（待实现）
- **🌿 Git** - 版本控制（待实现）
- **💬 AI 助手** - 打开 AI 聊天面板
- **💻 终端** - 显示/隐藏集成终端
- **⚙️ 设置** - 编辑器设置（待实现）

### 2. 文件浏览器

- 点击文件夹前的箭头展开/收起
- 点击文件名打开文件
- 显示项目的文件树结构
- 自动过滤隐藏文件和 node_modules

### 3. 代码编辑器

#### 功能特性：
- **语法高亮** - 自动识别文件类型
- **代码补全** - 智能代码提示
- **多文件编辑** - 标签页管理
- **快捷键支持** - VSCode 风格快捷键

#### 快捷键：

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + S` | 保存文件 |
| `Ctrl/Cmd + F` | 查找 |
| `Ctrl/Cmd + H` | 替换 |
| `Ctrl/Cmd + /` | 切换注释 |
| `Ctrl/Cmd + D` | 选择下一个匹配项 |
| `Alt + Up/Down` | 移动行 |
| `Shift + Alt + Up/Down` | 复制行 |

### 4. 终端

#### 内置命令：
- `help` - 显示帮助信息
- `clear` - 清空终端
- `pwd` - 显示当前路径
- `echo [text]` - 输出文本
- `ls` - 列出文件

#### 系统命令：
支持执行大部分 Linux/Unix 命令，如：
- `ls -la` - 详细列出文件
- `cat file.txt` - 查看文件内容
- `git status` - 查看 Git 状态
- `npm install` - 安装依赖
- `python script.py` - 运行 Python 脚本

#### 特性：
- 命令历史（使用上下箭头键）
- 自动滚动到底部
- 支持错误高亮显示

### 5. AI 助手

#### 使用场景：

1. **代码解释**
   ```
   你: 解释一下 React 的 useEffect 钩子
   AI: [提供详细解释]
   ```

2. **Bug 调试**
   ```
   你: 我的 Python 代码出现 IndexError
   AI: [分析问题并提供解决方案]
   ```

3. **代码建议**
   ```
   你: 如何优化这个循环？
   AI: [提供优化建议]
   ```

4. **学习编程**
   ```
   你: 什么是闭包？
   AI: [解释概念并提供示例]
   ```

#### 当前限制：
- 使用模拟 AI 响应
- 要使用真实 AI，需要配置 API 密钥

## 高级配置

### 集成真实 AI API

#### OpenAI GPT

1. 安装 OpenAI SDK：
```bash
npm install openai
```

2. 创建 `.env` 文件：
```bash
cp .env.example .env
```

3. 添加 API 密钥：
```
OPENAI_API_KEY=sk-your-api-key-here
```

4. 修改 `server/routes/ai.js`：
```javascript
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
  
  res.json({ 
    response: completion.choices[0].message.content 
  });
});
```

#### Anthropic Claude

1. 安装 Anthropic SDK：
```bash
npm install @anthropic-ai/sdk
```

2. 配置并使用类似的方式集成

### 自定义主题

编辑 `src/App.jsx`，修改 theme 状态：

```javascript
const [theme, setTheme] = useState('vs-dark'); // 或 'vs-light', 'hc-black'
```

### 修改工作区

编辑 `server/routes/files.js`：

```javascript
const WORKSPACE_ROOT = '/your/custom/workspace/path';
```

### 端口配置

- 前端：修改 `vite.config.js` 中的 `port: 3000`
- 后端：修改 `server/index.js` 中的 `PORT = 3001`

## 故障排除

### 问题：npm install 失败

**解决方案**：
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 问题：端口被占用

**解决方案**：
```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :3001

# 终止进程
kill -9 <PID>
```

### 问题：文件无法保存

**检查**：
- 文件权限
- 磁盘空间
- 路径是否在工作区内

### 问题：终端命令无响应

**可能原因**：
- 命令超时（默认 10 秒）
- 命令被安全策略阻止
- 命令输出过大（最大 1MB）

## 性能优化

### 1. 大文件处理
编辑器会自动处理大文件，但对于超大文件（>5MB），建议：
- 使用命令行编辑
- 分割文件

### 2. 项目规模
- 过滤不必要的文件夹（在 `buildFileTree` 函数中配置）
- 使用 `.gitignore` 排除大型依赖

### 3. 终端性能
- 避免长时间运行的命令
- 定期清空终端输出

## 扩展功能

### 添加新的编程语言支持

Monaco Editor 内置支持多种语言，无需额外配置。

支持的语言包括：
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- PHP
- Ruby
- 等等...

### 添加自定义快捷键

在 `src/components/Editor.jsx` 的 `handleEditorDidMount` 中添加：

```javascript
editor.addCommand(
  monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
  () => {
    // 你的自定义功能
  }
);
```

### 添加文件右键菜单

在 `FileExplorer.jsx` 中添加上下文菜单功能。

## 安全注意事项

1. **文件访问**：编辑器限制在工作区内访问文件
2. **命令执行**：某些危险命令被阻止
3. **API 密钥**：永远不要提交 `.env` 文件到版本控制
4. **网络暴露**：生产环境建议使用反向代理和认证

## 贡献代码

欢迎提交 PR！请确保：
- 代码风格一致
- 添加必要的注释
- 测试新功能
- 更新文档

## 获取帮助

遇到问题？
1. 查看本文档
2. 检查 README.md
3. 查看 GitHub Issues
4. 提交新的 Issue
