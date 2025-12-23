import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// 工作区根目录
const WORKSPACE_ROOT = '/workspace';

// 安全检查：确保路径在工作区内
function isPathSafe(filePath) {
  const resolvedPath = path.resolve(filePath);
  return resolvedPath.startsWith(WORKSPACE_ROOT);
}

// 获取文件树
router.get('/tree', async (req, res) => {
  try {
    const tree = await buildFileTree(WORKSPACE_ROOT);
    res.json(tree);
  } catch (error) {
    console.error('Error building file tree:', error);
    res.status(500).json({ error: error.message });
  }
});

// 递归构建文件树
async function buildFileTree(dirPath, name = null) {
  try {
    const stats = await fs.stat(dirPath);
    const nodeName = name || path.basename(dirPath);

    if (stats.isDirectory()) {
      const children = await fs.readdir(dirPath);
      
      // 过滤掉隐藏文件和特定目录
      const filteredChildren = children.filter(child => 
        !child.startsWith('.') && 
        !['node_modules', '__pycache__', 'venv', 'dist', 'build'].includes(child)
      );

      const childNodes = await Promise.all(
        filteredChildren.map(child =>
          buildFileTree(path.join(dirPath, child), child)
        )
      );

      // 排序：文件夹在前，文件在后
      childNodes.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'directory' ? -1 : 1;
      });

      return {
        name: nodeName,
        path: dirPath,
        type: 'directory',
        children: childNodes
      };
    } else {
      return {
        name: nodeName,
        path: dirPath,
        type: 'file'
      };
    }
  } catch (error) {
    console.error(`Error processing ${dirPath}:`, error);
    return null;
  }
}

// 读取文件内容
router.get('/read', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    
    if (!filePath || !isPathSafe(filePath)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: error.message });
  }
});

// 保存文件
router.post('/save', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!filePath || !isPathSafe(filePath)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    await fs.writeFile(filePath, content, 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: error.message });
  }
});

// 创建文件
router.post('/create', async (req, res) => {
  try {
    const { path: filePath, type } = req.body;
    
    if (!filePath || !isPathSafe(filePath)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    if (type === 'directory') {
      await fs.mkdir(filePath, { recursive: true });
    } else {
      await fs.writeFile(filePath, '', 'utf-8');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating file/directory:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除文件/目录
router.delete('/delete', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    
    if (!filePath || !isPathSafe(filePath)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await fs.rm(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting file/directory:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
