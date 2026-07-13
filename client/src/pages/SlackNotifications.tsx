import React, { useEffect, useState, useRef } from 'react';
import { 
  Hash, 
  Send, 
  Smile, 
  Paperclip, 
  MessageSquare,
  Sparkles,
  Users,
  Info
} from 'lucide-react';
import { api, SlackMessage } from '../services/api';

export const SlackNotifications: React.FC = () => {
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [text, setText] = useState('');
  const [activeChannel, setActiveChannel] = useState('#sprint-automation');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for messages in real-time
  const loadMessages = async () => {
    try {
      const data = await api.getSlackMessages();
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2500); // refresh every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const sent = await api.sendSlackMessage('Bhargav (You)', text.trim(), activeChannel);
      setMessages(prev => [...prev, sent]);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const channels = [
    { name: '#sprint-automation', active: activeChannel === '#sprint-automation', desc: 'Copilot AI integrations feed' },
    { name: '#general', active: activeChannel === '#general', desc: 'General company topics' },
    { name: '#dev-chat', active: activeChannel === '#dev-chat', desc: 'Code talk and questions' }
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-900">
      
      {/* Slack Sidebar (channels list) */}
      <div className="w-64 bg-[#3F0E40] text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Workspace Title */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-[#522653]">
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-white">Enterprise Hub</span>
              <span className="text-[10px] text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                bhargav@workspace
              </span>
            </div>
          </div>

          {/* Channels Title */}
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs px-2 text-slate-400 font-bold uppercase tracking-wider">
                <span>Channels</span>
              </div>
              
              <nav className="space-y-0.5 mt-2">
                {channels.map((chan) => (
                  <button
                    key={chan.name}
                    onClick={() => setActiveChannel(chan.name)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-colors text-left ${
                      chan.active 
                        ? 'bg-[#1164A3] text-white' 
                        : 'hover:bg-[#350d36] text-slate-350 hover:text-white'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 opacity-60" />
                    <span className="truncate">{chan.name.substring(1)}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-4 border-t border-[#522653] text-[10px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1 text-slate-300">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">Bot Integration</span>
          </div>
          <p className="leading-relaxed">
            Changing a Jira ticket status triggers the Copilot bot to post a webhook alert here.
          </p>
        </div>
      </div>

      {/* Slack Chat Feed */}
      <div className="flex-1 flex flex-col justify-between min-w-0 bg-slate-50 dark:bg-slate-900/10">
        
        {/* Chat Feed Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-500" />
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeChannel.substring(1)}</h3>
              <p className="text-[10px] text-slate-400">
                {channels.find(c => c.name === activeChannel)?.desc}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> 5 members
            </span>
          </div>
        </div>

        {/* Messages Feed Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.filter(m => m.channel === activeChannel).map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 text-left">
              {/* Avatar placeholder */}
              <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                msg.isBot 
                  ? 'bg-gradient-to-tr from-ms-blue to-purple-600' 
                  : 'bg-slate-400 dark:bg-slate-700'
              }`}>
                {msg.sender.includes('Copilot') ? '🤖' : msg.sender.substring(0, 2).toUpperCase()}
              </div>

              {/* Message Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{msg.sender}</span>
                  {msg.isBot && (
                    <span className="bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 text-[8px] font-extrabold uppercase px-1 py-0.5 rounded tracking-wider">
                      App
                    </span>
                  )}
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm inline-block max-w-2xl">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col gap-1 focus-within:border-slate-400">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Send a message to ${activeChannel}`}
              rows={2}
              className="w-full resize-none bg-transparent border-none text-xs focus:outline-none focus:ring-0 dark:text-slate-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850/50 pt-2 text-slate-400">
              <div className="flex gap-2">
                <button type="button" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Smile className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <button
                type="submit"
                disabled={!text.trim()}
                className="px-3 py-1 bg-[#007a5a] hover:bg-[#006046] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                Send
              </button>
            </div>
          </div>
        </form>

      </div>

    </div>
  );
};
export default SlackNotifications;
