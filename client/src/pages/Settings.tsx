import React, { useEffect, useState } from 'react';
import { 
  Settings as SettingsIcon, 
  RefreshCw, 
  Trash2, 
  CheckCircle,
  Network,
  Link2,
  Workflow
} from 'lucide-react';
import { api } from '../services/api';

export const Settings: React.FC = () => {
  const [latency, setLatency] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch initial latency settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const analytics = await api.getAnalytics();
        // Since analytics has metrics, we can also fetch latency from a quick status check
        // Or default it. Let's just set it to 1000 default and let backend handle the rest.
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  const handleLatencyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLatency(val);
    try {
      await api.updateLatency(val);
      showToast(`API Latency updated to ${val}ms`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset all mock databases? This deletes all completed tasks, new Slack messages, and custom meetings.')) return;
    
    try {
      setLoading(true);
      await api.resetDatabase();
      showToast('Database successfully reset to initial mock data.');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto text-left">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">System Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure workspace database states, simulated response latencies, and automation channels.</p>
      </div>

      {/* Floating success toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 px-4 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2 animate-bounce z-50">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Latency Simulator Control */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Network className="w-4 h-4 text-ms-blue" />
          Simulated API Latency
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Configure response delays on the backend to test how the frontend loads, displaying skeleton structures, loaders, and progress meters.
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-350">
            <span>Latency Delay</span>
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {latency}ms
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="3000"
            step="500"
            value={latency}
            onChange={handleLatencyChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ms-blue focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>0ms (Instant)</span>
            <span>1000ms (Normal)</span>
            <span>2000ms (Slow Network)</span>
            <span>3000ms (High Latency)</span>
          </div>
        </div>
      </div>

      {/* Webhook Channels Detail */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-purple-600" />
          Webhook Integrations Endpoint Info
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The following simulated endpoints are listening to changes on the Jira boards and pushing payloads synchronously.
        </p>
        
        <div className="space-y-3 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-purple-500" /> Slack Incoming Webhook</span>
              <span className="text-emerald-600 font-bold uppercase tracking-wider text-[8px]">Mock Connected</span>
            </div>
            <code className="text-[10px] text-slate-400 block break-all leading-normal font-mono">
              https://hooks.slack.mock/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
            </code>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-blue-500" /> Microsoft Teams Connector Hook</span>
              <span className="text-emerald-600 font-bold uppercase tracking-wider text-[8px]">Mock Connected</span>
            </div>
            <code className="text-[10px] text-slate-400 block break-all leading-normal font-mono">
              https://enterprise.webhook.office.mock/webhookb2/a0000000-0000-0000-0000-000000000000@00000000-0000
            </code>
          </div>
        </div>
      </div>

      {/* Factory Reset Database */}
      <div className="glass-panel p-6 rounded-xl space-y-4 border border-red-200/50 dark:border-red-950/30">
        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Factory Reset Data Store
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Warning: Resetting the database will delete all custom Teams meetings transcripts, simulated Slack conversation entries, and manual Jira sprint tickets, restoring the platform back to its factory seed configuration.
        </p>
        
        <div className="pt-2">
          <button
            onClick={handleResetDatabase}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-bold text-xs rounded-lg transition-all active:scale-[0.98] flex items-center gap-2 shadow-md shadow-red-600/10 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reset Database & Sync States
          </button>
        </div>
      </div>

    </div>
  );
};
export default Settings;
