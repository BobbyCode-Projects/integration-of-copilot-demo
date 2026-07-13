import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Sparkles, 
  Video, 
  Kanban, 
  MessageSquare, 
  Activity, 
  ArrowRight, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const steps = [
    { icon: Video, title: '1. Teams Meeting', desc: 'Auto-transcribe conversations' },
    { icon: Sparkles, title: '2. Copilot Parsing', desc: 'AI extracts action items & due dates' },
    { icon: Kanban, title: '3. Jira Ticket', desc: 'Auto-create sprint issues' },
    { icon: MessageSquare, title: '4. Chat Notifications', desc: 'Push logs instantly to Slack & Teams' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      {/* Navbar */}
      <nav className="h-16 px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-ms-blue flex items-center justify-center text-white font-bold shadow-md shadow-ms-blue/30">
            M
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            AI Meeting Automation Hub
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-ms-blue hover:bg-ms-blue-hover shadow-md shadow-ms-blue/20 transition-all active:scale-95"
        >
          Portal Login
        </button>
      </nav>

      {/* Main Hero */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* Glow Element */}
        <div className="absolute top-24 w-72 h-72 bg-ms-blue/10 dark:bg-ms-blue/5 rounded-full blur-3xl -z-10" />
        
        {/* Sparkle Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-ms-blue dark:text-blue-400 bg-ms-blue/10 dark:bg-ms-blue/20 border border-ms-blue/20 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 fill-ms-blue/10 dark:fill-blue-400/20" />
          Powered by Microsoft Copilot Automation Simulation
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight text-slate-900 dark:text-slate-50"
        >
          Automate Project Workflows directly from <span className="text-transparent bg-clip-text bg-gradient-to-r from-ms-blue to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Meeting Transcripts</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-6 max-w-2xl leading-relaxed"
        >
          Bridge the gap between meetings and execution. Simulates a complete automation pipeline connecting Microsoft Teams, Jira, and Slack. Watch transcripts transform into tickets automatically.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
        >
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-white bg-ms-blue hover:bg-ms-blue-hover shadow-lg shadow-ms-blue/20 transition-all flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
          >
            Launch Automation Demo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('workflow-steps');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-slate-500" />
            Watch Workflow
          </button>
        </motion.div>

        {/* Workflow Timeline Section */}
        <section id="workflow-steps" className="w-full mt-24 py-8 scroll-mt-20">
          <h3 className="text-xl font-bold mb-10 text-slate-800 dark:text-slate-200">The Automation Pipeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:translate-y-[-4px] transition-transform duration-200 relative group"
                >
                  {/* Connect Line */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute left-[80%] top-[40px] w-[40%] h-0.5 border-t border-dashed border-slate-300 dark:border-slate-800 z-10" />
                  )}
                  <div className="w-12 h-12 rounded-xl bg-ms-blue/10 dark:bg-ms-blue/20 text-ms-blue dark:text-blue-400 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Core Value Props */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full text-left">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Zero API Keys Required</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Run immediately in any sandbox environment. Uses simulated databases and intelligent heuristics to mock API connections.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Bidirectional State Updates</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Updating Jira statuses triggers instant Slack alerts and Microsoft Teams activity logs in real-time, matching mock webhook layouts.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Fluent UI Aesthetic Design</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Crafted with a modern Microsoft-inspired style including glassmorphism, responsive components, and beautiful analytics.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="h-16 px-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-600">
        <span>© 2026 AI Meeting Hub Demo Inc. All rights reserved.</span>
        <span>Simulated Integration Platform</span>
      </footer>
    </div>
  );
};
export default LandingPage;
