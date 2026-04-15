import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { GitHubConfig, RepoMemory } from '../../types/webeditor';

interface UserContextType {
  config: GitHubConfig | null;
  setConfig: (config: GitHubConfig | null) => void;
  memory: RepoMemory;
  setMemory: React.Dispatch<React.SetStateAction<RepoMemory>>;
  theme: 'marble' | 'flat';
  toggleTheme: () => void;
  history: string[];
  addToHistory: (cmd: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<GitHubConfig | null>(null);
  const [memory, setMemory] = useState<RepoMemory>({ last_login: '', chat_history: [] });
  const [theme, setTheme] = useState<'marble' | 'flat'>('marble');
  const [history, setHistory] = useState<string[]>([]);

  // Persistent Config Wrapper
  const setConfig = (newConfig: GitHubConfig | null) => {
    setConfigState(newConfig);
    if (newConfig) {
      localStorage.setItem('s2w3000_config', JSON.stringify(newConfig));
    } else {
      localStorage.removeItem('s2w3000_config');
    }
  };

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('s2w3000_config');
    if (savedConfig) {
      try {
        setConfigState(JSON.parse(savedConfig));
      } catch (_e) {
        localStorage.removeItem('s2w3000_config');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'marble' ? 'flat' : 'marble';
    setTheme(newTheme);
    if (newTheme === 'flat') {
      document.body.classList.add('flat-dark');
    } else {
      document.body.classList.remove('flat-dark');
    }
  };

  const addToHistory = (cmd: string) => {
    setHistory((prev) => {
      // Avoid duplicates at the end
      if (prev[prev.length - 1] === cmd) return prev;
      return [...prev, cmd];
    });
  };

  return (
    <UserContext.Provider
      value={{
        config,
        setConfig,
        memory,
        setMemory,
        theme,
        toggleTheme,
        history,
        addToHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

