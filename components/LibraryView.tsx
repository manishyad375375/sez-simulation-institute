
import React, { useState, useRef } from 'react';
import { SimulationInfo, UserProgress } from '../types';

interface Props {
  simulations: SimulationInfo[];
  userProgress: UserProgress;
  onSelect: (id: string) => void;
}

const LibraryView: React.FC<Props> = ({ simulations, userProgress, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-4 md:p-8"
      ref={containerRef}
    >
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-800 rounded-full border border-white/20 mb-6 shadow-2xl">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Simulation Learning</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4">
            <span className="text-indigo-600">AI Based Learning Hub</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm md:text-base px-4">
            Master Class 10 concepts through interactive exploration. Choose a module below to initiate high-fidelity AI simulations designed for deeper academic understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 px-2 md:px-0">
          {simulations.map((sim, index) => {
            const isDone = userProgress[sim.id]?.completed;
            return (
              <div 
                key={sim.id}
                onClick={() => sim.status === 'available' && onSelect(sim.id)}
                className={`group relative h-80 rounded-[2.5rem] transition-all duration-300 cursor-pointer ${
                  sim.status === 'available' 
                    ? 'hover:-translate-y-2' 
                    : 'opacity-40 grayscale pointer-events-none'
                }`}
              >
                <div className={`absolute inset-0 bg-white border-2 rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-300 ${isDone ? 'border-emerald-400 ring-4 ring-emerald-50' : 'border-slate-200 group-hover:border-indigo-500'}`}>
                  {isDone && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-20">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}

                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                     <div className="grid grid-cols-6 h-full w-full border-l border-slate-900">
                       {Array.from({length: 36}).map((_, i) => <div key={i} className="border-r border-b border-slate-900"></div>)}
                     </div>
                  </div>

                  <div className="p-8 h-full flex flex-col items-center justify-between relative z-10">
                    <div className={`w-20 h-20 rounded-3xl ${sim.color} flex items-center justify-center text-white text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}>
                      <i className={`fa-solid ${sim.icon}`}></i>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 block">
                        Module {sim.number}
                      </span>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {sim.title}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase">
                        {sim.subject}
                      </p>
                    </div>

                    <div className="w-full flex items-center justify-center gap-2 pt-4">
                      <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${isDone ? 'bg-emerald-500 w-full' : 'bg-indigo-500 w-full animate-pulse'}`}></div>
                      </div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        {isDone ? 'Mastered' : 'Ready'}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-28 mb-12 flex flex-col items-center">
           <div className="flex items-center gap-5 bg-white px-12 py-5 rounded-[2.5rem] border border-slate-200 shadow-2xl transition-all hover:bg-slate-50 hover:scale-105 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl rotate-3 transition-transform group-hover:rotate-12">
                 <i className="fa-solid fa-flask-vial text-xl"></i>
              </div>
              <div className="flex flex-col">
                <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.6em] leading-none mb-1.5">Shreeji Education Zone</p>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-80">
                    AI Learning Hub
                  </p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
