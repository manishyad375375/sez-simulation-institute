
import React, { useState, useEffect, useMemo } from 'react';

const PLANETS = [
  { name: 'Mercury', dist: 58, speed: 4.7, color: 'bg-slate-400', size: 'w-4 h-4', description: 'Smallest planet, closest to the Sun.' },
  { name: 'Venus', dist: 108, speed: 3.5, color: 'bg-orange-300', size: 'w-6 h-6', description: 'Hottest planet with a thick atmosphere.' },
  { name: 'Earth', dist: 150, speed: 2.9, color: 'bg-blue-500', size: 'w-7 h-7', description: 'Our home, the only planet known to support life.' },
  { name: 'Mars', dist: 228, speed: 2.4, color: 'bg-red-500', size: 'w-5 h-5', description: 'The Red Planet, home to Olympus Mons.' },
  { name: 'Jupiter', dist: 778, speed: 1.3, color: 'bg-amber-100', size: 'w-16 h-16', description: 'Largest planet, a massive gas giant.' },
  { name: 'Saturn', dist: 1427, speed: 0.9, color: 'bg-yellow-200', size: 'w-14 h-14', description: 'Famous for its spectacular ring system.' },
];

const SolarSimulation: React.FC = () => {
  const [warp, setWarp] = useState(1);
  const [selectedIdx, setSelectedIdx] = useState(2);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 0.1 * warp), 50);
    return () => clearInterval(timer);
  }, [warp]);

  const selected = PLANETS[selectedIdx];

  const keplerStats = useMemo(() => {
    const relativePeriod = Math.sqrt(Math.pow(selected.dist / 150, 3));
    return {
      period: (relativePeriod * 365.25).toFixed(1),
      gravity: (selected.dist > 500 ? 'Low Density' : 'Rocky Surface')
    };
  }, [selectedIdx]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 max-w-7xl mx-auto">
      
      {/* Visualizer - Full/Wide */}
      <div className="lg:col-span-12">
        <div className="bg-[#020617] rounded-[3rem] p-6 md:p-12 h-[500px] md:h-[600px] shadow-2xl relative overflow-hidden flex flex-col items-center group">
          
          <div className="absolute inset-0 pointer-events-none opacity-10">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full animate-pulse"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="absolute top-8 left-8 z-20 flex flex-col gap-1">
             <span className="bg-white/10 px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] border border-white/10">Celestial Orrery</span>
             <p className="text-[10px] text-white/40 font-bold ml-2">KEPLER-III ENGINE ACTIVE</p>
          </div>

          <div className="w-full h-full flex items-center justify-start overflow-x-auto overflow-y-hidden px-10 md:px-40 relative custom-scrollbar snap-x">
             <div className="shrink-0 w-32 h-32 md:w-44 md:h-44 bg-yellow-400 rounded-full flex flex-col items-center justify-center mr-32 relative group/sun">
                <div className="absolute inset-0 bg-orange-500 rounded-full animate-pulse opacity-20 scale-110"></div>
                <span className="text-[10px] font-black uppercase text-yellow-900 z-10">Helios</span>
             </div>

             {PLANETS.map((p, i) => {
               const offset = Math.sin(time * p.speed * 0.1) * 30;
               const isActive = selectedIdx === i;
               return (
                 <div 
                   key={p.name} 
                   onClick={() => setSelectedIdx(i)} 
                   className={`flex flex-col items-center cursor-pointer mx-12 md:mx-20 shrink-0 transition-all duration-700 snap-center relative ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                 >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] border border-white/5 rounded-full pointer-events-none"></div>
                    
                    <div 
                      className={`${p.size} ${p.color} rounded-full shadow-2xl ring-white/10 ${isActive ? 'ring-4' : 'group-hover:ring-2'}`} 
                      style={{ transform: `translateY(${offset}px)` }}
                    >
                       {isActive && <div className="absolute inset-0 rounded-full animate-ping bg-white/30"></div>}
                    </div>
                    <span className={`text-[10px] font-black mt-8 uppercase tracking-[0.3em] transition-colors ${isActive ? 'text-indigo-400' : 'text-white/40'}`}>
                      {p.name}
                    </span>
                 </div>
               )
             })}
          </div>
          
          <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-2">
             <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <button onClick={() => setWarp(Math.max(1, warp - 1))} className="w-10 h-10 rounded-xl hover:bg-white/10 text-white transition-all"><i className="fa-solid fa-minus"></i></button>
                <div className="px-4 flex flex-col items-center justify-center">
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Time Warp</p>
                   <p className="text-sm font-black text-white">{warp}x</p>
                </div>
                <button onClick={() => setWarp(Math.min(20, warp + 1))} className="w-10 h-10 rounded-xl hover:bg-white/10 text-white transition-all"><i className="fa-solid fa-plus"></i></button>
             </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 order-last md:order-none">
        <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-slate-200 h-full">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selected.name}</h3>
                 <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">{selected.description}</p>
              </div>
              <div className="flex gap-3">
                 <div className="px-5 py-3 bg-slate-900 rounded-2xl flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Orbit Order</span>
                    <span className="text-xl font-black text-white">{selectedIdx + 1}</span>
                 </div>
                 <div className="px-5 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Classification</span>
                    <span className="text-xl font-black text-indigo-900">{keplerStats.gravity}</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DataCard icon="fa-arrows-left-right" label="Mean Distance" value={`${selected.dist}M km`} sub="Semi-major axis" />
              <DataCard icon="fa-gauge-high" label="Orbital Velocity" value={`${(selected.speed * 10).toFixed(1)} km/s`} sub="Revolution speed" />
              <DataCard icon="fa-hourglass-start" label="Year Duration" value={`${keplerStats.period} Days`} sub="Orbital period (T)" />
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 h-full">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-6 flex items-center gap-2">
             <i className="fa-solid fa-graduation-cap"></i> Kepler's III Law
           </h4>
           <div className="text-lg font-bold leading-relaxed mb-8">
             The square of the orbital period (<span className="italic font-serif text-indigo-100">T</span><sup>2</sup>) is directly proportional to the cube of the distance (<span className="italic font-serif text-indigo-100">r</span><sup>3</sup>) from the Sun.
           </div>
           <div className="bg-white/10 rounded-[2rem] p-10 border border-white/10 flex flex-col items-center text-center shadow-inner backdrop-blur-sm">
              <div className="text-4xl font-serif font-bold mb-4 tracking-[0.2em] text-white">
                <span className="italic">T</span><sup>2</sup> ∝ <span className="italic">r</span><sup>3</sup>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 text-indigo-100">Universal Harmonic Ratio</p>
           </div>
           <i className="fa-solid fa-satellite-dish absolute -bottom-10 -right-10 text-[200px] opacity-10 -rotate-12"></i>
        </div>
      </div>

    </div>
  );
};

const DataCard = ({ icon, label, value, sub }: any) => (
  <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm flex flex-col justify-center group hover:bg-white hover:border-indigo-200 transition-all">
     <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
        <i className={`fa-solid ${icon}`}></i>
     </div>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className="text-xl font-black text-slate-900 tabular-nums">{value}</p>
     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{sub}</p>
  </div>
);

export default SolarSimulation;
