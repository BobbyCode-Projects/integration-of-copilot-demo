import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Video, 
  Kanban, 
  MessageSquare, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Database,
  RefreshCw,
  Clock
} from 'lucide-react';
import { api, AnalyticsMetrics, Meeting } from '../services/api';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const analytics = await api.getAnalytics();
      setMetrics(analytics.metrics);
      const meetingsData = await api.getMeetings();
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Failed to load dashboard statistics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const systemStatus = [
    { name: 'Microsoft Teams API Sync', status: 'Online', desc: 'Real-time transcripts, webhooks connected', icon: Video, color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/40' },
    { name: 'Jira Cloud Project API', status: 'Online', desc: 'Bidirectional ticket updates, custom webhook guards', icon: Kanban, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/40' },
    { name: 'Slack Bot Gateway', status: 'Online', desc: 'Simulated websocket connection active', icon: MessageSquare, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Welcome Back, Bhargav</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Here is the active status of your automated integration workflows.</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors disabled:opacity-50 dark:text-slate-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Reload System Status
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Simulated Meetings', value: metrics?.totalMeetings ?? '0', desc: 'Teams logs', icon: Video, color: 'border-l-purple-500' },
          { title: 'Jira Tickets Generated', value: metrics?.tasksGenerated ?? '0', desc: 'Sync pipeline', icon: Kanban, color: 'border-l-blue-500' },
          { title: 'Completed Deliverables', value: metrics?.completedTasks ?? '0', desc: 'Sprint board', icon: CheckCircle2, color: 'border-l-emerald-500' },
          { title: 'Pending Pipeline Items', value: metrics?.pendingTasks ?? '0', desc: 'In progress or queue', icon: AlertCircle, color: 'border-l-amber-500' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card p-6 rounded-xl border-l-4 ${card.color} shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{loading ? '...' : card.value}</h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{card.desc}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Integrations Status & Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Integration Hub Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-ms-blue" />
              Simulated Services Status
            </h3>
            
            <div className="space-y-4">
              {systemStatus.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <div className="flex gap-4 items-center">
                      <div className={`p-3 rounded-lg ${service.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{service.name}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{service.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{service.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Block */}
          <div className="p-6 bg-gradient-to-r from-ms-blue/5 to-indigo-500/5 dark:from-ms-blue/10 dark:to-indigo-500/10 border border-ms-blue/15 dark:border-ms-blue/20 rounded-xl">
            <h4 className="text-xs font-bold text-ms-blue dark:text-blue-400 flex items-center gap-1.5">
              💡 Sandbox Pipeline Guide
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              To test the integration loop:
              <br />
              1. Go to <strong>Teams Meeting</strong>, rolling transcripts are active, and click <strong>End Meeting</strong>.
              <br />
              2. Click <strong>Analyze with Copilot</strong> to trigger AI parsing.
              <br />
              3. View the task recommendations cards, and commit them.
              <br />
              4. Go to <strong>Jira Board</strong> to see the created tickets. Status shifts there will alert Slack and Teams automatically!
            </p>
          </div>
        </div>

        {/* Right Col: Quick Launch & Active Meeting Logs */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Actions Short-list</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/meeting')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-ms-blue hover:bg-ms-blue/5 dark:hover:bg-ms-blue/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all active:scale-[0.98] text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-500" />
                  Launch Teams Meeting Simulation
                </span>
                <Play className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/jira')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-ms-blue hover:bg-ms-blue/5 dark:hover:bg-ms-blue/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all active:scale-[0.98] text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Kanban className="w-4 h-4 text-blue-500" />
                  Access Jira Kanban Workspace
                </span>
                <Play className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/slack')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-ms-blue hover:bg-ms-blue/5 dark:hover:bg-ms-blue/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all active:scale-[0.98] text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Open Slack Channels Logs
                </span>
                <Play className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Meeting Archive Summary */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent Meetings
            </h3>
            
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {meetings.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No logged meetings found.</p>
              ) : (
                meetings.slice(0, 3).map((meet) => (
                  <div key={meet.id} className="p-3 border border-slate-200 dark:border-slate-800/80 rounded-lg space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                        {meet.title}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-semibold rounded-full ${
                        meet.status === 'running' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 animate-pulse'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {meet.status === 'running' ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500">
                      <span>{meet.duration} mins duration</span>
                      <span>{new Date(meet.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Dashboard;
