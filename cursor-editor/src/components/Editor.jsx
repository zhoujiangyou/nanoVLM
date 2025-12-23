import { useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { FiX } from 'react-icons/fi';
import './Editor.css';

const Editor = ({ 
  openFiles, 
  activeFile, 
  setActiveFile, 
  onFileClose,
  onFileSave,
  theme 
}) => {
  const editorRef = useRef(null);
  const [fileContents, setFileContents] = useState({});

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // 添加保存快捷键 Ctrl+S / Cmd+S
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeFile) {
        const content = fileContents[activeFile.path] || activeFile.content;
        onFileSave(activeFile.path, content);
      }
    });
  };

  const handleEditorChange = (value) => {
    if (activeFile) {
      setFileContents({
        ...fileContents,
        [activeFile.path]: value
      });
    }
  };

  const getEditorValue = () => {
    if (!activeFile) return '';
    return fileContents[activeFile.path] !== undefined 
      ? fileContents[activeFile.path] 
      : activeFile.content;
  };

  return (
    <div className="editor">
      {openFiles.length > 0 && (
        <div className="tabs">
          {openFiles.map(file => (
            <div
              key={file.path}
              className={`tab ${activeFile?.path === file.path ? 'active' : ''}`}
              onClick={() => setActiveFile(file)}
            >
              <span className="tab-name">{file.name}</span>
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileClose(file.path);
                }}
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="editor-content">
        {activeFile ? (
          <MonacoEditor
            height="100%"
            language={activeFile.language || 'plaintext'}
            theme={theme}
            value={getEditorValue()}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'off',
            }}
          />
        ) : (
          <div className="editor-empty">
            <div className="empty-content">
              <h2>No file open</h2>
              <p>Select a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
