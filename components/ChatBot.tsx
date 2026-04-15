
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Welcome to The Cajun Menu Planning Hub! I can help you analyze your traffic rankings for thecajunmenu.com and suggest site increases. What can I help you navigate today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] }));
    const response = await chatWithAssistant(userMsg, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden">
      <div className="p-4 bg-gold-500 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🌶️</div>
          <div>
            <h3 className="font-black text-sm leading-tight">Cajun Digital Guide</h3>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Live Traffic & SEO Analytics</p>
          </div>
        </div>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-purple-700 text-white rounded-br-none' 
                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-600 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 p-4 rounded-3xl flex gap-1 items-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about traffic, ranking, or menu options..."
          className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm font-medium dark:text-slate-100"
        />
        <button 
          type="submit"
          className="bg-gold-500 hover:bg-gold-600 text-white p-3 rounded-2xl shadow-lg shadow-gold-100 transition-all active:scale-95 shine-btn"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
