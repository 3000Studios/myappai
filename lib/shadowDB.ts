const shadowDB = {
  getPendingTasks: async () => [],
  saveTask: async (_task: unknown) => ({ id: 'task-1' }),
  updateTask: async (_id: string, _updates: unknown) => ({ success: true }),
};
export default shadowDB;

