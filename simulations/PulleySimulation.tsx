
import React, { useState, useMemo } from 'react';

const PulleySimulation: React.FC = () => {
  const [mass, setMass] = useState(40); // kg
  const [system, setSystem] = useState<1 | 2 | 4>(1);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 100

  const stats = useMemo(() => {
    const gravity = 9.81;
    const weightOfObject = mass * gravity;
    const effortForce = weightOfObject / system;
    const ma = system; // Ideal Mechanical Advantage
    const distanceEffort = 1 * system; // How much rope pulled per 1m of lift
    
    return { weightOfObject, effortForce, ma, gravity, distanceEffort };
  }, [mass, system]);

  const systemExplanation = useMemo(() => {
    switch (system) {
      case 1:
        return {
          title: "Single Fixed Pulley System",
          type: "Directional Lever",
          description: "This configuration acts as a first-class lever with equal arms. It provides no mechanical advantage (MA = 1), meaning the effort force is exactly equal to the weight. Its primary utility is the redirection of force, allowing an operator to pull downward—using body weight to their advantage—to lift a load upward.",
          benefit: "Redirection of force for ergonomic efficiency.",
          segments: 1
        };
      case 2:
        return {
          title: "Single Movable Pulley System",
          type: "Force Multiplier",
          description: "By adding a movable pulley, the load is now supported by two segments of rope. This effectively halves the effort required to lift the object (MA = 2). However, following the law of work conservation, you must pull twice the amount of rope (2 meters) to lift the load 1 meter high.",
          benefit: "50% reduction in required lifting force.",
          segments: 2
        };
      case 4:
        return {
          title: "Block and Tackle (4x) System",
          type: "High-Gain Compounding",
          description: "This advanced 'Gun Tackle' configuration utilizes four distinct rope segments to distribute the weight. The effort required is reduced to 25% of the total load (MA = 4). This system is essential for heavy industrial lifting where human-scale force must manipulate massive payloads.",
          benefit: "Significant force multiplication for extreme loads.",
          segments: 4
        };
      default:
        return null;
    }
  }, [system]);

  const handleReset = () => {
    setMass(40);
    setSystem(1);
    setPullProgress(0);
  };

  const renderPulleys = () => {
    const liftAmount = (pullProgress / 100) * 140 / system;
    const ropeColor = "#94a3b8";
    const pulleyGrad = "url(#pulleyGradient)";
    
    switch (system) {
      case 1:
        return (
          <g className="animate-in fade-in zoom-in-95 duration-500">
            <rect x="50" y="10" width="300" height="8" rx="4" fill="#1e293b" />
            <path d="M 200 18 L 200 35" stroke="#475569" strokeWidth="4" />
            <path 
              d={`M 140 380 L 140 50 Q 140 20 160 20 L 240 20 Q 260 20 260 50 L 260 ${180 + liftAmount}`} 
              fill="none" stroke={ropeColor} strokeWidth="6" strokeLinecap="round" strokeDasharray="3,2"
            />
            <circle cx="200" cy="50" r="32" fill={pulleyGrad} stroke="#0f172a" strokeWidth="4" />
            <circle cx="200" cy="50" r="6" fill="#0f172a" />
            <g transform={`translate(230, ${180 + liftAmount})`}>
              <rect x="0" y="0" width="60" height="50" rx="12" fill="#0f172a" className="shadow-2xl" />
              <rect x="6" y="6" width="48" height="38" rx="6" fill="#f43f5e" />
              <text x="30" y="32" textAnchor="middle" fill="white" className="text-[12px] font-black tabular-nums">{mass}kg</text>
            </g>
            <circle cx="140" cy={380 - (pullProgress * 1.5)} r="12" fill="#f43f5e" stroke="white" strokeWidth="3" />
          </g>
        );
      case 2:
        return (
          <g className="animate-in fade-in zoom-in-95 duration-500">
             <rect x="50" y="10" width="300" height="8" rx="4" fill="#1e293b" />
             <path 
                d={`M 160 38 L 160 ${260 - liftAmount} Q 200 ${310 - liftAmount} 240 ${260 - liftAmount} L 240 50 L 310 50 L 310 ${100 + (pullProgress * 1.5)}`} 
                fill="none" stroke={ropeColor} strokeWidth="6" strokeLinecap="round" strokeDasharray="3,2"
             />
             <path d="M 240 18 L 240 35" stroke="#475569" strokeWidth="4" />
             <circle cx="240" cy="50" r="28" fill={pulleyGrad} stroke="#0f172a" strokeWidth="4" />
             <circle cx="200" cy={260 - liftAmount} r="32" fill={pulleyGrad} stroke="#0f172a" strokeWidth="4" />
             <g transform={`translate(170, ${295 - liftAmount})`}>
                <rect x="0" y="0" width="60" height="50" rx="12" fill="#0f172a" />
                <rect x="6" y="6" width="48" height="38" rx="6" fill="#f43f5e" />
                <text x="30" y="32" textAnchor="middle" fill="white" className="text-[12px] font-black tabular-nums">{mass}kg</text>
             </g>
             <circle cx="310" cy={100 + (pullProgress * 1.5)} r="12" fill="#f43f5e" stroke="white" strokeWidth="3" />
          </g>
        );
      case 4:
        const moveY = 240 - liftAmount;
        return (
          <g className="animate-in fade-in zoom-in-95 duration-500">
            <rect x="50" y="10" width="300" height="8" rx="4" fill="#1e293b" />
            <path 
              d={`M 140 18 L 140 ${moveY} Q 165 ${moveY+35} 190 ${moveY} L 190 50 Q 215 15 240 50 L 240 ${moveY} Q 265 ${moveY+35} 290 ${moveY} L 290 50 L 350 50 L 350 ${100 + (pullProgress * 2.2)}`} 
              fill="none" stroke={ropeColor} strokeWidth="6" strokeLinecap="round" strokeDasharray="3,2"
            />
            <path d="M 190 18 L 190 35" stroke="#475569" strokeWidth="4" />
            <path d="M 240 18 L 240 35" stroke="#475569" strokeWidth="4" />
            <path d="M 290 18 L 290 35" stroke="#475569" strokeWidth="4" />
            <circle cx="190" cy="50" r="22" fill={pulleyGrad} stroke="#0f172a" strokeWidth="3" />
            <circle cx="240" cy="50" r="22" fill={pulleyGrad} stroke="#0f172a" strokeWidth="3" />
            <circle cx="290" cy="50" r="22" fill={pulleyGrad} stroke="#0f172a" strokeWidth="3" />
            <rect x="150" y={moveY-5} width="130" height="10" rx="5" fill="#1e293b" />
            <circle cx="165" cy={moveY} r="26" fill={pulleyGrad} stroke="#0f172a" strokeWidth="4" />
            <circle cx="265" cy={moveY} r="26" fill={pulleyGrad} stroke="#0f172a" strokeWidth="4" />
            <g transform={`translate(185, ${moveY + 35})`}>
                <rect x="0" y="0" width="60" height="50" rx="12" fill="#0f172a" />
                <rect x="6" y="6" width="48" height="38" rx="6" fill="#f43f5e" />
                <text x="30" y="32" textAnchor="middle" fill="white" className="text-[12px] font-black tabular-nums">{mass}kg</text>
             </g>
             <circle cx="350" cy={100 + (pullProgress * 2.2)} r="12" fill="#f43f5e" stroke="white" strokeWidth="3" />
          </g>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12 max-w-[1600px] mx-auto w-full px-4 md:px-0">
      
      {/* 1. Scientific Header */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl rotate-3">
            <i className="fa-solid fa-weight-hanging text-2xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Pulley Dynamics Simulator</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Instrumentation v2.4</p>
            </div>
          </div>
        </div>
        
        <button onClick={handleReset} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
          <i className="fa-solid fa-arrows-rotate"></i> Reset Environment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT: Physical Viewport & Analytics (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Main Visualizer Window */}
          <div className="bg-[#0f172a] rounded-[3.5rem] p-12 shadow-2xl border border-slate-800 relative overflow-hidden h-[550px] flex items-center justify-center group">
            
            {/* HUD Overlays */}
            <div className="absolute top-10 left-10 space-y-3 pointer-events-none z-20">
              <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Optical Stage</span>
              </div>
            </div>

            <div className="absolute top-10 right-10 text-right pointer-events-none z-20">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Mechanical Gain</p>
              <p className="text-4xl font-black text-white tabular-nums tracking-tighter">
                {stats.ma} <span className="text-xs text-rose-500 font-bold tracking-widest ml-1">IMA</span>
              </p>
            </div>

            {/* Simulation Canvas */}
            <svg width="100%" height="100%" viewBox="0 0 400 400" className="max-w-[500px] drop-shadow-2xl h-full">
              <defs>
                <linearGradient id="pulleyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="40%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <pattern id="laserGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#laserGrid)" />
              {renderPulleys()}
            </svg>

            {/* Manual Displacement Controller */}
            <div className="absolute bottom-10 right-10 w-64 p-8 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Displacement</span>
                 <span className="text-xs font-black text-white tabular-nums">{pullProgress}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={pullProgress}
                onChange={(e) => setPullProgress(parseInt(e.target.value))}
                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-grab active:cursor-grabbing accent-rose-500"
              />
            </div>
          </div>

          {/* Bottom Analytics Panel */}
          <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                     <i className="fa-solid fa-chart-simple"></i>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Force Distribution</h3>
               </div>
               
               <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Weight of Object</span>
                       <span className="text-slate-900 tabular-nums">{stats.weightOfObject.toFixed(1)} N</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-400 w-full rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-rose-500 uppercase tracking-widest">
                       <span>Required Effort Force</span>
                       <span className="text-rose-600 tabular-nums font-black">{stats.effortForce.toFixed(1)} N</span>
                    </div>
                    <div className="h-3 bg-rose-100 rounded-full overflow-hidden">
                       <div className="h-full bg-rose-500 transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]" style={{ width: `${(stats.effortForce / stats.weightOfObject) * 100}%` }}></div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Force Save</span>
                     <span className="text-3xl font-black text-slate-900 tracking-tighter">
                        {Math.round((1 - 1/stats.ma) * 100)}%
                     </span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rope Length</span>
                     <span className="text-3xl font-black text-slate-900 tracking-tighter">
                        {stats.distanceEffort}x
                     </span>
                  </div>
               </div>
               <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                    "This system reduces the required force by {Math.round((1 - 1/stats.ma) * 100)}% but requires you to pull {stats.distanceEffort}m of rope for every 1m of lift."
                  </p>
               </div>
            </div>
          </div>

          {/* NEW: Detailed System Explanation Panel - FILLS THE EMPTY SPACE */}
          <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-xl relative overflow-hidden flex-1 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="relative z-10 flex flex-col md:flex-row gap-10 h-full">
                <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                         <i className="fa-solid fa-microchip"></i>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Technical Analysis</p>
                         <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{systemExplanation?.title}</h4>
                      </div>
                   </div>
                   
                   <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
                      {systemExplanation?.description}
                   </p>

                   <div className="flex flex-wrap gap-4 pt-4">
                      <div className="bg-slate-900 px-5 py-3 rounded-2xl flex flex-col gap-1">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Architecture</span>
                         <span className="text-white font-bold text-xs">{systemExplanation?.type}</span>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 px-5 py-3 rounded-2xl flex flex-col gap-1">
                         <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Key Advantage</span>
                         <span className="text-rose-600 font-bold text-xs">{systemExplanation?.benefit}</span>
                      </div>
                   </div>
                </div>

                <div className="w-full md:w-64 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
                   <div className="relative mb-6">
                      <svg width="80" height="80" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                         <circle cx="50" cy="50" r="45" fill="none" stroke="#f43f5e" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * (1/stats.ma))} strokeLinecap="round" className="transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{systemExplanation?.segments}</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase leading-none mt-1">Segments</span>
                      </div>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Load segments bearing tension</p>
                </div>
             </div>
             
             {/* Decorative Background Icon */}
             <i className="fa-solid fa-gears absolute -bottom-10 -right-10 text-[180px] opacity-[0.03] -rotate-12"></i>
          </div>
        </div>

        {/* RIGHT: Analytical Terminal (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-8 h-full">
          
          {/* Module 1: Configuration */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-200">
            <div className="mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">System Configuration</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Calibration Panel</p>
            </div>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mechanical Architecture</label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 4].map(num => (
                    <button key={num} onClick={() => setSystem(num as any)}
                      className={`py-5 rounded-2xl font-black text-[11px] transition-all border-2 flex flex-col items-center gap-2 ${
                        system === num 
                          ? 'bg-rose-600 text-white border-rose-500 shadow-xl shadow-rose-100' 
                          : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                      }`}>
                      <i className={`fa-solid ${num === 1 ? 'fa-minus' : 'fa-grip-lines-vertical'} text-sm`}></i>
                      {num === 1 ? 'Fixed' : `${num}x Block`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Adjust Mass (m)</label>
                  <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl font-black text-xs tabular-nums">{mass} kg</span>
                </div>
                <input type="range" min="5" max="150" step="5" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} 
                  className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-rose-600 border border-slate-200" 
                />
              </div>
            </div>
          </div>

          {/* Module 2: Live Math Terminal */}
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-800 text-white">
            <div className="mb-8">
              <h3 className="text-xl font-black tracking-tight">Force Derivation</h3>
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Mathematical Engine</p>
            </div>
            
            <div className="space-y-5 font-mono text-[12px]">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-slate-500">Mass (m)</span>
                <span className="text-white font-black tabular-nums">{mass} kg</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-slate-500">Gravity (g)</span>
                <span className="text-white font-black tabular-nums">9.81 m/s²</span>
              </div>
              <div className="h-px bg-white/10 w-full"></div>
              <div className="flex justify-between items-center px-1">
                <span className="text-rose-400 text-[10px] font-black uppercase">Weight of Object</span>
                <span className="text-white font-black tabular-nums">{stats.weightOfObject.toFixed(1)} N</span>
              </div>
              <div className="flex justify-between items-center bg-rose-600/10 p-5 rounded-2xl border border-rose-500/20">
                <span className="text-slate-400">Mechanical Gain</span>
                <span className="text-rose-400 font-black tabular-nums">÷ {stats.ma}.0 factor</span>
              </div>
              <div className="pt-8 border-t border-white/10">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Final Force Result</p>
                <div className="text-5xl font-black text-white tabular-nums flex items-baseline gap-2">
                  {stats.effortForce.toFixed(1)} <span className="text-xs text-rose-500 font-bold uppercase tracking-widest">Newtons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: Theoretical Protocol */}
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[3.5rem] p-10 text-white shadow-xl relative overflow-hidden group flex-1 min-h-[300px]">
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                <i className="fa-solid fa-graduation-cap text-indigo-300"></i>
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight leading-none">The Law of Conservation</h3>
              <p className="text-xs font-bold leading-relaxed text-indigo-100/80 mb-8 italic">
                Pulleys do not reduce work; they redistribute force over distance. To lift a load with half the force, you must pull twice the rope length.
              </p>
              <div className="py-4 px-6 bg-black/20 rounded-2xl font-serif italic text-base text-center border border-white/5 shadow-inner">
                Work = Force × Distance
              </div>
            </div>
            <i className="fa-solid fa-gears absolute -bottom-10 -right-10 text-[220px] opacity-10 -rotate-12 transition-transform duration-1000 group-hover:rotate-12"></i>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PulleySimulation;
