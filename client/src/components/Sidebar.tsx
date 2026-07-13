import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Kanban, 
  MessageSquare, 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear mock auth
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/meeting', label: 'Teams Meeting', icon: Video },
    { to: '/jira', label: 'Jira Dashboard', icon: Kanban },
    { to: '/slack', label: 'Slack Notifications', icon: MessageSquare },
    { to: '/teams-feed', label: 'Teams Activity Feed', icon: Activity },
    { to: '/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between glass-panel sticky top-0 shrink-0">
      <div className="flex flex-col">
        {/* Header / Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-ms-blue flex items-center justify-center text-white font-bold shadow-md shadow-ms-blue/30">
            M
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1">
              Copilot Hub <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 animate-pulse" />
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Enterprise Automation</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                  ${isActive 
                    ? 'bg-ms-blue/10 text-ms-blue dark:bg-ms-blue/20 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active vertical line indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r bg-ms-blue dark:bg-blue-400" />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-ms-blue dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
