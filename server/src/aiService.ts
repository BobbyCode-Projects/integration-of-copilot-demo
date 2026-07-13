import { MeetingTranscript, MeetingAnalysis, CopilotTask } from './db';

/**
 * Heuristics-based parser simulating Microsoft Copilot transcription analysis.
 */
export const analyzeTranscript = (transcript: MeetingTranscript[]): MeetingAnalysis => {
  const tasks: CopilotTask[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];
  
  // Combine all transcript text for scan
  const fullText = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
  const fullTextLower = fullText.toLowerCase();

  // 1. Process specific tasks based on transcript contents (Heuristic parser)
  
  // Look for Login API / Authentication
  if (fullTextLower.includes('login api') || fullTextLower.includes('authentication') || fullTextLower.includes('auth')) {
    let assignee = 'John';
    if (fullTextLower.includes('dave')) assignee = 'Dave';
    else if (fullTextLower.includes('sarah')) assignee = 'Sarah';

    tasks.push({
      title: 'Develop Login API',
      assignee: assignee,
      priority: 'High',
      dueDate: 'Friday',
      status: 'To Do'
    });
  }

  // Look for Dashboard / design
  if (fullTextLower.includes('dashboard') || fullTextLower.includes('design')) {
    let assignee = 'Sarah';
    if (fullTextLower.includes('john')) assignee = 'John';
    else if (fullTextLower.includes('dave')) assignee = 'Dave';

    tasks.push({
      title: 'Dashboard Design',
      assignee: assignee,
      priority: 'Medium',
      dueDate: 'Monday',
      status: 'To Do'
    });
  }

  // Look for Testing / QA
  if (fullTextLower.includes('testing') || fullTextLower.includes('qa') || fullTextLower.includes('test')) {
    tasks.push({
      title: 'QA Security Testing',
      assignee: 'Mike',
      priority: 'Medium',
      dueDate: 'Next Monday',
      status: 'To Do'
    });
  }

  // Fallback default task if nothing was matched
  if (tasks.length === 0) {
    tasks.push({
      title: 'Review Project Requirements',
      assignee: 'Alice',
      priority: 'Low',
      dueDate: 'Friday',
      status: 'To Do'
    });
  }

  // 2. Extract Risks
  if (fullTextLower.includes('delay') || fullTextLower.includes('blocked') || fullTextLower.includes('risk')) {
    risks.push('Possible integration delay due to external dependencies or blocker.');
  }
  
  if (fullTextLower.includes('login') || fullTextLower.includes('authentication')) {
    risks.push('Authentication delay if OAuth endpoints or token configurations are misaligned.');
  } else {
    risks.push('Lack of formal architecture spec may lead to scope creep.');
  }

  // 3. Formulate Recommendations
  if (tasks.some(t => t.title.includes('Login API'))) {
    recommendations.push('Complete the Login API before Friday to unblock front-end auth integration.');
  }
  if (tasks.some(t => t.title.includes('Testing'))) {
    recommendations.push('Begin security and regression testing on Monday.');
  }
  if (tasks.some(t => t.title.includes('Dashboard'))) {
    recommendations.push('Review Dashboard Design wireframes with product manager.');
  }
  
  recommendations.push('Establish a secondary sync for backend database connections.');

  // Create a beautiful, concise summary of the meeting
  let summary = 'The team aligned on the upcoming sprint deliverables. ';
  if (tasks.length > 0) {
    summary += `Copilot identified ${tasks.length} major action items, focusing on ${tasks.map(t => t.title).join(', ')}.`;
  } else {
    summary += 'Requirements are being refined, and no immediate hard tickets were committed.';
  }

  return {
    summary,
    tasks,
    risks,
    recommendations
  };
};
