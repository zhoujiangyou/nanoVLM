import { useState, useEffect } from 'react';
import { 
  FiFolder, 
  FiFolderOpen, 
  FiFile, 
  FiChevronRight,
  FiChevronDown 
} from 'react-icons/fi';
import './FileExplorer.css';

const FileExplorer = ({ onFileOpen }) => {
  const [fileTree, setFileTree] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['/workspace']));

  useEffect(() => {
    fetchFileTree();
  }, []);

  const fetchFileTree = async () => {
    try {
      const response = await fetch('/api/files/tree');
      const data = await response.json();
      setFileTree(data);
    } catch (error) {
      console.error('Error fetching file tree:', error);
    }
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = async (filePath) => {
    try {
      const response = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`);
      const data = await response.json();
      onFileOpen({
        path: filePath,
        name: filePath.split('/').pop(),
        content: data.content,
        language: getLanguageFromExtension(filePath)
      });
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const getLanguageFromExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'kt': 'kotlin',
      'json': 'json',
      'xml': 'xml',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'yaml': 'yaml',
      'yml': 'yaml',
    };
    return languageMap[ext] || 'plaintext';
  };

  const renderTree = (node, level = 0) => {
    if (!node) return null;

    if (node.type === 'file') {
      return (
        <div
          key={node.path}
          className="file-item"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => handleFileClick(node.path)}
        >
          <FiFile size={16} />
          <span className="file-name">{node.name}</span>
        </div>
      );
    }

    const isExpanded = expandedFolders.has(node.path);

    return (
      <div key={node.path}>
        <div
          className="folder-item"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => toggleFolder(node.path)}
        >
          {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          {isExpanded ? <FiFolderOpen size={16} /> : <FiFolder size={16} />}
          <span className="folder-name">{node.name}</span>
        </div>
        {isExpanded && node.children && (
          <div className="folder-children">
            {node.children.map(child => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>EXPLORER</h3>
      </div>
      <div className="file-tree">
        {fileTree ? renderTree(fileTree) : <div className="loading">Loading...</div>}
      </div>
    </div>
  );
};

export default FileExplorer;
