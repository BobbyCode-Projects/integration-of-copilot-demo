const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

export interface MeetingTranscript {
  speaker: string;
  text: string;
  timestamp: string;
}

export interface CopilotTask {
  title: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Testing' | 'Completed';
}

export interface MeetingAnalysis {
  summary: string;
  tasks: CopilotTask[];
  risks: string[];
  recommendations: string[];
}

export interface Meeting {
  id: string;
  title: string;
  participants: string[];
  status: 'running' | 'ended';
  transcript: MeetingTranscript[];
  duration: number;
  analysis: MeetingAnalysis | null;
  createdAt: string;
}

export interface JiraTicket {
  id: string;
  title: string;
  description: string;
  assignee: string;
  sprint: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Testing' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface SlackMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  channel: string;
  isBot?: boolean;
}

export interface TeamsActivity {
  id: string;
  title: string;
  description: string;
  type: 'task_complete' | 'task_start' | 'meeting_ended' | 'sprint_update' | 'task_testing';
  timestamp: string;
  user: string;
}

export interface AnalyticsMetrics {
  totalMeetings: number;
  tasksGenerated: number;
  completedTasks: number;
  pendingTasks: number;
  averageCompletionTime: string;
  highPriorityTasks: number;
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics;
  charts: {
    statusData: { name: string; value: number }[];
    assigneeData: {
      name: string;
      'To Do': number;
      'In Progress': number;
      'Testing': number;
      'Completed': number;
      total: number;
    }[];
    priorityData: { name: string; value: number }[];
  };
}

export const api = {
  // Meetings
  async getMeetings(): Promise<Meeting[]> {
    const res = await fetch(`${API_BASE}/meetings`);
    return res.json();
  },
  
  async createMeeting(title: string, participants: string[]): Promise<Meeting> {
    const res = await fetch(`${API_BASE}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, participants }),
    });
    return res.json();
  },
  
  async addTranscriptLine(id: string, speaker: string, text: string): Promise<Meeting> {
    const res = await fetch(`${API_BASE}/meetings/${id}/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speaker, text }),
    });
    return res.json();
  },
  
  async endMeeting(id: string, duration?: number): Promise<Meeting> {
    const res = await fetch(`${API_BASE}/meetings/${id}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration }),
    });
    return res.json();
  },
  
  async analyzeMeeting(id: string): Promise<Meeting> {
    const res = await fetch(`${API_BASE}/meetings/${id}/analyze`, {
      method: 'POST',
    });
    return res.json();
  },
  
  async syncMeeting(id: string): Promise<{ message: string; tickets: JiraTicket[] }> {
    const res = await fetch(`${API_BASE}/meetings/${id}/sync`, {
      method: 'POST',
    });
    return res.json();
  },

  // Jira
  async getTickets(): Promise<JiraTicket[]> {
    const res = await fetch(`${API_BASE}/jira/tickets`);
    return res.json();
  },
  
  async createTicket(ticket: Partial<JiraTicket>): Promise<JiraTicket> {
    const res = await fetch(`${API_BASE}/jira/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    return res.json();
  },
  
  async updateTicketStatus(id: string, status: string): Promise<JiraTicket> {
    const res = await fetch(`${API_BASE}/jira/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Slack
  async getSlackMessages(): Promise<SlackMessage[]> {
    const res = await fetch(`${API_BASE}/slack/messages`);
    return res.json();
  },
  
  async sendSlackMessage(sender: string, text: string, channel?: string): Promise<SlackMessage> {
    const res = await fetch(`${API_BASE}/slack/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, text, channel }),
    });
    return res.json();
  },

  // Teams Activity
  async getTeamsActivity(): Promise<TeamsActivity[]> {
    const res = await fetch(`${API_BASE}/teams/activity`);
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
  },

  // Settings
  async resetDatabase(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/settings/reset`, { method: 'POST' });
    return res.json();
  },
  
  async updateLatency(latencyMs: number): Promise<{ latencyMs: number }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latencyMs }),
    });
    return res.json();
  }
};
