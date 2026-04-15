
import React from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onApproveSelected: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onToggleItem, onApproveSelected }) => {
  const selectedCount = items.filter(i => i.isChecked).length;
  const totalCost = items.filter(i => i.isChecked).reduce((acc, i) => acc + i.cost, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
      <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <h3 className="text-xl font-black flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Upgrade Catalog
        </h3>
        <p className="text-green-50 text-[10px] font-black mt-1 uppercase tracking-widest opacity-90 leading-tight">National Average Benchmarks for Professional Implementation</p>
      </div>

      <div className="bg-amber-100 dark:bg-amber-500/10 px-6 py-2.5 border-b border-amber-500/20">
        <p className="text-[9px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest text-center leading-tight">
          Disclaimer: Pricing reflects Market National Averages. This is NOT a quoted price for development.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${item.isChecked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-700'}`}
            onClick={() => onToggleItem(item.id)}
          >
            <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${item.isChecked ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600'}`}>
              {item.isChecked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="font-black text-slate-800 dark:text-slate-100 text-sm leading-tight">{item.title}</span>
                <div className="text-right">
                  <span className="block text-xs font-black text-green-600 dark:text-green-400">${item.cost.toLocaleString()}</span>
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Avg Est</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4 px-2">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. National Market Value</p>
            <p className="text-xl font-black text-slate-900 dark:text-slate-100">${totalCost.toLocaleString()}</p>
          </div>
          <p className="text-xs font-bold text-slate-500">{selectedCount} Items</p>
        </div>
        <button 
          onClick={onApproveSelected}
          disabled={selectedCount === 0}
          className="w-full py-4 bg-purple-700 hover:bg-purple-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-black rounded-2xl shadow-xl shadow-purple-900/10 transition-all active:scale-95 shine-btn"
        >
          Send Request for Custom Quote
        </button>
      </div>
    </div>
  );
};

export default ShoppingList;
