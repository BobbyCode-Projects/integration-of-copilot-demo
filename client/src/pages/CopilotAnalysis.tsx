import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckSquare, 
  AlertTriangle, 
  Lightbulb, 
  Send, 
  Users, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { api, Meeting } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const CopilotAnalysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('meetingId');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  const loadingStages = [
    'Accessing Teams transcript log...',
    'Parsing conversational context...',
    'Identifying task titles and action items...',
    'Matching assignees and extracting due dates...',
    'Structuring project risks and Copilot recommendations...',
    'Finalizing analysis results...'
  ];

  // Load meeting analysis
  useEffect(() => {
    if (!meetingId) {
      navigate('/dashboard');
      return;
    }

    const performAnalysis = async () => {
      // 1. Cycle loading text stages to feel extremely "smart" and interactive
      for (let i = 0; i < loadingStages.length; i++) {
        setLoadingStage(i);
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      try {
        // 2. Fetch the analysis
        const data = await api.analyzeMeeting(meetingId);
        setMeeting(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [meetingId]);

  // Sync tasks to Jira / Slack / Teams Activity
  const handleSync = async () => {
    if (!meetingId) return;
    try {
      setSyncing(true);
      await api.syncMeeting(meetingId);
      
      // Success triggers confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSyncSuccess(true);
      
      // Keep state for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/jira');
      }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const getPriorityStyles = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': 
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40';
      case 'Medium': 
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40';
      default: 
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Loading Screen Layout
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center p-8 space-y-6">
        <div className="relative flex justify-center items-center">
          {/* Animated pulsing outer rings */}
          <div className="absolute w-28 h-28 rounded-full border border-purple-500/30 dark:border-purple-500/20 animate-ping" />
          <div className="absolute w-20 h-20 rounded-full border border-indigo-500/40 dark:border-indigo-500/30 animate-pulse" />
          
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-ms-blue to-purple-600 flex items-center justify-center text-white shadow-xl shadow-ms-blue/20">
            <BrainCircuit className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Microsoft Copilot AI Processing</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 min-h-[1.5rem] animate-pulse">
            {loadingStages[loadingStage]}
          </p>
        </div>
      </div>
    );
  }

  const analysis = meeting?.analysis;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top action header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Analysis Session Complete
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1.5">
            Teams Meeting: {meeting?.title}
          </h1>
        </div>
        
        {!syncSuccess ? (
          <button
            onClick={handleSync}
            disabled={syncing || !analysis?.tasks?.length}
            className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-ms-blue to-purple-600 hover:from-ms-blue-hover hover:to-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-ms-blue/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing to Jira...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Sync Tasks to Jira & Slack
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        ) : (
          <div className="px-5 py-2.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-lg flex items-center gap-2 border border-emerald-200 dark:border-emerald-900/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Sync Complete! Opening Kanban...
          </div>
        )}
      </div>

      {/* Main Grid: Summary, Tasks, Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Summary & Extracted Tasks) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Summary Card */}
          <div className="glass-panel p-6 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-500" />
              Meeting Summary
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {analysis?.summary}
            </p>
            <div className="pt-2 flex items-center gap-6 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {meeting?.participants.length} Participants</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Duration: {meeting?.duration} Mins</span>
            </div>
          </div>

          {/* Action Items Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-ms-blue" />
              Extracted Action Items ({analysis?.tasks.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysis?.tasks.map((task, idx) => (
                <div key={idx} className="glass-card p-5 rounded-xl flex flex-col justify-between h-[180px] shadow-sm relative hover:scale-[1.01] hover:border-ms-blue/30 dark:hover:border-blue-500/30 transition-all">
                  
                  {/* Task details */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${getPriorityStyles(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Due: {task.dueDate}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                      {task.title}
                    </h4>
                  </div>

                  {/* Assignee Footer */}
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-inner border border-slate-200 dark:border-slate-700">
                        {getInitials(task.assignee)}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Assignee: <strong className="text-slate-700 dark:text-slate-200">{task.assignee}</strong>
                      </span>
                    </div>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-semibold">
                      To Do
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Risks & Recommendations) */}
        <div className="space-y-8">
          
          {/* Risks Panel */}
          <div className="glass-panel p-6 rounded-xl space-y-4 border-l-4 border-l-rose-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Identified Concerns & Risks
            </h3>
            
            <ul className="space-y-3">
              {analysis?.risks.map((risk, idx) => (
                <li key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations Panel */}
          <div className="glass-panel p-6 rounded-xl space-y-4 border-l-4 border-l-amber-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Copilot Recommendations
            </h3>
            
            <ul className="space-y-3">
              {analysis?.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                  <span className="text-amber-500 font-bold shrink-0">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
export default CopilotAnalysis;
