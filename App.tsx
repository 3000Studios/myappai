
import React, { useState, useCallback, useEffect } from 'react';
import { UserRole, ProjectTask, Notice, ProjectStatus, ShoppingItem } from './types';
import { INITIAL_TASKS, SHOPPING_LIST_ITEMS } from './constants';
import ProjectTracker from './components/ProjectTracker';
import NoticeBoard from './components/NoticeBoard';
import TaskManager from './components/TaskManager';
import ShoppingList from './components/ShoppingList';
import ChatBot from './components/ChatBot';
import FileVault from './components/FileVault';
import { getAiSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('Owner');
  const [tasks, setTasks] = useState<ProjectTask[]>(INITIAL_TASKS);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(SHOPPING_LIST_ITEMS);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // Starts on Dark Mode as requested
  const [files, setFiles] = useState<{name: string, date: string, size: string, uploadedBy: string}[]>([]);

  // Sync dark mode class with state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addNotice = useCallback((content: string) => {
    const newNotice: Notice = {
      id: Date.now().toString(),
      author: role === 'Owner' ? 'Jane (Owner)' : 'Lead Developer',
      role,
      content,
      timestamp: new Date()
    };
    setNotices(prev => [...prev, newNotice]);
  }, [role]);

  const handleUpdateTask = (updatedTask: ProjectTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    addNotice(`Updated task: ${updatedTask.title} to ${updatedTask.status}`);
  };

  const handleCreateTask = (newTask: Partial<ProjectTask>) => {
    const task: ProjectTask = {
      id: Date.now().toString(),
      title: newTask.title || 'Untitled Request',
      description: newTask.description || '',
      estimatedCost: newTask.estimatedCost || 0,
      actualCost: 0,
      estimatedHours: newTask.estimatedHours || 0,
      actualHours: 0,
      status: role === 'Owner' ? 'Pending Approval' : 'To Do',
      priority: newTask.priority || 'Medium',
      category: newTask.category || 'Feature',
      createdBy: role
    };
    setTasks(prev => [task, ...prev]);
    addNotice(`${role} created new task: ${task.title}`);
  };

  const handleFileUpload = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).map(f => ({
      name: f.name,
      date: new Date().toLocaleDateString(),
      size: (f.size / 1024).toFixed(1) + ' KB',
      uploadedBy: role
    }));
    setFiles(prev => [...newFiles, ...prev]);
    addNotice(`New file(s) uploaded for review: ${newFiles.map(f => f.name).join(', ')}`);
  };

  const toggleShoppingItem = (id: string) => {
    if (role !== 'Owner') return;
    setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, isChecked: !i.isChecked } : i));
  };

  const approveShoppingUpgrades = () => {
    const selected = shoppingItems.filter(i => i.isChecked);
    selected.forEach(item => {
      handleCreateTask({
        title: item.title,
        description: item.description,
        estimatedCost: item.cost,
        category: item.category as any,
        priority: 'Medium'
      });
    });
    setShoppingItems(prev => prev.map(i => ({ ...i, isChecked: false })));
    addNotice(`Owner approved ${selected.length} items. NOTE: Prices used were National Averages and are NOT finalized quotes.`);
  };

  const fetchAiSuggestions = async () => {
    setAiLoading(true);
    const suggestions = await getAiSuggestions(tasks);
    setAiSuggestions(suggestions);
    setAiLoading(false);
  };

  const acceptAiSuggestion = (suggestion: any) => {
    handleCreateTask(suggestion);
    setAiSuggestions(prev => prev.filter(s => s.title !== suggestion.title));
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100 selection:bg-purple-900' : 'bg-slate-50 text-slate-900 selection:bg-gold-200'}`}>
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-purple-600 to-gold-500 z-50 shadow-sm"></div>
      
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-8 py-5 flex justify-between items-center shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-purple-900/20 border-2 border-purple-500">CM</div>
          <div>
            <h1 className="text-2xl font-black leading-none tracking-tighter">
              The Cajun Menu <span className="text-gold-500">Planning Page</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Mockup Domain: TheCajunmenu.site</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-gold-400 hover:bg-slate-700' : 'bg-slate-100 text-purple-600 hover:bg-slate-200'}`}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <div className={`flex p-1.5 rounded-2xl border shadow-inner transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
            <button 
              onClick={() => setRole('Owner')}
              className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${role === 'Owner' ? (isDarkMode ? 'bg-slate-700 text-purple-400 shadow-lg' : 'bg-white text-purple-700 shadow-lg') : 'text-slate-500 hover:text-slate-300'}`}
            >
              Owner
            </button>
            <button 
              onClick={() => setRole('Developer')}
              className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${role === 'Developer' ? (isDarkMode ? 'bg-slate-700 text-green-400 shadow-lg' : 'bg-white text-green-700 shadow-lg') : 'text-slate-500 hover:text-slate-300'}`}
            >
              Developer
            </button>
          </div>
        </div>
      </header>

      {/* Global Disclaimer Bar */}
      <div className="bg-amber-500 text-black py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] shadow-lg relative z-30">
        ⚠️ All prices listed are National Averages and NOT final quoted prices. Estimates are for benchmark purposes only.
      </div>

      <main className="flex flex-1 overflow-hidden">
        <div className={`flex-1 transition-all duration-700 ease-in-out p-8 overflow-y-auto ${showDashboard ? 'w-full' : 'w-0 opacity-0 pointer-events-none'}`}>
          <div className="max-w-7xl mx-auto space-y-10 pb-40">
            
            <ProjectTracker tasks={tasks} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <TaskManager 
                  tasks={tasks} 
                  role={role} 
                  onUpdateTask={handleUpdateTask} 
                  onCreateTask={handleCreateTask} 
                />
                
                <FileVault 
                  files={files} 
                  role={role} 
                  onUpload={handleFileUpload} 
                />

                <div className={`border-2 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl transition-colors ${isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-br from-gold-50 via-white to-amber-50 border-gold-200'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                    <div className="space-y-2">
                      <h2 className={`text-3xl font-black flex items-center gap-3 tracking-tighter ${isDarkMode ? 'text-gold-400' : 'text-amber-950'}`}>
                        <span className="text-4xl">✨</span> Cajun Growth Strategist
                      </h2>
                      <p className={`text-base font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-amber-800/80'}`}>Advanced AI analysis for thecajunmenu.com. Strategies include National Average benchmarks.</p>
                    </div>
                    <button 
                      onClick={fetchAiSuggestions}
                      disabled={aiLoading}
                      className="bg-gold-500 hover:bg-gold-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-gold-200 transition-all disabled:opacity-50 active:scale-95 text-lg shine-btn"
                    >
                      {aiLoading ? 'Analyzing Market...' : 'Generate New Strategies'}
                    </button>
                  </div>

                  {aiSuggestions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 animate-in slide-in-from-bottom-12 duration-1000">
                      {aiSuggestions.map((s, idx) => (
                        <div key={idx} className={`p-8 rounded-3xl shadow-sm border transition-all group hover:-translate-y-2 ${isDarkMode ? 'bg-slate-800/90 border-slate-700 hover:border-gold-500' : 'bg-white/95 border-gold-200 hover:border-gold-500'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold-600 bg-gold-500/10 px-4 py-1.5 rounded-full border border-gold-500/20">{s.category}</span>
                            <div className="text-right leading-none">
                              <span className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${s.estimatedCost}</span>
                              <p className="text-[8px] font-black opacity-40 uppercase tracking-tighter">Avg Est</p>
                            </div>
                          </div>
                          <h4 className={`font-black mb-3 text-xl leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{s.title}</h4>
                          <p className={`text-xs mb-8 leading-relaxed line-clamp-4 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{s.description}</p>
                          <button 
                            onClick={() => acceptAiSuggestion(s)}
                            className="w-full py-4 bg-slate-900 dark:bg-slate-700 hover:bg-gold-500 text-white text-xs font-black rounded-xl transition-all shadow-xl shine-btn"
                          >
                            Add to Pipeline
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-10">
                <ShoppingList 
                  items={shoppingItems} 
                  onToggleItem={toggleShoppingItem} 
                  onApproveSelected={approveShoppingUpgrades} 
                />
                <NoticeBoard notices={notices} currentUserRole={role} onAddNotice={addNotice} />
                <ChatBot />
              </div>
            </div>
          </div>
        </div>

        {/* Website Preview Pane - Updated to use actual live site iframe */}
        <div className={`transition-all duration-700 ease-in-out border-l relative ${showDashboard ? 'w-0 overflow-hidden' : 'flex-1'} ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
           <div className="h-full relative overflow-hidden flex flex-col">
              <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span>LIVE PREVIEW: thecajunmenu.site</span>
                </div>
                <a href="https://thecajunmenu.site" target="_blank" className="hover:text-gold-400 transition-colors">Open in New Tab</a>
              </div>
              <iframe 
                src="https://thecajunmenu.site" 
                className="flex-1 w-full border-none"
                title="Actual Live Site Preview"
              />
           </div>
        </div>

        <button 
          onClick={() => setShowDashboard(!showDashboard)}
          className={`fixed bottom-12 right-12 z-50 w-28 h-28 rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group overflow-hidden border-4 ${isDarkMode ? 'bg-purple-700 text-white border-slate-800' : 'bg-slate-900 text-white border-white'}`}
        >
          <div className="relative h-10 w-10 mb-1">
            {showDashboard ? (
              <svg className="absolute inset-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="absolute inset-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            {showDashboard ? 'Preview' : 'Control'}
          </span>
        </button>
      </main>

      <footer className={`text-[10px] py-4 px-10 flex justify-between uppercase tracking-widest font-black transition-colors ${isDarkMode ? 'bg-black text-slate-600' : 'bg-slate-950 text-slate-500'}`}>
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span> Nodes Connected</span>
          <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gold-500"></span> Global Menu Engine</span>
        </div>
        <div className={isDarkMode ? 'text-slate-800' : 'text-slate-700'}>
          Domain Intelligence Layer v6.0 • Benchmark Edition • THE CAJUN MENU
        </div>
      </footer>
    </div>
  );
};

export default App;
