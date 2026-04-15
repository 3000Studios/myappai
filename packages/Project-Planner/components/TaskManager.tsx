
import React, { useState, useMemo } from 'react';
import { ProjectTask, UserRole, ProjectStatus, Priority } from '../types';

interface TaskManagerProps {
  tasks: ProjectTask[];
  role: UserRole;
  onUpdateTask: (task: ProjectTask) => void;
  onCreateTask: (task: Partial<ProjectTask>) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, role, onUpdateTask, onCreateTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Feature',
    estimatedCost: 0,
    estimatedHours: 0
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      const matchCategory = categoryFilter === 'All' || task.category === categoryFilter;
      return matchStatus && matchPriority && matchCategory;
    });
  }, [tasks, statusFilter, priorityFilter, categoryFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTask(newTask);
    setNewTask({ title: '', description: '', priority: 'Medium', category: 'Feature', estimatedCost: 0, estimatedHours: 0 });
    setIsAdding(false);
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'High': return 'text-red-700 bg-red-100 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
      case 'Medium': return 'text-amber-800 bg-amber-100 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800';
      case 'Low': return 'text-emerald-800 bg-emerald-100 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  const getStatusColor = (s: ProjectStatus) => {
    switch(s) {
      case 'Completed': return 'bg-green-700 text-white shadow-sm';
      case 'In Progress': return 'bg-purple-800 text-white shadow-sm';
      case 'Pending Approval': return 'bg-gold-600 text-white shadow-sm';
      case 'To Do': return 'bg-slate-700 text-white shadow-sm';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  const categories = Array.from(new Set(tasks.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Cajun Project Stream</h2>
        {role === 'Owner' && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white font-black rounded-2xl shadow-xl shadow-purple-900/10 transition-all flex items-center gap-2 shine-btn"
          >
            {isAdding ? 'Close Drawer' : '+ Request Custom Task'}
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border-4 border-purple-50 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Request Title</label>
                <input 
                  required
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all font-bold text-slate-800"
                  placeholder="e.g., Update Online Menu Integration"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Description</label>
                <textarea 
                  rows={4}
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all font-bold text-slate-800"
                  placeholder="NOTE: Use national average benchmarks for estimated cost..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                <select 
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={newTask.category}
                  onChange={e => setNewTask({...newTask, category: e.target.value as any})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
                >
                  <option>Feature</option>
                  <option>Design</option>
                  <option>Technical</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Benchmark Budget ($)</label>
                <input 
                  type="number"
                  value={newTask.estimatedCost}
                  onChange={e => setNewTask({...newTask, estimatedCost: Number(e.target.value)})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Est. Hours</label>
                <input 
                  type="number"
                  value={newTask.estimatedHours}
                  onChange={e => setNewTask({...newTask, estimatedHours: Number(e.target.value)})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
             <button type="submit" className="bg-green-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-green-900/10 hover:bg-green-700 transition-all active:scale-95 shine-btn">
               Submit for Custom Quote
             </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status View</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full text-xs font-black p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="All">All Progress States</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
        </div>
        {(statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All') && (
          <button 
            onClick={() => { setStatusFilter('All'); setPriorityFilter('All'); setCategoryFilter('All'); }}
            className="text-xs font-black text-purple-600 hover:text-purple-700 pb-4 px-2"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col group hover:-translate-y-2">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              
              <h3 className="font-black text-slate-900 dark:text-white text-xl group-hover:text-purple-700 transition-colors mb-2 leading-tight">{task.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3 font-medium leading-relaxed">{task.description}</p>
              
              <div className="pt-6 border-t-2 border-slate-50 dark:border-slate-700 grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-700/50">
                   <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Benchmark Cost</span>
                   <span className="text-lg font-black text-slate-800 dark:text-slate-100">${task.actualCost} <span className="text-[10px] text-slate-400 font-bold">/ ${task.estimatedCost}</span></span>
                 </div>
                 <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-700/50">
                   <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Benchmark</span>
                   <span className="text-lg font-black text-slate-800 dark:text-slate-100">{task.actualHours}h <span className="text-[10px] text-slate-400 font-bold">/ {task.estimatedHours}h</span></span>
                 </div>
              </div>
              
              <div className="mb-6 px-1">
                <p className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.1em] text-center leading-tight">
                  Pricing above reflects national benchmarks and is NOT a final quote.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                {role === 'Developer' ? (
                  <div className="w-full grid grid-cols-2 gap-3">
                     <select 
                      value={task.status}
                      onChange={e => onUpdateTask({...task, status: e.target.value as ProjectStatus})}
                      className="text-xs font-black p-4 bg-slate-900 text-white dark:bg-slate-700 rounded-2xl border-none focus:ring-4 focus:ring-green-500 transition-all outline-none"
                     >
                       <option>To Do</option>
                       <option>In Progress</option>
                       <option>Completed</option>
                       <option>Deferred</option>
                     </select>
                     <button 
                      onClick={() => onUpdateTask({...task, actualHours: task.actualHours + 1})}
                      className="text-xs font-black py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-900/10 shine-btn"
                     >
                       +1h Effort
                     </button>
                  </div>
                ) : (
                  task.status === 'Pending Approval' && (
                    <button 
                      onClick={() => onUpdateTask({...task, status: 'To Do'})}
                      className="w-full py-4 bg-purple-700 text-white text-xs font-black rounded-2xl hover:bg-purple-800 transition-all shadow-xl shadow-purple-900/20 active:scale-95 shine-btn"
                    >
                      Approve for Quote
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-4">🌶️</div>
            <p className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.3em]">No items in this bucket</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
