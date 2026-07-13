import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  User, 
  Calendar, 
  AlertCircle,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { api, JiraTicket } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export const JiraDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  
  // Manual Ticket Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignee, setNewAssignee] = useState('John');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDueDate, setNewDueDate] = useState('Friday');
  const [creating, setCreating] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getTickets();
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update status (Fires Express backend and triggers Slack/Teams notifications)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateTicketStatus(id, newStatus);
      // Update local state list
      setTickets(prev => prev.map(t => t.id === id ? updated : t));
    } catch (e) {
      console.error(e);
    }
  };

  // Submit manual ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    try {
      setCreating(true);
      const created = await api.createTicket({
        title: newTitle.trim(),
        description: newDescription.trim(),
        assignee: newAssignee,
        priority: newPriority,
        dueDate: newDueDate,
        status: 'To Do'
      });
      setTickets(prev => [created, ...prev]);
      
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewAssignee('John');
      setNewPriority('Medium');
      setNewDueDate('Friday');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // Filter logic
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchesAssignee = filterAssignee ? t.assignee === filterAssignee : true;
    const matchesPriority = filterPriority ? t.priority === filterPriority : true;
    return matchesSearch && matchesAssignee && matchesPriority;
  });

  // Extract unique assignees for dropdown filter
  const allAssignees = Array.from(new Set(tickets.map(t => t.assignee)));

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Title', 'Assignee', 'Sprint', 'Priority', 'Due Date', 'Status', 'Created At'];
    const rows = filteredTickets.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.assignee,
      t.sprint,
      t.priority,
      t.dueDate,
      t.status,
      new Date(t.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jira-tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityBadge = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
      case 'Medium': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      default: return 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30';
    }
  };

  // Organize columns
  const columns = [
    { title: 'To Do', status: 'To Do', border: 'border-t-slate-400' },
    { title: 'In Progress', status: 'In Progress', border: 'border-t-blue-500' },
    { title: 'Testing', status: 'Testing', border: 'border-t-purple-500' },
    { title: 'Completed', status: 'Completed', border: 'border-t-emerald-500' }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Simulated Jira Kanban Board</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage project task status cards. Updating ticket status notifies Slack and Teams activity automatically.</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-initial px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center gap-2 dark:text-slate-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-initial px-4 py-2 bg-ms-blue hover:bg-ms-blue-hover text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-ms-blue/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by title or ID..."
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-transparent focus:outline-none focus:border-ms-blue dark:focus:border-blue-500 dark:text-slate-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 w-full sm:w-auto shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Assignee filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 focus:outline-none dark:text-slate-300"
          >
            <option value="">All Assignees</option>
            {allAssignees.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 focus:outline-none dark:text-slate-300"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Reset Filters */}
          {(filterAssignee || filterPriority || search) && (
            <button
              onClick={() => { setSearch(''); setFilterAssignee(''); setFilterPriority(''); }}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 shrink-0 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter(t => t.status === col.status);
          
          return (
            <div 
              key={col.status} 
              className={`bg-slate-100/60 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 min-h-[500px] flex flex-col space-y-4`}
            >
              {/* Column title and header border line */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {col.title}
                </span>
                <span className="bg-slate-200 dark:bg-slate-850 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 rounded-full">
                  {colTickets.length}
                </span>
              </div>

              {/* Tickets scrollable stack */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                {colTickets.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-[10px] font-semibold text-center">
                    No tickets in queue
                  </div>
                ) : (
                  colTickets.map((ticket) => (
                    <motion.div
                      layoutId={ticket.id}
                      key={ticket.id}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm space-y-4 hover:border-ms-blue/30 dark:hover:border-blue-500/30 transition-all group"
                    >
                      {/* Ticket header */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-ms-blue dark:text-blue-400 uppercase tracking-wide">{ticket.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-ms-blue dark:group-hover:text-blue-400 transition-colors">
                          {ticket.title}
                        </h4>
                      </div>

                      {/* Ticket footer and action buttons */}
                      <div className="border-t border-slate-100 dark:border-slate-850/50 pt-3 flex flex-col gap-2.5">
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {ticket.assignee}
                          </span>
                          <span className="flex items-center gap-1 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {ticket.dueDate}
                          </span>
                        </div>

                        {/* Transition button */}
                        <div>
                          {ticket.status === 'To Do' && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, 'In Progress')}
                              className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-ms-blue hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-slate-600 dark:text-slate-300 font-semibold text-[10px] rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Start Progress
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {ticket.status === 'In Progress' && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, 'Testing')}
                              className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-700 text-slate-600 dark:text-slate-300 font-semibold text-[10px] rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Move to Testing
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {ticket.status === 'Testing' && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, 'Completed')}
                              className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-700 text-slate-600 dark:text-slate-300 font-semibold text-[10px] rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Mark Complete
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {ticket.status === 'Completed' && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, 'To Do')}
                              className="w-full py-1 border border-dashed border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 font-semibold text-[9px] rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Reopen Ticket
                            </button>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Ticket Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl relative space-y-6"
            >
              {/* Close button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Create Jira Sprint Ticket</h3>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Ticket Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Implement Login API endpoint"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded bg-transparent focus:outline-none focus:border-ms-blue dark:focus:border-blue-500 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide details about the ticket deliverables..."
                    rows={3}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded bg-transparent focus:outline-none focus:border-ms-blue dark:focus:border-blue-500 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Assignee
                    </label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded bg-transparent dark:bg-slate-900 focus:outline-none dark:text-slate-200"
                    >
                      <option value="John">John</option>
                      <option value="Sarah">Sarah</option>
                      <option value="Dave">Dave</option>
                      <option value="Mike">Mike</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Priority
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-2 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded bg-transparent dark:bg-slate-900 focus:outline-none dark:text-slate-200"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. Friday or Monday"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded bg-transparent focus:outline-none focus:border-ms-blue dark:focus:border-blue-500 dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-2.5 bg-ms-blue hover:bg-ms-blue-hover text-white font-bold text-xs rounded transition-all active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Ticket'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default JiraDashboard;
