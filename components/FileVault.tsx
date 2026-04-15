
import React, { useRef } from 'react';
import { UserRole } from '../types';

interface FileVaultProps {
  files: {name: string, date: string, size: string, uploadedBy: string}[];
  role: UserRole;
  onUpload: (fileList: FileList | null) => void;
}

const FileVault: React.FC<FileVaultProps> = ({ files, role, onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8 space-y-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
            <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            Review Vault
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Upload assets, menus, or references for developer review</p>
        </div>
        {role === 'Owner' && (
          <>
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={inputRef} 
              onChange={(e) => onUpload(e.target.files)}
            />
            <button 
              onClick={() => inputRef.current?.click()}
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-purple-900/10 transition-all shine-btn text-sm"
            >
              Upload Assets
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.length === 0 ? (
          <div className="col-span-full py-12 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400">
            <svg className="w-10 h-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-xs font-black uppercase tracking-widest">Vault is empty</p>
          </div>
        ) : (
          files.map((file, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-4 group hover:border-purple-500 transition-all">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate leading-tight mb-1">{file.name}</p>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{file.size}</span>
                  <span>{file.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileVault;
