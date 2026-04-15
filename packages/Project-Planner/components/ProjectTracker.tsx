
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ProjectTask } from '../types';

interface ProjectTrackerProps {
  tasks: ProjectTask[];
}

const ProjectTracker: React.FC<ProjectTrackerProps> = ({ tasks }) => {
  const financialData = [
    { 
      name: 'Cost ($)', 
      Estimated: tasks.reduce((acc, t) => acc + t.estimatedCost, 0),
      Actual: tasks.reduce((acc, t) => acc + t.actualCost, 0)
    },
    { 
      name: 'Time (Hrs)', 
      Estimated: tasks.reduce((acc, t) => acc + t.estimatedHours, 0),
      Actual: tasks.reduce((acc, t) => acc + t.actualHours, 0)
    }
  ];

  const totalEstCost = tasks.reduce((acc, t) => acc + t.estimatedCost, 0);
  const totalActCost = tasks.reduce((acc, t) => acc + t.actualCost, 0);
  const totalEstHours = tasks.reduce((acc, t) => acc + t.estimatedHours, 0);
  const totalActHours = tasks.reduce((acc, t) => acc + t.actualHours, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
          Estimated vs. Actual Analysis
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
              <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#0f172a',
                  color: '#f1f5f9'
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{paddingBottom: '20px'}} />
              <Bar dataKey="Estimated" fill="#9333ea" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-gold-500 rounded-full"></span>
          Project Totals
        </h3>
        
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
              <span>Budget Utilized</span>
              <span>{Math.round((totalActCost / (totalEstCost || 1)) * 100)}%</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-slate-800 dark:text-white">${totalActCost.toLocaleString()}</span>
              <span className="text-xs text-slate-500">of ${totalEstCost.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
               <div 
                 className="bg-purple-600 h-full transition-all duration-1000" 
                 style={{ width: `${Math.min(100, (totalActCost / (totalEstCost || 1)) * 100)}%` }}
               ></div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
              <span>Hours Logged</span>
              <span>{Math.round((totalActHours / (totalEstHours || 1)) * 100)}%</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{totalActHours}h</span>
              <span className="text-xs text-slate-500">of {totalEstHours}h</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
               <div 
                 className="bg-green-500 h-full transition-all duration-1000" 
                 style={{ width: `${Math.min(100, (totalActHours / (totalEstHours || 1)) * 100)}%` }}
               ></div>
            </div>
          </div>

          <button className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-gold-900/10 flex items-center justify-center gap-2 shine-btn">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Generate Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTracker;
