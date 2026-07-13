import fs from 'fs';
import path from 'path';

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
  duration: number; // minutes
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

export interface AppDatabase {
  meetings: Meeting[];
  tickets: JiraTicket[];
  slackMessages: SlackMessage[];
  teamsActivity: TeamsActivity[];
  settings: {
    latencyMs: number;
  };
}

const DB_FILE = path.join(__dirname, '..', 'db.json');

const getInitialData = (): AppDatabase => {
  const now = new Date();
  
  const formatDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  const getDayString = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return {
    meetings: [
      {
        id: 'meet-1',
        title: 'Project Kickoff Meeting',
        participants: ['John', 'Sarah', 'Dave', 'Alice (Manager)', 'Mike (QA)'],
        status: 'ended',
        duration: 45,
        createdAt: formatDate(5),
        transcript: [
          { speaker: 'Alice (Manager)', text: 'Welcome everyone to the Project Kickoff. Today we want to align on the scope.', timestamp: '10:00 AM' },
          { speaker: 'John', text: 'I can set up the basic backend skeleton by Friday.', timestamp: '10:05 AM' },
          { speaker: 'Sarah', text: 'And I will have the Figma mockups for the landing page ready by Monday.', timestamp: '10:10 AM' },
          { speaker: 'Dave', text: 'I will handle the repo creation and setting up the CI/CD pipeline.', timestamp: '10:12 AM' }
        ],
        analysis: {
          summary: 'Kickoff meeting aligning on initial project architecture and setup task distribution.',
          tasks: [
            { title: 'Create Backend Skeleton', assignee: 'John', priority: 'High', dueDate: 'Friday', status: 'Completed' },
            { title: 'Landing Page Figma Mockups', assignee: 'Sarah', priority: 'Medium', dueDate: 'Monday', status: 'Completed' },
            { title: 'Setup GitHub Repo and CI/CD', assignee: 'Dave', priority: 'High', dueDate: 'Wednesday', status: 'Completed' }
          ],
          risks: ['Figma design approvals might delay landing page development.'],
          recommendations: ['Confirm Figma designs on Monday morning.', 'Verify pipeline access for all developers.']
        }
      },
      {
        id: 'meet-2',
        title: 'Sprint Planning Sync',
        participants: ['John', 'Sarah', 'Dave', 'Alice (Manager)', 'Mike (QA)'],
        status: 'ended',
        duration: 30,
        createdAt: formatDate(2),
        transcript: [
          { speaker: 'Alice (Manager)', text: 'Let us plan the next sprint. Dave, how is the pipeline?', timestamp: '09:00 AM' },
          { speaker: 'Dave', text: 'The pipeline is fully functional. We can now deploy build drafts automatically.', timestamp: '09:03 AM' },
          { speaker: 'John', text: 'Great. I will start integrating authentication middleware next.', timestamp: '09:05 AM' },
          { speaker: 'Sarah', text: 'I will work on mobile application screen flows.', timestamp: '09:08 AM' }
        ],
        analysis: {
          summary: 'Sprint planning aligning on authentication integrations and mobile application prototyping.',
          tasks: [
            { title: 'Integrate Authentication Middleware', assignee: 'John', priority: 'High', dueDate: 'Thursday', status: 'Testing' },
            { title: 'Mobile App Mockups', assignee: 'Sarah', priority: 'Low', dueDate: 'Next Friday', status: 'To Do' }
          ],
          risks: ['OAuth provider configuration limits might block auth testing.'],
          recommendations: ['Register dev credentials early.', 'Coordinate mobile design patterns with web.']
        }
      }
    ],
    tickets: [
      {
        id: 'JIRA-101',
        title: 'Develop Login API',
        description: 'Create authentication endpoints and JWT verification logic for the security gateway.',
        assignee: 'John',
        sprint: 'Sprint 1',
        priority: 'High',
        dueDate: 'Friday',
        status: 'To Do',
        createdAt: formatDate(1),
        updatedAt: formatDate(1)
      },
      {
        id: 'JIRA-102',
        title: 'Dashboard Design',
        description: 'Create interactive high-fidelity user interface layouts for the central analytics workspace.',
        assignee: 'Sarah',
        sprint: 'Sprint 1',
        priority: 'Medium',
        dueDate: 'Monday',
        status: 'In Progress',
        createdAt: formatDate(1),
        updatedAt: formatDate(1)
      },
      {
        id: 'JIRA-103',
        title: 'Setup CI/CD Pipeline',
        description: 'Initialize GitHub Actions workflows to automate lints, tests, and web app container deployments.',
        assignee: 'Dave',
        sprint: 'Sprint 1',
        priority: 'High',
        dueDate: 'Wednesday',
        status: 'Completed',
        createdAt: formatDate(5),
        updatedAt: formatDate(3)
      },
      {
        id: 'JIRA-104',
        title: 'Integrate Authentication Middleware',
        description: 'Connect login endpoints to client router guards and route checks.',
        assignee: 'John',
        sprint: 'Sprint 1',
        priority: 'High',
        dueDate: 'Thursday',
        status: 'Testing',
        createdAt: formatDate(2),
        updatedAt: formatDate(1)
      },
      {
        id: 'JIRA-105',
        title: 'Mobile App Mockups',
        description: 'Formulate primary workflow wireframes for the companion Android/iOS application mockup dashboards.',
        assignee: 'Sarah',
        sprint: 'Sprint 2',
        priority: 'Low',
        dueDate: 'Next Friday',
        status: 'To Do',
        createdAt: formatDate(2),
        updatedAt: formatDate(2)
      }
    ],
    slackMessages: [
      {
        id: 'slack-msg-1',
        sender: '🤖 Copilot',
        text: '👋 Good morning team! I analyzed the Kickoff meeting and successfully generated 3 tasks in Jira (JIRA-103, JIRA-104, JIRA-105). Have a productive sprint!',
        timestamp: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: '#sprint-automation',
        isBot: true
      },
      {
        id: 'slack-msg-2',
        sender: 'Dave',
        text: 'Hey everyone, I just finalized the configuration workflows. The repo and CI/CD pipelines are fully online.',
        timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: '#sprint-automation'
      },
      {
        id: 'slack-msg-3',
        sender: '🤖 Copilot',
        text: '✅ Dave completed the task **Setup CI/CD Pipeline** (JIRA-103). Excellent work!',
        timestamp: new Date(Date.now() - 3600000 * 3.8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: '#sprint-automation',
        isBot: true
      },
      {
        id: 'slack-msg-4',
        sender: 'Sarah',
        text: 'Working on Dashboard designs now. Let me know if anyone has specific feature requests before I polish them.',
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: '#sprint-automation'
      }
    ],
    teamsActivity: [
      {
        id: 'teams-act-1',
        title: 'Meeting Completed',
        description: 'Meeting "Project Kickoff Meeting" ended. 3 tasks were created by Copilot.',
        type: 'meeting_ended',
        timestamp: '5 hours ago',
        user: 'Copilot'
      },
      {
        id: 'teams-act-2',
        title: 'Task In Progress',
        description: 'Sarah started work on JIRA-102 (Dashboard Design).',
        type: 'task_start',
        timestamp: '2 hours ago',
        user: 'Sarah'
      },
      {
        id: 'teams-act-3',
        title: 'Task Completed',
        description: 'Dave moved JIRA-103 (Setup CI/CD Pipeline) to Completed.',
        type: 'task_complete',
        timestamp: '1 hour ago',
        user: 'Dave'
      }
    ],
    settings: {
      latencyMs: 1000
    }
  };
};

export const getDatabase = (): AppDatabase => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialData();
    saveDatabase(initialData);
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading database, resetting...', error);
    const initialData = getInitialData();
    saveDatabase(initialData);
    return initialData;
  }
};

export const saveDatabase = (data: AppDatabase): void => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

export const resetDatabase = (): AppDatabase => {
  const initialData = getInitialData();
  saveDatabase(initialData);
  return initialData;
};
