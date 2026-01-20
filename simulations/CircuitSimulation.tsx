
import React, { useState, useMemo } from 'react';

const CircuitSimulation: React.FC = () => {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);

  const stats = useMemo(() => {
    const current = voltage / resistance;
    const power = voltage * current;
    const brightness = Math.min(100, (current / 5) * 100);
    
    // Benchmarks logic
    const goals = {
      highFlow: current >= 5,
      lowPower: power < 20 && power > 0,
      maxVoltage: voltage === 24,
      resistanceBalance: Math.abs(voltage - resistance) < 2
    };

    const completedCount = Object.values(goals).filter(Boolean).length;

    return { current, power, brightness, goals, completedCount };
  }, [voltage, resistance]);

  const handleReset = () => {
    setVoltage(12);
    setResistance(4);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12 px-4 md:px-0">
      
      {/* 1. Scientific Header */}
      <div className="lg:col-span-12">
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 shadow-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500 flex items-center justify-center text-white shadow-xl rotate-3">
                <i className="fa-solid fa-bolt text-2xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Ohmic Circuitry Simulator</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Breadboard Matrix v4.6 Active</p>
                </div>
              </div>
           </div>
           
           <button onClick={handleReset} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
             <i className="fa-solid fa-arrows-rotate"></i> Reset Breadboard
           </button>
        </div>
      </div>

      {/* 2. Main Visualization & Research (LEFT COLUMN) */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        
        {/* Breadboard Visualizer */}
        <div className="bg-[#0f172a] rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-800 relative flex flex-col items-center overflow-hidden min-h-[400px]">
          <div className="absolute top-8 left-8 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] border border-white/10 z-10">
             Electronic Viewport
          </div>
          
          <div className="w-full max-w-2xl aspect-video bg-slate-900/50 rounded-[2rem] mt-10 relative overflow-hidden border-[4px] border-slate-800/50 shadow-inner">
            <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Wiring */}
              <path d="M 80 150 L 80 50 L 320 50 L 320 150 L 80 150" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
              
              {/* Electron Flow (Animated) */}
              <circle r="3" fill="#fbbf24" filter="url(#glow)">
                <animateMotion 
                  dur={`${Math.max(0.3, 4 / (stats.current || 0.1))}s`} 
                  repeatCount="indefinite" 
                  path="M 80 150 L 80 50 L 320 50 L 320 150 L 80 150" 
                />
              </circle>
              <circle r="3" fill="#fbbf24" filter="url(#glow)">
                <animateMotion 
                  dur={`${Math.max(0.3, 4 / (stats.current || 0.1))}s`} 
                  begin={`${Math.max(0.3, 4 / (stats.current || 0.1)) / 2}s`}
                  repeatCount="indefinite" 
                  path="M 80 150 L 80 50 L 320 50 L 320 150 L 80 150" 
                />
              </circle>

              {/* Battery Component */}
              <g transform="translate(55, 85)">
                <rect width="50" height="30" rx="4" fill="#1e293b" />
                <rect x="50" y="8" width="5" height="14" rx="2" fill="#475569" />
                <text x="25" y="20" textAnchor="middle" fill="white" className="text-[10px] font-black tabular-nums">{voltage}V</text>
              </g>

              {/* Load (Bulb) Component */}
              <g transform="translate(320, 100)">
                <circle r="28" fill={stats.current > 0 ? `rgba(253, 224, 71, ${stats.brightness/100 * 0.4})` : 'transparent'} filter="url(#glow)" />
                <circle r="22" fill={stats.current > 0 ? `rgba(253, 224, 71, ${0.1 + stats.brightness/100 * 0.9})` : '#1e293b'} stroke="#fde047" strokeWidth="2" />
                <path d="M -10 8 L 10 8 M -6 12 L 6 12" stroke={stats.current > 0 ? "#854d0e" : "#475569"} strokeWidth="1.5" />
                <path d="M -8 -8 Q 0 -15 8 -8" fill="none" stroke={stats.current > 0 ? "#854d0e" : "#475569"} strokeWidth="2" />
              </g>

              {/* Resistor Component */}
              <g transform="translate(170, 50)">
                <path d="M -20 0 L -10 0 L -5 -15 L 5 15 L 10 -15 L 15 15 L 20 0 L 30 0" fill="none" stroke="#f87171" strokeWidth="3" />
                <text x="5" y="35" textAnchor="middle" fill="#f87171" className="text-[8px] font-black tracking-widest">{resistance}Ω</text>
              </g>
            </svg>
          </div>

          <div className="mt-10 flex gap-4 w-full justify-center">
             <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[120px]">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Intensity</span>
                <span className="text-xl font-black text-yellow-400">{Math.round(stats.brightness)}%</span>
             </div>
             <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[120px]">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Consumption</span>
                <span className="text-xl font-black text-indigo-400">{stats.power.toFixed(1)}W</span>
             </div>
          </div>
        </div>

        {/* RESEARCH SUITE - FILLS REMAINING SPACE */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-xl border border-slate-200 flex flex-col flex-grow">
           <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <i className="fa-solid fa-graduation-cap"></i>
                 </div>
                 <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Circuit Theory & Components</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Foundational Electronics Simulator</p>
                 </div>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
                Electricity isn't magic—it's the flow of tiny particles called <span className="text-indigo-600 font-bold underline">electrons</span>. Explore the building blocks of every circuit below.
              </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <ResearchCard 
                title="The Pump" 
                color="yellow" 
                icon="fa-battery-full" 
                desc="Voltage (V) is the push. Higher voltage means a stronger push to get those electrons moving faster." 
              />
              <ResearchCard 
                title="The Flow" 
                color="indigo" 
                icon="fa-water" 
                desc="Current (I) is the actual stream. We measure how many pass through a point every second." 
              />
              <ResearchCard 
                title="The Squeeze" 
                color="rose" 
                icon="fa-hand-holding-hand" 
                desc="Resistance (R) slows things down and makes the electrons work harder, creating heat or light." 
              />
           </div>

           {/* COMPONENT REFERENCE - FILLS THE GAP */}
           <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <i className="fa-solid fa-layer-group text-indigo-500"></i> Object vs Symbol Recognition
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <ComponentBadge name="Battery" symbol="⏚" desc="Power Source" />
                 <ComponentBadge name="Resistor" symbol="⌇⌇⌇" desc="Flow Limiter" />
                 <ComponentBadge name="Bulb" symbol="⊗" desc="Energy Output" />
                 <ComponentBadge name="Switch" symbol="—/ —" desc="Circuit Gate" />
              </div>
           </div>

           <div className="mt-auto space-y-4">
              <div className="p-6 bg-indigo-950 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-6 border border-indigo-900 shadow-2xl relative overflow-hidden">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 z-10">
                  <i className="fa-solid fa-lightbulb text-yellow-400 text-xl animate-pulse"></i>
                </div>
                <div className="z-10 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Intelligence Tip</p>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest"></span>
                  </div>
                  <p className="text-sm font-bold text-slate-100 leading-snug mb-3">
                    Try decreasing Resistance to its minimum to observe the high-speed "Electron Rush" effect.
                  </p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 transition-all duration-1000 shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${(stats.completedCount / 4) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-6 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 z-10">
                   <i className="fa-solid fa-book-open text-yellow-400 text-xl"></i>
                </div>
                <div className="z-10">
                  <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] mb-1">Golden Rule of Circuits</p>
                  <p className="text-lg font-serif italic text-slate-100 leading-tight">
                     "To make a light glow, you need a closed loop where electrons can travel from the battery and back home."
                  </p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Control Deck & Benchmarks (RIGHT COLUMN) */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        
        {/* Tuning Module */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-slate-200">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">System Configuration</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Calibration Panel</p>
          </div>
          
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Voltage (V)</label>
                <span className="bg-yellow-500 text-white px-4 py-1.5 rounded-xl font-black text-xs tabular-nums">{voltage}V</span>
              </div>
              <input type="range" min="1" max="24" step="1" value={voltage} onChange={(e) => setVoltage(parseInt(e.target.value))} 
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-yellow-500 border border-slate-200" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resistance (Ω)</label>
                <span className="bg-rose-500 text-white px-4 py-1.5 rounded-xl font-black text-xs tabular-nums">{resistance}Ω</span>
              </div>
              <input type="range" min="1" max="20" step="1" value={resistance} onChange={(e) => setResistance(parseInt(e.target.value))} 
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-rose-500 border border-slate-200" 
              />
            </div>
          </div>
        </div>

        {/* Live Math Terminal */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-800 text-white">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black tracking-tight">Ohmic Derivation</h3>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Live Telemetry</p>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-mono whitespace-nowrap">
              V = I × R
            </div>
          </div>
          
          <div className="space-y-5 font-mono text-[12px]">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="text-slate-500">Source (V)</span>
              <span className="text-yellow-400 font-black tabular-nums">{voltage}.00 V</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="text-slate-500">Impedance (R)</span>
              <span className="text-rose-400 font-black tabular-nums">{resistance}.00 Ω</span>
            </div>
            <div className="h-px bg-white/10 w-full"></div>
            <div className="pt-6">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Calculated Current (I)</p>
              <div className="text-5xl font-black text-white tabular-nums flex items-baseline gap-2">
                {stats.current.toFixed(2)} <span className="text-xs text-indigo-500 font-bold uppercase tracking-widest">Amps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmarks Section - FILLS THE VERTICAL SPACE */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-xl border border-slate-200 flex-grow flex flex-col">
           <div className="mb-8">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                <i className="fa-solid fa-award text-amber-500 text-base"></i> Simulator Benchmarks
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mission Milestones</p>
           </div>
           
           <div className="space-y-4 flex-grow flex flex-col justify-between">
              <BenchmarkItem label="High Flow" desc="Current ≥ 5.0 Amperes" active={stats.goals.highFlow} icon="fa-gauge-high" />
              <BenchmarkItem label="Energy Saver" desc="Power < 20 Watts" active={stats.goals.lowPower} icon="fa-leaf" />
              <BenchmarkItem label="Max Potential" desc="Battery at 24V Limit" active={stats.goals.maxVoltage} icon="fa-car-battery" />
              <BenchmarkItem label="Unit Parity" desc="V and R are Matched" active={stats.goals.resistanceBalance} icon="fa-equals" />
           </div>
        </div>

      </div>
    </div>
  );
};

const ResearchCard = ({ title, color, icon, desc }: { title: string, color: string, icon: string, desc: string }) => (
  <div className={`p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4 group hover:bg-white transition-all duration-300 hover:border-${color}-200`}>
     <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600 text-sm shadow-sm group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon}`}></i>
     </div>
     <div>
        <h4 className={`text-[11px] font-black text-${color}-600 uppercase tracking-wider mb-1`}>{title}</h4>
        <p className="text-[10px] text-slate-500 leading-snug font-medium">
           {desc}
        </p>
     </div>
  </div>
);

const ComponentBadge = ({ name, symbol, desc }: { name: string, symbol: string, desc: string }) => (
  <div className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm">
     <span className="text-lg font-black text-slate-800 leading-none mb-1">{symbol}</span>
     <p className="text-[9px] font-black text-slate-900 leading-none mb-1">{name}</p>
     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{desc}</p>
  </div>
);

const BenchmarkItem = ({ label, desc, active, icon }: { label: string, desc: string, active: boolean, icon: string }) => (
  <div className={`p-5 rounded-[1.5rem] border-2 transition-all duration-500 flex items-center gap-4 flex-grow ${
    active 
      ? 'bg-emerald-50 border-emerald-400 shadow-md scale-[1.03]' 
      : 'bg-slate-50 border-slate-100 opacity-60'
  }`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-500 shrink-0 ${
      active ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-white text-slate-300'
    }`}>
      <i className={`fa-solid ${active ? 'fa-check' : icon} ${active ? 'text-xs' : 'text-sm'}`}></i>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={`text-[11px] font-black uppercase tracking-tight truncate ${active ? 'text-emerald-900' : 'text-slate-500'}`}>
        {label}
      </h4>
      <p className={`text-[9px] font-medium leading-tight mt-1 truncate ${active ? 'text-emerald-700' : 'text-slate-400'}`}>
        {desc}
      </p>
    </div>
  </div>
);

export default CircuitSimulation;
