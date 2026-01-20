
import React, { useState, useEffect, useMemo } from 'react';

const MatterSimulation: React.FC = () => {
  const [temp, setTemp] = useState(25); // Celsius
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const p = [];
    for(let i=0; i<50; i++) p.push({ 
      id: i, 
      x: Math.random()*100, 
      y: Math.random()*100, 
      vx: (Math.random()-0.5), 
      vy: (Math.random()-0.5),
      color: i % 2 === 0 ? 'bg-orange-500' : 'bg-amber-400'
    });
    setParticles(p);
  }, []);

  const { state, theme, description } = useMemo(() => {
    if (temp <= 0) return { 
      state: 'Solid', 
      theme: 'blue', 
      description: 'Particles are locked in a rigid structure. They vibrate in place but cannot move past each other, resulting in a fixed shape and volume.' 
    };
    if (temp >= 100) return { 
      state: 'Gas', 
      theme: 'orange', 
      description: 'Particles have enough kinetic energy to overcome all attraction. They fly rapidly in random directions, filling the entire container volume.' 
    };
    return { 
      state: 'Liquid', 
      theme: 'indigo', 
      description: 'Intermolecular forces are weak enough for particles to flow past one another, allowing the substance to take the shape of its container while maintaining fixed volume.' 
    };
  }, [temp]);

  const speedScale = Math.max(0.2, (temp + 100) / 150);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-20 max-w-7xl mx-auto">
      
      {/* Simulation Box */}
      <div className="lg:col-span-8 flex flex-col gap-6 order-1">
        <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl border border-slate-200 relative flex flex-col items-center">
          <div className="absolute top-8 left-8 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phase Change Analyzer v1.0</span>
          </div>

          <div className="w-full max-w-lg aspect-square bg-slate-900 border-[12px] border-slate-800 rounded-[3rem] relative overflow-hidden shadow-2xl mt-12">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
             
             {particles.map(p => {
               let x = p.x;
               let y = p.y;
               const time = Date.now();
               
               if (state === 'Solid') {
                 const cols = 7;
                 const col = p.id % cols;
                 const row = Math.floor(p.id / cols);
                 x = 25 + col * 8.5 + Math.sin(time/80 + p.id) * (temp / -50);
                 y = 25 + row * 8.5 + Math.cos(time/80 + p.id) * (temp / -50);
               } else if (state === 'Liquid') {
                 x = (p.x + Math.sin(time/600 + p.id) * 8) % 100;
                 y = (75 + Math.cos(time/1200 + p.id) * 20) % 100;
               } else {
                 x = (p.x + (p.vx * speedScale * time/40) % 100 + 100) % 100;
                 y = (p.y + (p.vy * speedScale * time/40) % 100 + 100) % 100;
               }

               return (
                 <div 
                   key={p.id} 
                   className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full ${p.color} shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 ease-out`} 
                   style={{ left: `${x}%`, top: `${y}%`, opacity: state === 'Gas' ? 0.7 : 1 }}
                 ></div>
               )
             })}
          </div>

          <div className="mt-12 w-full flex flex-col items-center gap-10">
             <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200">
                {['Solid', 'Liquid', 'Gas'].map(s => (
                   <button 
                     key={s}
                     onClick={() => setTemp(s === 'Solid' ? -50 : s === 'Liquid' ? 25 : 150)}
                     className={`px-6 md:px-8 py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all ${state === s ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {s}
                   </button>
                ))}
             </div>

             <div className="w-full max-w-xl space-y-6">
                <div className="flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thermodynamic Intensity</span>
                      <span className={`text-4xl font-black tabular-nums ${theme === 'blue' ? 'text-blue-600' : theme === 'orange' ? 'text-orange-600' : 'text-indigo-600'}`}>
                        {temp}°C
                      </span>
                   </div>
                   <div className="flex gap-2">
                      <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Energy Scale: {speedScale.toFixed(2)}x</div>
                   </div>
                </div>
                <input 
                  type="range" 
                  min="-100" 
                  max="300" 
                  value={temp} 
                  onChange={(e) => setTemp(parseInt(e.target.value))} 
                  className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900 border border-slate-200" 
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase px-1">
                   <span>Absolute Cold</span>
                   <span>Ambient</span>
                   <span>Critical Heat</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6 order-2">
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-800 relative overflow-hidden h-full">
           <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-2">
             <i className="fa-solid fa-book-open"></i> Simulator Manual: Molecular Dynamics
           </h3>
           <div className="space-y-8 relative z-10">
              <div>
                 <h4 className="text-xl font-black mb-3">State: {state}</h4>
                 <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                   {description}
                 </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 min-w-0">
                    <p className="text-[8px] font-black text-indigo-300 uppercase tracking-wider mb-2 leading-tight">Particle Attraction</p>
                    <p className="text-xs font-bold truncate">{state === 'Solid' ? 'Maximum' : state === 'Liquid' ? 'Moderate' : 'Negligible'}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 min-w-0">
                    <p className="text-[8px] font-black text-indigo-300 uppercase tracking-wider mb-2 leading-tight">Entropy Level</p>
                    <p className="text-xs font-bold truncate">{state === 'Solid' ? 'Low' : state === 'Liquid' ? 'Medium' : 'High'}</p>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                 <p className="text-xs font-bold leading-relaxed text-slate-500">
                   Note the transition at <span className="text-white">0°C</span> (Melting) and <span className="text-white">100°C</span> (Boiling). These points represent the energy thresholds required to break or form intermolecular bonds.
                 </p>
              </div>
           </div>
           <i className="fa-solid fa-fire-burner absolute -bottom-10 -right-10 text-[180px] opacity-[0.03] -rotate-12"></i>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl flex items-center gap-6 group hover:border-orange-200 transition-colors">
           <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-2xl group-hover:scale-110 transition-transform">
             <i className="fa-solid fa-temperature-arrow-up"></i>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thermal Goal</p>
              <p className="text-sm font-bold text-slate-800 leading-tight">Heat to 100°C to observe the transition from Fluid to Vapor.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MatterSimulation;
