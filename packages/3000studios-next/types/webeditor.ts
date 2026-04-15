export interface GitHubConfig {
  pat: string;
  owner: string;
  repo: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'user' | 'ai' | 'system' | 'error' | 'success';
  message: string;
  details?: any;
}

export type CommandAction =
  | 'create_file'
  | 'update_file'
  | 'delete_file'
  | 'get_file'
  | 'list_files'
  | 'trigger_workflow'
  | 'generate_revenue_page'
  | 'unknown';

export interface CommandIntent {
  action: CommandAction;
  path?: string;
  content?: string;
  commit_message?: string;
  workflow_id?: string;
  branch?: string; // default to main
  reasoning?: string; // AI's explanation
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface RepoMemory {
  last_login: string;
  chat_history: { role: string; content: string; timestamp: string }[];
}
