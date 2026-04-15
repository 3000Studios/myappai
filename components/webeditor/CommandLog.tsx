import { AlertCircle, Bot, CheckCircle, Terminal, User } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../../types/webeditor';

interface CommandLogProps {
  logs: LogEntry[];
}

export const CommandLog: React.FC<CommandLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-gold" />;
      case 'ai':
        return <Bot className="h-4 w-4 text-cyan-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Terminal className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 font-mono text-sm space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {logs.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center text-gray-500 opacity-30">
          <Terminal className="mb-4 h-16 w-16" />
          <p className="font-serif tracking-widest">AWAITING INPUT</p>
        </div>
      )}

      {logs.map((log) => (
        <div
          key={log.id}
          className="group flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
        >
          <div className="mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
            {getIcon(log.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  log.type === 'user'
                    ? 'text-gold'
                    : log.type === 'ai'
                      ? 'text-cyan-400'
                      : log.type === 'error'
                        ? 'text-red-500'
                        : log.type === 'success'
                          ? 'text-green-500'
                          : 'text-gray-500'
                }`}
              >
                {log.type}
              </span>
              <span className="text-[10px] text-gray-600">{getTime(log.timestamp)}</span>
            </div>
            <div
              className={`mt-1 break-words whitespace-pre-wrap leading-relaxed ${
                log.type === 'user' ? 'text-white font-bold' : 'text-gray-300'
              }`}
            >
              {log.message}
            </div>

            {/* Render detailed objects if any */}
            {log.details && (
              <div className="mt-2 rounded bg-gray-900 border border-gray-700 p-2 text-xs text-gray-400 overflow-x-auto shadow-inner">
                {typeof log.details === 'string'
                  ? log.details
                  : JSON.stringify(log.details, null, 2)}
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

