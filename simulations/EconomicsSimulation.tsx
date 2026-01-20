
import React, { useState, useMemo } from 'react';

const EconomicsSimulation: React.FC = () => {
  // Market Constants for Class 10 logic
  const [demandLevel, setDemandLevel] = useState(70); // Consumer Interest (0-100)
  const [supplyLevel, setSupplyLevel] = useState(30); // Factory Production (0-100)

  // Market Equilibrium Math
  // D: P = demandLevel - Q
  // S: P = supplyLevel + Q
  // demandLevel - Q = supplyLevel + Q  => 2Q = demandLevel - supplyLevel => Q* = (D-S)/2 + offset
  const marketData = useMemo(() => {
    const qOffset = 50; 
    const qEquil = qOffset + (demandLevel - supplyLevel) / 2;
    const pEquil = (demandLevel + supplyLevel) / 2;
    
    // Normalize for display
    const price = Math.round(199 + (pEquil * 7)); // Range ~$200 - $900
    const volume = Math.round(qEquil * 100);

    let marketState = 'BALANCED';
    let stateColor = 'text-indigo-500';
    let stateBg = 'bg-indigo-50';
    let stateBorder = 'border-indigo-100';
    let icon = 'fa-scale-balanced';

    if (demandLevel > supplyLevel + 15) {
      marketState = 'SHORTAGE';
      stateColor = 'text-rose-500';
      stateBg = 'bg-rose-50';
      stateBorder = 'border-rose-100';
      icon = 'fa-triangle-exclamation';
    } else if (supplyLevel > demandLevel + 15) {
      marketState = 'SURPLUS';
      stateColor = 'text-emerald-500';
      stateBg = 'bg-emerald-50';
      stateBorder = 'border-emerald-100';
      icon = 'fa-boxes-stacked';
    }

    return { price, volume, marketState, stateColor, stateBg, stateBorder, icon, qEquil, pEquil };
  }, [demandLevel, supplyLevel]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20 px-4 md:px-0 min-h-[900px]">
      
      {/* 1. Market Research Terminal (Left Column) */}
      <div className="lg:col-span-8 flex flex-col gap-8 order-1 h-full">
        
        {/* Main Equilibrium Terminal */}
        <div className="bg-[#020617] rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-slate-800 relative flex flex-col items-center overflow-hidden min-h-[580px]">
          
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
          </div>

          <div className="absolute top-10 left-10 z-30 flex flex-col gap-3">
             <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 w-fit shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Market Engine v2.0</span>
             </div>
             <div className={`px-3 py-1.5 rounded-xl border ${marketData.stateBorder} ${marketData.stateBg} ${marketData.stateColor} text-[8px] font-black uppercase tracking-widest transition-all duration-500 shadow-lg`}>
                Current Status: {marketData.marketState}
             </div>
          </div>

          {/* Dynamic SVG Market Graph */}
          <div className="w-full max-w-2xl flex-1 relative mt-16 mb-8 z-10 aspect-video bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-12 overflow-hidden shadow-inner group">
             {/* Grid */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                  {Array.from({length: 100}).map((_, i) => <div key={i} className="border-r border-b border-white"></div>)}
                </div>
             </div>

             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                {/* Demand Line (Indigo) */}
                <path 
                  d={`M 5,${95 - (demandLevel * 0.8)} L 95,${135 - (demandLevel * 0.8)}`} 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                />
                <text x="0" y={90 - (demandLevel * 0.8)} className="fill-indigo-400 font-black text-[3px] uppercase tracking-tighter">Demand (D)</text>

                {/* Supply Line (Rose) */}
                <path 
                  d={`M 5,${10 + (100 - supplyLevel * 0.8)} L 95,${-30 + (100 - supplyLevel * 0.8)}`} 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                />
                <text x="85" y={-25 + (100 - supplyLevel * 0.8)} className="fill-rose-400 font-black text-[3px] uppercase tracking-tighter">Supply (S)</text>

                {/* Equilibrium Point */}
                <g className="transition-all duration-700" style={{ transform: `translate(${marketData.qEquil}px, ${100 - marketData.pEquil}px)` }}>
                  <circle r="2" fill="#a855f7" className="animate-pulse shadow-lg" />
                  <line x1="0" y1="0" x2="0" y2="200" stroke="#a855f7" strokeWidth="0.3" strokeDasharray="1" opacity="0.3" />
                  <line x1="0" y1="0" x2="-200" y2="0" stroke="#a855f7" strokeWidth="0.3" strokeDasharray="1" opacity="0.3" />
                </g>
             </svg>

             {/* Axis Labels */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity Demanded (Q)</div>
             <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Price (P)</div>
          </div>

          <div className="mt-auto w-full max-w-2xl bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 grid grid-cols-3 gap-4 shadow-2xl">
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Price Signal</span>
                <span className={`text-sm font-black transition-colors ${marketData.marketState === 'SHORTAGE' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {marketData.marketState === 'SHORTAGE' ? 'High Pressure' : 'Normal'}
                </span>
             </div>
             <div className="flex flex-col items-center border-x border-white/10">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Efficiency</span>
                <span className="text-sm font-black text-white">94.8%</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Clearance Goal</span>
                <span className="text-sm font-black text-indigo-400">P* = Q*</span>
             </div>
          </div>
        </div>

        {/* Dynamic Product Visualizer & Market Forces Breakdown (Aligns with sidebar bottom) */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl flex flex-col flex-1 relative overflow-hidden group min-h-[400px]">
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-col md:flex-row items-center gap-10 mb-8">
                 {/* The Console Product */}
                 <div className="relative shrink-0">
                    <div className={`absolute inset-0 blur-3xl rounded-full opacity-10 transition-colors duration-700 ${marketData.marketState === 'SHORTAGE' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                    <div className="w-40 h-40 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white relative z-10 shadow-2xl border border-slate-800 transition-transform duration-700 group-hover:scale-105">
                       <i className={`fa-solid fa-gamepad text-6xl transition-all duration-700 ${marketData.marketState === 'SHORTAGE' ? 'text-rose-400 rotate-12' : 'text-indigo-400'}`}></i>
                       <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
                    </div>
                 </div>

                 {/* Price Engine */}
                 <div className="flex-1 space-y-4">
                    <div>
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Live Listing</h3>
                       <p className="text-3xl font-black text-slate-900 tracking-tighter">G-Series Pro Console</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Price Tag</span>
                          <div className={`text-5xl font-black transition-all duration-500 tabular-nums ${marketData.marketState === 'SHORTAGE' ? 'text-rose-600' : 'text-slate-900'}`}>
                             ${marketData.price}
                          </div>
                       </div>
                       <div className="h-12 w-px bg-slate-100"></div>
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</span>
                          <span className={`text-xl font-black ${marketData.stateColor}`}>
                             {marketData.volume}k <span className="text-[10px] opacity-40">Units</span>
                          </span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Economic Forces Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
                          <i className="fa-solid fa-people-group text-xs"></i>
                       </div>
                       <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Demand Pressure</h4>
                    </div>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                       "At this interest level, {demandLevel}% of the target market is actively seeking the G-Series hardware."
                    </p>
                 </div>

                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                          <i className="fa-solid fa-industry text-xs"></i>
                       </div>
                       <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Supply Chain Status</h4>
                    </div>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                       "Factories are currently operating at {supplyLevel}% capacity to fulfill ongoing global orders."
                    </p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${marketData.marketState === 'SHORTAGE' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    Market Clearing Protocol: {marketData.marketState}
                 </span>
                 <span className="opacity-40">Serial: SEZ-ECON-2025</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Analytical Sidebar (Right Column) */}
      <div className="lg:col-span-4 flex flex-col gap-6 order-2 h-full">
        
        {/* Module 1: Market Tuning (Sliders) */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-200">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Market Tuning</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Adjust Economic Forces</p>
          </div>
          
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <i className="fa-solid fa-users text-indigo-500"></i> Consumer Interest
                </label>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl font-black text-[10px] tabular-nums">{demandLevel}%</span>
              </div>
              <input 
                type="range" min="10" max="90" step="1" value={demandLevel} 
                onChange={(e) => setDemandLevel(parseInt(e.target.value))} 
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 border border-slate-200" 
              />
              <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Low Hype</span> <span>Mass Viral</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <i className="fa-solid fa-industry text-rose-500"></i> Factory Production
                </label>
                <span className="bg-rose-600 text-white px-3 py-1 rounded-xl font-black text-[10px] tabular-nums">{supplyLevel}%</span>
              </div>
              <input 
                type="range" min="10" max="90" step="1" value={supplyLevel} 
                onChange={(e) => setSupplyLevel(parseInt(e.target.value))} 
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-rose-600 border border-slate-200" 
              />
              <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Scarcity</span> <span>Surplus Prod.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: The Math of Value */}
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 flex flex-col relative overflow-hidden h-[380px]">
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <i className="fa-solid fa-calculator"></i>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Math Dossier</h4>
                    <p className="text-xl font-black text-white tracking-tight">Equilibrium Formula</p>
                 </div>
              </div>

              <div className="space-y-6 flex-1">
                 <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4 text-center">Standard Market Form</p>
                    <div className="text-2xl font-mono font-black text-center tracking-tighter text-indigo-200">
                       Q<sub>D</sub>(P) = Q<sub>S</sub>(P)
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/10">
                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                       "At equilibrium, the exact number of consoles produced matches the exact number of buyers willing to pay the price. No waste, no shortage."
                    </p>
                 </div>
              </div>
           </div>
           <i className="fa-solid fa-infinity absolute -bottom-10 -right-10 text-[180px] opacity-[0.03] -rotate-12"></i>
        </div>

        {/* Module 3: Real-World Case Study (Universal Application) */}
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group flex-1">
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <i className="fa-solid fa-graduation-cap text-indigo-300"></i>
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-1">ECONOMIC CASE</h3>
                    <p className="text-base font-black leading-none">The Scarcity Premium</p>
                 </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-4">
                 <p className="text-xs font-bold leading-relaxed opacity-90">
                    Why do consoles cost $900 on auction sites when they retail for $499? When Demand (D) shifts right and Supply (S) is fixed, the "Invisible Hand" pushes prices upward until a new balance is reached.
                 </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Theory Mastered</span>
                 </div>
                 <span className="text-[9px] font-black opacity-40 uppercase">ECON-TER-10</span>
              </div>
           </div>
           <i className="fa-solid fa-hand-holding-dollar absolute -bottom-6 -right-6 text-[140px] opacity-[0.05] -rotate-12 transition-transform duration-700 group-hover:scale-110"></i>
        </div>

      </div>
    </div>
  );
};

export default EconomicsSimulation;
