import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import AIChat from './components/AIChat';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('explorer');
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [theme, setTheme] = useState('vs-dark');

  const handleFileOpen = (file) => {
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
  };

  const handleFileClose = (filePath) => {
    const newOpenFiles = openFiles.filter(f => f.path !== filePath);
    setOpenFiles(newOpenFiles);
    if (activeFile?.path === filePath) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || null);
    }
  };

  const handleFileSave = async (filePath, content) => {
    try {
      const response = await fetch('/api/files/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: filePath, content }),
      });
      
      if (response.ok) {
        console.log('File saved successfully');
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        showAIChat={showAIChat}
        setShowAIChat={setShowAIChat}
        showTerminal={showTerminal}
        setShowTerminal={setShowTerminal}
      />
      
      <div className="main-content">
        <div className="left-panel">
          {activeView === 'explorer' && (
            <FileExplorer onFileOpen={handleFileOpen} />
          )}
          {activeView === 'search' && (
            <div className="panel-content">
              <h2>Search</h2>
              <p>Search functionality coming soon...</p>
            </div>
          )}
        </div>

        <div className="editor-container">
          <div className="editor-area">
            <Editor
              openFiles={openFiles}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              onFileClose={handleFileClose}
              onFileSave={handleFileSave}
              theme={theme}
            />
          </div>
          
          {showTerminal && (
            <div className="terminal-area">
              <Terminal />
            </div>
          )}
        </div>

        {showAIChat && (
          <div className="right-panel">
            <AIChat />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
