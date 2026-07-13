import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Video, 
  Kanban, 
  CheckCircle2, 
  Play, 
  MessageSquare,
  Sparkles,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { api, TeamsActivity } from '../services/api';
import { motion } from 'framer-motion';

export const TeamsActivityFeed: React.FC = () => {
  const [feed, setFeed] = useState<TeamsActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    try {
      const data = await api.getTeamsActivity();
      setFeed(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 2500); // refresh every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  const getFeedIcon = (type: TeamsActivity['type']) => {
    switch (type) {
      case 'meeting_ended':
        return { icon: Video, color: 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30' };
      case 'task_start':
        return { icon: Play, color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30' };
      case 'task_testing':
        return { icon: MessageSquare, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30' };
      case 'task_complete':
        return { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30' };
      default:
        return { icon: Kanban, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700' };
    }
  };

  const getInitials = (name: string) => {
    if (name.includes('Copilot')) return '🤖';
    if (name.includes('Teams')) return '👥';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-900">
      
      {/* Teams App Bar Mockup */}
      <div className="w-16 bg-[#464775] text-slate-300 flex flex-col items-center justify-between py-4 shrink-0">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Active Activity Tab */}
          <div className="w-12 h-10 flex flex-col items-center justify-center text-white bg-slate-900/10 dark:bg-white/10 rounded-md cursor-pointer border-l-2 border-white">
            <Bell className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-bold">Activity</span>
          </div>

          <div className="w-12 h-10 flex flex-col items-center justify-center text-slate-350 hover:text-white rounded-md cursor-pointer transition-colors">
            <Video className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Calendar</span>
          </div>

          <div className="w-12 h-10 flex flex-col items-center justify-center text-slate-350 hover:text-white rounded-md cursor-pointer transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Chat</span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-inner">
          BU
        </div>
      </div>

      {/* Main Feed Content Area */}
      <div className="flex-1 flex flex-col justify-between min-w-0 bg-slate-50 dark:bg-slate-900/10">
        
        {/* Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Teams Activity Feed</h3>
          </div>

          <button
            onClick={loadFeed}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
            title="Reload Feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feed Notifications List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {loading && feed.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">Syncing notification stream...</p>
          ) : feed.length === 0 ? (
            <div className="h-44 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs text-center space-y-2">
              <Bell className="w-6 h-6 animate-bounce" />
              <p>No activity updates logged.<br />Change a ticket status in Jira to generate feeds!</p>
            </div>
          ) : (
            feed.map((item) => {
              const themeStyles = getFeedIcon(item.type);
              const Icon = themeStyles.icon;
              
              return (
                <div 
                  key={item.id} 
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm flex items-start justify-between gap-4 text-left group"
                >
                  <div className="flex items-start gap-4">
                    {/* Activity Left: User Initials Badge / Icon Badge */}
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shadow-inner">
                        {getInitials(item.user)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${themeStyles.color} shadow`}>
                        <Icon className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* Activity Middle: Text */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                        {item.user.includes('Copilot') && (
                          <span className="bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 text-[8px] font-extrabold uppercase px-1 py-0.5 rounded tracking-wide">
                            App
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Activity Right: Time & Action */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{item.timestamp}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-opacity">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
export default TeamsActivityFeed;
