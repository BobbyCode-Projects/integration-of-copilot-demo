import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('bhargav@enterprise.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid work or school account.');
      return;
    }
    
    setLoading(true);
    setError('');

    // Simulate login loading delay
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center px-6 transition-colors duration-200">
      {/* Glow effect */}
      <div className="absolute w-[450px] h-[450px] bg-ms-blue/10 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-xl shadow-xl"
      >
        {/* Microsoft Logo Simulation */}
        <div className="flex items-center gap-1 mb-6">
          <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
            <div className="bg-[#f25022]" />
            <div className="bg-[#7fba00]" />
            <div className="bg-[#00a4ef]" />
            <div className="bg-[#ffb900]" />
          </div>
          <span className="text-base font-semibold text-slate-500 dark:text-slate-400 pl-2">Microsoft</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Sign in</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">to access your Meeting Automation Workspace</p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Work, school, or personal Microsoft account
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded bg-transparent focus:outline-none focus:border-ms-blue dark:focus:border-blue-500 dark:text-slate-100"
              placeholder="someone@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded bg-transparent focus:outline-none focus:border-ms-blue dark:focus:border-blue-500 dark:text-slate-100 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Prompt Links */}
          <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center py-2">
            <span className="hover:underline cursor-pointer">Can't access your account?</span>
            <span className="hover:underline cursor-pointer">Sign in with a security key</span>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-ms-blue hover:bg-ms-blue-hover disabled:bg-ms-blue/50 text-white font-semibold text-sm rounded shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-ms-blue dark:text-slate-400 dark:hover:text-blue-400 underline transition-colors"
          >
            Back to landing page
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
