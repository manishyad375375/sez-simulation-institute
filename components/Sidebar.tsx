
import React from 'react';
import { SimulationInfo, UserProgress } from '../types';

interface Props {
  simulations: SimulationInfo[];
  activeId: string | null;
  userProgress: UserProgress;
  isAdmin: boolean;
  isAdminActive: boolean;
  onSelectAdmin: () => void;
  onSelect: (id: string | null) => void;
  onToggleComplete: (id: string) => void;
  onSwitchUser: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({ 
  simulations, 
  activeId, 
  userProgress, 
  isAdmin, 
  isAdminActive, 
  onSelectAdmin, 
  onSelect, 
  onToggleComplete, 
  onSwitchUser, 
  onClose 
}) => {
  return (
    <aside className="w-full h-full bg-[#0F172A] border-r border-slate-800 flex flex-col shadow-2xl overflow-hidden relative">
      <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 rotate-3">
            <i className="fa-solid fa-flask-vial text-2xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white text-xl tracking-tighter leading-none">SEZ</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mt-1">Institute</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden w-10 h-10 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        <button
          onClick={() => onSelect(null)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${
            activeId === null && !isAdminActive
              ? 'bg-slate-800 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ring-1 ring-slate-700' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeId === null && !isAdminActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
            <i className="fa-solid fa-grid-2 text-xs"></i>
          </div>
          Simulator Home
        </button>

        {isAdmin && (
          <>
            <div className="pt-6 pb-2 px-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
              Faculty Management
            </div>
            <button
              onClick={onSelectAdmin}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${
                isAdminActive 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isAdminActive ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <i className="fa-solid fa-gauge-high text-xs"></i>
              </div>
              Admin Console
            </button>
          </>
        )}
        
        <div className="pt-6 pb-2 px-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
          Simulation Library
        </div>

        {simulations.map((sim) => {
          const isDone = !!userProgress[sim.id]?.completed;
          const isActive = activeId === sim.id;
          return (
            <div key={sim.id} className="relative group/item">
              <button
                onClick={() => sim.status === 'available' && onSelect(sim.id)}
                className={`w-full flex items-center gap-4 pl-5 pr-14 py-3.5 rounded-2xl transition-all font-bold text-sm group relative overflow-hidden ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
                )}
                <div className={`w-2 h-2 rounded-full shrink-0 ${isDone ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : sim.status === 'available' ? 'bg-slate-600 animate-pulse' : 'bg-slate-800'}`}></div>
                <span className="flex-1 text-left truncate leading-tight">
                  {sim.number}. {sim.title}
                </span>
                {sim.status === 'coming-soon' && (
                  <i className="fa-solid fa-lock text-[10px] opacity-40"></i>
                )}
              </button>

              {!isAdminActive && sim.status === 'available' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(sim.id);
                  }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
                    isDone 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50'
                  }`}
                  title={isDone ? "Mark as Incomplete" : "Mark as Complete"}
                >
                  <i className={`fa-solid ${isDone ? 'fa-circle-check' : 'fa-check'}`}></i>
                </button>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 border border-slate-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-indigo-500"></i>
              Completions
            </p>
            <span className="text-white text-[10px] font-black bg-indigo-500 px-2 py-0.5 rounded-lg">
               {Object.values(userProgress).filter(p => p.completed).length}/10
            </span>
          </div>
          <div className="space-y-3">
             <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${(Object.values(userProgress).filter(p => p.completed).length / 10) * 100}%` }}
                ></div>
             </div>
             <button 
                onClick={onSwitchUser}
                className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-rose-900 hover:text-white text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-600/50 mt-4"
              >
                <i className="fa-solid fa-power-off"></i>
                Logout
              </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
