import { useEffect, useRef, useState } from 'react';
import { FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import './Terminal.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('/workspace');
  const inputRef = useRef(null);

  useEffect(() => {
    // 初始化时显示欢迎信息
    setOutput([
      { type: 'info', text: 'Welcome to Cursor Editor Terminal' },
      { type: 'info', text: 'Type "help" for available commands' },
      { type: 'prompt', text: `${currentPath}$` }
    ]);
  }, []);

  const executeCommand = async (command) => {
    if (!command.trim()) return;

    // 添加到历史记录
    setHistory([...history, command]);
    setHistoryIndex(-1);

    // 显示输入的命令
    setOutput(prev => [...prev, { type: 'command', text: `${currentPath}$ ${command}` }]);

    // 处理内置命令
    const [cmd, ...args] = command.trim().split(' ');

    switch (cmd) {
      case 'help':
        setOutput(prev => [...prev,
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  help     - Show this help message' },
          { type: 'output', text: '  clear    - Clear the terminal' },
          { type: 'output', text: '  ls       - List files and directories' },
          { type: 'output', text: '  pwd      - Print working directory' },
          { type: 'output', text: '  echo     - Echo text' },
          { type: 'prompt', text: `${currentPath}$` }
        ]);
        break;

      case 'clear':
        setOutput([{ type: 'prompt', text: `${currentPath}$` }]);
        break;

      case 'pwd':
        setOutput(prev => [...prev,
          { type: 'output', text: currentPath },
          { type: 'prompt', text: `${currentPath}$` }
        ]);
        break;

      case 'echo':
        setOutput(prev => [...prev,
          { type: 'output', text: args.join(' ') },
          { type: 'prompt', text: `${currentPath}$` }
        ]);
        break;

      case 'ls':
        try {
          const response = await fetch('/api/terminal/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, cwd: currentPath })
          });
          const data = await response.json();
          setOutput(prev => [...prev,
            { type: 'output', text: data.output || data.error },
            { type: 'prompt', text: `${currentPath}$` }
          ]);
        } catch (error) {
          setOutput(prev => [...prev,
            { type: 'error', text: `Error: ${error.message}` },
            { type: 'prompt', text: `${currentPath}$` }
          ]);
        }
        break;

      default:
        // 执行系统命令
        try {
          const response = await fetch('/api/terminal/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, cwd: currentPath })
          });
          const data = await response.json();
          
          if (data.output) {
            setOutput(prev => [...prev,
              { type: 'output', text: data.output },
              { type: 'prompt', text: `${currentPath}$` }
            ]);
          }
          
          if (data.error) {
            setOutput(prev => [...prev,
              { type: 'error', text: data.error },
              { type: 'prompt', text: `${currentPath}$` }
            ]);
          }
        } catch (error) {
          setOutput(prev => [...prev,
            { type: 'error', text: `Command not found: ${cmd}` },
            { type: 'prompt', text: `${currentPath}$` }
          ]);
        }
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal">
      <div className="terminal-header">
        <span>Terminal</span>
      </div>
      <div className="terminal-body" ref={terminalRef}>
        {output.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">{currentPath}$ </span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
