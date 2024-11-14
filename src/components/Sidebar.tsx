import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, MessageCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import { useAuth } from './AuthProvider';
import { useDataMode } from '../context/DataModeContext';

const Sidebar = () => {
  const { isAuthenticated, loading } = useAuth();
  const { dataMode, setDataMode } = useDataMode();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ClipboardList, label: 'Planner', path: '/planner' },
    { icon: MessageCircle, label: 'Assistant', path: '/assistant' },
  ];

  const handleModeChange = () => {
    setDataMode(dataMode === 'sample' ? 'real' : 'sample');
    navigate('/select-mode');
  };

  return (
    <aside 
      className={`bg-[#1E2A47] min-h-screen flex flex-col py-8 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className={`px-6 mb-8 flex items-center justify-between ${
        isExpanded ? '' : 'px-4'
      }`}>
        {isExpanded ? (
          <h1 className="text-white text-xl font-bold">Study Assistant</h1>
        ) : (
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {isExpanded && dataMode === 'real' && !loading && (
        <div className="px-6 mb-8">
          <GoogleAuth />
        </div>
      )}

      <nav className="flex-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 ${
                isExpanded ? 'px-6' : 'px-4 justify-center'
              } py-3 transition-colors duration-200
              ${isActive 
                ? 'bg-[#56C1C7] text-white' 
                : 'text-gray-400 hover:bg-[#56C1C7]/10'}`
            }
            title={!isExpanded ? label : undefined}
          >
            <Icon className="w-5 h-5" />
            {isExpanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`mt-auto ${isExpanded ? 'px-6' : 'px-4'}`}>
        <button
          onClick={handleModeChange}
          className={`w-full flex items-center gap-3 ${
            isExpanded ? 'px-4' : 'px-2 justify-center'
          } py-2 text-gray-400 hover:text-white hover:bg-[#56C1C7]/10 rounded-lg transition-colors duration-200`}
          title={!isExpanded ? 'Change Data Mode' : undefined}
        >
          <Settings className="w-5 h-5" />
          {isExpanded && <span>Change Data Mode</span>}
        </button>

        {isExpanded && (
          <div className="mt-4 px-4 py-2 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              Current Mode: <span className="text-white font-medium capitalize">{dataMode}</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;