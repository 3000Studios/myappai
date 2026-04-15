
import React, { useState, useEffect, useRef } from 'react';
import { Notice, UserRole } from '../types';

interface NoticeBoardProps {
  notices: Notice[];
  currentUserRole: UserRole;
  onAddNotice: (content: string) => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, currentUserRole, onAddNotice }) => {
  const [newNotice, setNewNotice] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // MK "Get Over Here" Sound URL (using a representative open-source sample or placeholder)
  const mkSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    mkSoundRef.current = new Audio('https://www.myinstants.com/media/sounds/mk6-get-over-here.mp3');
    
    // Setup Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewNotice(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNotice.trim()) {
      onAddNotice(newNotice);
      setNewNotice('');
      
      // Play "Get Over Here!"
      if (mkSoundRef.current) {
        mkSoundRef.current.currentTime = 0;
        mkSoundRef.current.play().catch(e => console.log('Audio blocked by browser policy'));
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="p-4 bg-purple-700 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
          Project Notices
        </h3>
        <span className="text-[10px] bg-purple-600 px-2 py-1 rounded-full uppercase tracking-wider font-black">Live Feed</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
        {notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 text-slate-400 dark:text-slate-600 italic gap-2">
            <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <p className="text-sm font-medium">No notices yet. Start the conversation!</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className={`flex flex-col ${notice.role === currentUserRole ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                notice.role === 'Developer' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 border border-green-100 dark:border-green-800 rounded-tr-none' 
                  : 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-300 border border-purple-100 dark:border-purple-800 rounded-tl-none'
              }`}>
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-tight opacity-70">
                    {notice.author}
                  </span>
                  <span className="text-[10px] opacity-50 font-bold">
                    {notice.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed">{notice.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              placeholder="Write a project note..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 text-sm font-medium dark:text-slate-100"
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-purple-600'}`}
              title="Voice Input"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v5a3 3 0 01-3 3 3 3 0 01-3-3V6a3 3 0 013-3z" /></svg>
            </button>
          </div>
          <button 
            type="submit"
            className="bg-purple-700 text-white p-3 px-6 rounded-xl font-black hover:bg-purple-800 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-950/20 shine-btn text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeBoard;
