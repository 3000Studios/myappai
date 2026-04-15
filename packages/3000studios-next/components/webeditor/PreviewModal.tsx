import { Activity, Check, Edit2, Trash2 } from 'lucide-react';
import React from 'react';
import { CommandIntent } from '../../types/webeditor';

interface PreviewModalProps {
  intent: CommandIntent | null;
  onConfirm: () => void;
  onModify: () => void;
  onCancel: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  intent,
  onConfirm,
  onModify,
  onCancel,
}) => {
  if (!intent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="panel-glass w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh] border-2 border-gold shadow-[0_0_50px_rgba(212,175,55,0.2)]">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gold/50 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Activity className="h-6 w-6 text-cyan-400 animate-pulse" />
            <div>
              <h2 className="text-3xl font-serif font-bold text-3d-animated uppercase tracking-widest">
                Preview Changes
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Say "Run that shit" to confirm or "Fuck no" to cancel.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto bg-black/80 font-mono text-sm space-y-6 flex-1">
          {/* Metadata */}
          <div className="grid grid-cols-3 gap-4 border-b border-gray-700 pb-4">
            <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
              <span className="text-[10px] text-gray-500 uppercase block">Action</span>
              <span className="text-xl text-gold font-bold">{intent.action}</span>
            </div>
            <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
              <span className="text-[10px] text-gray-500 uppercase block">Target Path</span>
              <span className="text-sm text-blue-400 break-all">{intent.path}</span>
            </div>
            <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
              <span className="text-[10px] text-gray-500 uppercase block">Commit Message</span>
              <span className="text-sm text-green-400 italic">"{intent.commit_message}"</span>
            </div>
          </div>

          {/* Code Preview / Diff Visualization */}
          {intent.content && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between">
                  <span className="text-xs text-gray-400">Proposed Content</span>
                </div>
                <pre className="p-4 text-gray-300 overflow-x-auto text-xs leading-relaxed language-typescript">
                  {intent.content}
                </pre>
              </div>
            </div>
          )}

          {/* AI Reasoning */}
          {intent.reasoning && (
            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r">
              <strong className="text-blue-400 block mb-1 text-xs uppercase">Analysis</strong>
              <p className="text-gray-300 italic">"{intent.reasoning}"</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-black/90 border-t border-gray-800 flex justify-between items-center gap-4">
          <button
            onClick={onCancel}
            className="btn-glossy px-8 py-3 rounded text-red-400 font-bold uppercase tracking-widest hover:text-red-200 flex items-center gap-2"
          >
            <Trash2 className="h-5 w-5" /> Fuck No (Cancel)
          </button>

          <button
            onClick={onModify}
            className="btn-glossy px-8 py-3 rounded text-yellow-400 font-bold uppercase tracking-widest hover:text-yellow-200 flex items-center gap-2"
          >
            <Edit2 className="h-5 w-5" /> Modify
          </button>

          <button
            onClick={onConfirm}
            className="btn-glossy px-10 py-3 rounded text-green-400 font-bold uppercase tracking-widest hover:text-green-200 flex items-center gap-2 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
          >
            <Check className="h-6 w-6" /> Run That Shit
          </button>
        </div>
      </div>
    </div>
  );
};

