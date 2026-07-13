import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeamsMeeting from './pages/TeamsMeeting';
import CopilotAnalysis from './pages/CopilotAnalysis';
import JiraDashboard from './pages/JiraDashboard';
import SlackNotifications from './pages/SlackNotifications';
import TeamsActivityFeed from './pages/TeamsActivityFeed';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Protected Route wrapper component
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // prevent rendering flash of protected content
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/meeting" element={<ProtectedLayout><TeamsMeeting /></ProtectedLayout>} />
        <Route path="/copilot-analysis" element={<ProtectedLayout><CopilotAnalysis /></ProtectedLayout>} />
        <Route path="/jira" element={<ProtectedLayout><JiraDashboard /></ProtectedLayout>} />
        <Route path="/slack" element={<ProtectedLayout><SlackNotifications /></ProtectedLayout>} />
        <Route path="/teams-feed" element={<ProtectedLayout><TeamsActivityFeed /></ProtectedLayout>} />
        <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
