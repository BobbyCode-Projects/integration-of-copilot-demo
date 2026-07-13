import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Play,
  Send,
  UserCheck
} from 'lucide-react';
import { api, Meeting } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export const TeamsMeeting: React.FC = () => {
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [customText, setCustomText] = useState('');
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState('Alice (Manager)');
  const [seconds, setSeconds] = useState(0);
  
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Pre-defined transcript lines to roll in automatically
  const script = [
    { speaker: 'Alice (Manager)', text: 'Hello team, let us align on the Sprint 1 deliverables. We need to complete the Login API by Friday.' },
    { speaker: 'John', text: 'I will handle authentication. I can implement the JWT token verification endpoints.' },
    { speaker: 'Alice (Manager)', text: 'Excellent. Sarah, you will design the Dashboard layout.' },
    { speaker: 'Sarah', text: 'Sure, I will work on UI user flows and mockups. I should have them ready by Monday.' },
    { speaker: 'Mike (QA)', text: 'Sounds good. Security testing should begin next Monday.' },
  ];

  // Initialize a meeting simulation
  const startMeeting = async () => {
    try {
      const data = await api.createMeeting('Sprint Sync Meeting', ['John', 'Sarah', 'Mike (QA)', 'Alice (Manager)']);
      setMeeting(data);
      setSeconds(0);
      setMeetingEnded(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    startMeeting();
  }, []);

  // Time tracker
  useEffect(() => {
    if (meetingEnded || !meeting) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [meeting, meetingEnded]);

  // Feed transcript script lines automatically
  useEffect(() => {
    if (meetingEnded || !meeting) return;
    
    // Add lines at specific seconds
    const lineIndices = [2, 7, 12, 17, 22];
    
    const checkScript = setInterval(async () => {
      const currentSec = seconds;
      const scriptIndex = lineIndices.indexOf(currentSec);
      
      if (scriptIndex !== -1 && script[scriptIndex]) {
        const line = script[scriptIndex];
        setActiveSpeaker(line.speaker);
        try {
          const updated = await api.addTranscriptLine(meeting.id, line.speaker, line.text);
          setMeeting(updated);
        } catch (e) {
          console.error(e);
        }
      }
    }, 1000);

    return () => clearInterval(checkScript);
  }, [seconds, meeting, meetingEnded]);

  // Auto scroll transcript panel
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [meeting?.transcript]);

  // Format elapsed time
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Append user custom text
  const handleSendCustomText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || !meeting || meetingEnded) return;

    try {
      setActiveSpeaker('Bhargav (You)');
      const updated = await api.addTranscriptLine(meeting.id, 'Bhargav (You)', customText.trim());
      setMeeting(updated);
      setCustomText('');
    } catch (err) {
      console.error(err);
    }
  };

  // End Meeting Handler
  const handleEndMeeting = async () => {
    if (!meeting) return;
    try {
      const durationMins = Math.max(1, Math.ceil(seconds / 60));
      const ended = await api.endMeeting(meeting.id, durationMins);
      setMeeting(ended);
      setMeetingEnded(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Start analysis transition
  const handleAnalyzeClick = () => {
    if (!meeting) return;
    navigate(`/copilot-analysis?meetingId=${meeting.id}`);
  };

  const participants = [
    { name: 'Alice (Manager)', avatar: 'AM', color: 'bg-indigo-500', isSpeaking: activeSpeaker === 'Alice (Manager)' && !meetingEnded },
    { name: 'John (Developer)', avatar: 'JD', color: 'bg-blue-600', isSpeaking: activeSpeaker === 'John' && !meetingEnded },
    { name: 'Sarah (Designer)', avatar: 'SD', color: 'bg-pink-500', isSpeaking: activeSpeaker === 'Sarah' && !meetingEnded },
    { name: 'Mike (QA)', avatar: 'MQ', color: 'bg-amber-600', isSpeaking: activeSpeaker === 'Mike (QA)' && !meetingEnded },
    { name: 'Bhargav (You)', avatar: 'BU', color: 'bg-emerald-600', isSpeaking: activeSpeaker === 'Bhargav (You)' && !meetingEnded }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col gap-6">
      
      {/* Top Banner: Info and State */}
      <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-record" />
          <div>
            <h2 className="text-sm font-bold">{meeting?.title || 'Active Session'}</h2>
            <p className="text-[10px] text-slate-400">Recording & Transcribing active via Microsoft Copilot</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            {formatTime(seconds)}
          </span>
          <span className="text-[10px] bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2 py-1 rounded font-semibold tracking-wider uppercase">
            Copilot Connected
          </span>
        </div>
      </div>

      {/* Grid: Call Layout and Sidebar */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Meeting Call Participants Video Layout */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden relative shadow-lg">
          
          <div className="flex-1 p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-fr">
            {participants.map((person, idx) => (
              <div 
                key={idx}
                className={`relative rounded-xl overflow-hidden flex flex-col items-center justify-center bg-slate-800 border-2 transition-all ${
                  person.isSpeaking 
                    ? 'border-emerald-500 shadow-md shadow-emerald-500/20 scale-[1.02]' 
                    : 'border-slate-700'
                }`}
              >
                {/* Speaking Badge */}
                {person.isSpeaking && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                    Speaking
                  </span>
                )}
                
                {/* Video Placeholder */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-full ${person.color} text-white flex items-center justify-center font-bold text-lg shadow-inner`}>
                    {person.avatar}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{person.name}</span>
                </div>

                {/* Animated mic indicator */}
                <div className="absolute bottom-3 right-3 p-1 bg-slate-950/60 rounded">
                  {person.isSpeaking ? (
                    <div className="flex gap-0.5 items-end h-3 w-4">
                      <span className="w-0.5 bg-emerald-400 animate-[bounce_0.8s_infinite]" />
                      <span className="w-0.5 bg-emerald-400 animate-[bounce_0.5s_infinite]" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-emerald-400 animate-[bounce_0.7s_infinite]" style={{ animationDelay: '0.4s' }} />
                    </div>
                  ) : (
                    <Mic className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Teams Video Controls */}
          <div className="h-16 bg-slate-950/90 border-t border-slate-800 px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-2.5 rounded-lg border text-white transition-colors cursor-pointer ${isMuted ? 'bg-red-600 border-red-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsCamOff(!isCamOff)} 
                className={`p-2.5 rounded-lg border text-white transition-colors cursor-pointer ${isCamOff ? 'bg-red-600 border-red-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
              >
                {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {participants.length} online
              </span>
            </div>

            <div>
              {!meetingEnded ? (
                <button
                  onClick={handleEndMeeting}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 cursor-pointer active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Meeting
                </button>
              ) : (
                <button
                  onClick={startMeeting}
                  className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-all cursor-pointer active:scale-95"
                >
                  Restart Call
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Transcript Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          {/* Header */}
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50">
            <MessageSquare className="w-4 h-4 text-ms-blue" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Live Teams Transcript</h3>
          </div>

          {/* Transcript Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {meeting?.transcript && meeting.transcript.length > 0 ? (
              meeting.transcript.map((line, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`font-bold ${
                      line.speaker.includes('You') 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-ms-blue dark:text-blue-400'
                    }`}>{line.speaker}</span>
                    <span className="text-slate-400 dark:text-slate-500">{line.timestamp}</span>
                  </div>
                  <p className="text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 leading-relaxed text-slate-700 dark:text-slate-300">
                    {line.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-slate-400 dark:text-slate-500 text-center space-y-2">
                <Video className="w-8 h-8 text-slate-300 dark:text-slate-700 animate-pulse" />
                <p className="text-xs">Meeting initiated.<br />Waiting for transcription stream...</p>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* User Custom Transcription Entry */}
          <form onSubmit={handleSendCustomText} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={meetingEnded ? 'Meeting ended' : 'Type custom transcript line...'}
              disabled={meetingEnded}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded bg-transparent focus:outline-none focus:border-ms-blue dark:focus:border-blue-500 disabled:opacity-50 dark:text-slate-200"
            />
            <button
              type="submit"
              disabled={meetingEnded || !customText.trim()}
              className="p-2 rounded bg-ms-blue hover:bg-ms-blue-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Prompt Card when Meeting ends */}
      <AnimatePresence>
        {meetingEnded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 text-center">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950/40 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto shadow-md">
                <Sparkles className="w-7 h-7 fill-purple-100 dark:fill-purple-950/40 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Meeting Finished Successfully</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  The session transcript has been saved. Microsoft Copilot is ready to analyze the dialogue, extract deliverables, assign priorities, and sync to Jira.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setMeetingEnded(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                >
                  Review Call Layout
                </button>
                <button
                  onClick={handleAnalyzeClick}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze with Copilot
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default TeamsMeeting;
