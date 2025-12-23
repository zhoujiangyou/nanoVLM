import { 
  FiFolder, 
  FiSearch, 
  FiGitBranch, 
  FiSettings,
  FiMessageSquare,
  FiTerminal
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ 
  activeView, 
  setActiveView, 
  showAIChat, 
  setShowAIChat,
  showTerminal,
  setShowTerminal 
}) => {
  const menuItems = [
    { id: 'explorer', icon: FiFolder, label: 'Explorer' },
    { id: 'search', icon: FiSearch, label: 'Search' },
    { id: 'git', icon: FiGitBranch, label: 'Source Control' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
            title={item.label}
          >
            <item.icon size={24} />
          </div>
        ))}
      </div>
      
      <div className="sidebar-bottom">
        <div
          className={`sidebar-item ${showAIChat ? 'active' : ''}`}
          onClick={() => setShowAIChat(!showAIChat)}
          title="AI Assistant"
        >
          <FiMessageSquare size={24} />
        </div>
        <div
          className={`sidebar-item ${showTerminal ? 'active' : ''}`}
          onClick={() => setShowTerminal(!showTerminal)}
          title="Terminal"
        >
          <FiTerminal size={24} />
        </div>
        <div
          className="sidebar-item"
          onClick={() => console.log('Settings')}
          title="Settings"
        >
          <FiSettings size={24} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
