import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execAsync = promisify(exec);

// 执行终端命令
router.post('/exec', async (req, res) => {
  try {
    const { command, cwd = '/workspace' } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // 安全检查：限制某些危险命令
    const dangerousCommands = ['rm -rf /', 'mkfs', 'dd', ':(){:|:&};:'];
    if (dangerousCommands.some(cmd => command.includes(cmd))) {
      return res.status(403).json({ error: 'Command not allowed' });
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd,
        timeout: 10000, // 10秒超时
        maxBuffer: 1024 * 1024, // 1MB
      });

      res.json({
        output: stdout || stderr,
        error: stderr && !stdout ? stderr : null
      });
    } catch (error) {
      res.json({
        output: error.stdout || '',
        error: error.stderr || error.message
      });
    }
  } catch (error) {
    console.error('Error executing command:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
