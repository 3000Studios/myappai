const api = async (endpoint: string, body?: Record<string, unknown>) => {
  const res = await fetch(`/api/shadow/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : '{}',
  });

  return res.json();
};

const shadowClient = {
  exec: (command: string) => api('exec', { command }),
  updateFile: (filePath: string, content: string) => api('update-file', { filePath, content }),
  push: () => api('push'),
  siteAction: (action: string, target?: string, content?: string) =>
    api('site-action', { action, target, content }),

  async dispatch(task: Record<string, unknown>) {
    return await fetch('/api/shadow/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then((r) => r.json());
  },

  deploy() {
    return this.dispatch({ type: 'deploy' });
  },

  heal() {
    return this.dispatch({ type: 'heal' });
  },

  run(command: string) {
    return this.dispatch({ type: 'run', command });
  },
};

export default shadowClient;

