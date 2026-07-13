import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Link2, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Map routes to human readable titles
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard': return 'Automation Workspace';
      case '/meeting': return 'Teams Meeting Workspace';
      case '/copilot-analysis': return 'Microsoft Copilot Analysis';
      case '/jira': return 'Jira Kanban Workspace';
      case '/slack': return 'Slack Notification channel';
      case '/teams-feed': return 'Microsoft Teams Activity Feed';
      case '/analytics': return 'Performance & Analytics';
      case '/settings': return 'System Configurations';
      default: return 'AI Meeting Automation Hub';
    }
  };

  const currentTitle = getPageTitle(location.pathname);

  // Simulation pipeline connection badges
  const connections = [
    { name: 'Copilot', color: 'bg-indigo-500' },
    { name: 'Teams', color: 'bg-purple-600' },
    { name: 'Jira', color: 'bg-blue-600' },
    { name: 'Slack', color: 'bg-emerald-600' }
  ];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 glass-panel flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left: Page Title */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          {currentTitle}
          {location.pathname === '/copilot-analysis' && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/40 rounded-full">
              <Sparkles className="w-2.5 h-2.5 fill-purple-600 dark:fill-purple-400" /> AI Generated
            </span>
          )}
        </h2>
      </div>

      {/* Right: Actions (Badges, Theme, User) */}
      <div className="flex items-center gap-6">
        {/* Pipeline Health Indicators */}
        <div className="hidden lg:flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-6">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Link2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Integrations:</span>
          </div>
          <div className="flex gap-2">
            {connections.map((conn) => (
              <span 
                key={conn.name} 
                className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${conn.color} animate-pulse`} />
                {conn.name}
              </span>
            ))}
          </div>
        </div>

        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ms-blue/20 text-ms-blue font-bold flex items-center justify-center text-xs border border-ms-blue/30 shadow-inner">
            BU
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bhargav User</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Project Architect</p>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
