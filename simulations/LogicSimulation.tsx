
import React, { useState, useMemo } from 'react';

const GATE_INFO: Record<string, { 
  description: string; 
  concept: string; 
  symbol: string; 
  color: string; 
  formula: string; 
  transistors: number; 
  useCase: string; 
  delay: string; 
  power: string;
  topology: string;
  advantage: string;
}> = {
  AND: {
    description: "Returns TRUE only if every input carries a HIGH signal. Used as a 'Guard' gate in complex systems.",
    concept: "Logical Conjunction",
    symbol: "∧",
    color: "text-emerald-400",
    formula: "Y = A · B",
    transistors: 6,
    useCase: "Security access validation",
    delay: "1.2ns",
    power: "4.5mW",
    topology: "Series NMOS Pull-down / Parallel PMOS Pull-up",
    advantage: "High noise immunity and stable output voltage."
  },
  OR: {
    description: "Returns TRUE if any input carries a HIGH signal. Ideal for redundant 'Safe-to-Operate' triggers.",
    concept: "Logical Disjunction",
    symbol: "∨",
    color: "text-sky-400",
    formula: "Y = A + B",
    transistors: 6,
    useCase: "Redundant sensor arrays",
    delay: "1.1ns",
    power: "4.8mW",
    topology: "Parallel NMOS Pull-down / Series PMOS Pull-up",
    advantage: "Rapid signal propagation in wide-fan-in scenarios."
  },
  XOR: {
    description: "Returns TRUE only if inputs differ. The core component of Binary Addition and parity checks.",
    concept: "Exclusive Disjunction",
    symbol: "⊕",
    color: "text-purple-400",
    formula: "Y = A ⊕ B",
    transistors: 8,
    useCase: "Binary Full-Adder logic",
    delay: "1.6ns",
    power: "7.2mW",
    topology: "Complex Transmission Gate / Inverter Pass-logic",
    advantage: "Essential for efficient half-adder and parity logic."
  },
  NAND: {
    description: "The 'Universal Gate'. Inverted AND logic that can construct every other logic gate in existence.",
    concept: "Negative Conjunction",
    symbol: "⊼",
    color: "text-rose-400",
    formula: "Y = ¬(A · B)",
    transistors: 4,
    useCase: "Universal gate fabrication",
    delay: "0.9ns",
    power: "3.2mW",
    topology: "Direct Series NMOS / Parallel PMOS Stack",
    advantage: "Most power-efficient and smallest footprint in silicon."
  },
  NOR: {
    description: "The 'Universal Gate'. Returns TRUE only if all inputs are LOW. Essential for Flash memory storage.",
    concept: "Negative Disjunction",
    symbol: "⊽",
    color: "text-orange-400",
    formula: "Y = ¬(A + B)",
    transistors: 4,
    useCase: "High-speed memory arrays",
    delay: "1.0ns",
    power: "3.5mW",
    topology: "Direct Parallel NMOS / Series PMOS Stack",
    advantage: "Fastest response to any HIGH input signal transitions."
  }
};

const LogicSimulation: React.FC = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [gate, setGate] = useState<'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR'>('AND');

  const output = useMemo(() => {
    switch (gate) {
      case 'AND': return a && b ? 1 : 0;
      case 'OR': return a || b ? 1 : 0;
      case 'XOR': return a ^ b;
      case 'NAND': return !(a && b) ? 1 : 0;
      case 'NOR': return !(a || b) ? 1 : 0;
      default: return 0;
    }
  }, [a, b, gate]);

  const currentInfo = GATE_INFO[gate];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20 px-4 md:px-0 min-h-[900px]">
      
      {/* 1. Logic Matrix Core & Implementation Protocol (Left Column) */}
      <div className="lg:col-span-8 flex flex-col gap-8 order-1 h-full">
        
        {/* Main Logic Terminal */}
        <div className="bg-[#020617] rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-slate-800 relative flex flex-col items-center overflow-hidden min-h-[600px]">
          
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] animate-pulse"></div>
          </div>

          <div className="absolute top-10 left-10 z-30 flex flex-col gap-3">
             <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 w-fit shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Hardware Layer v8.5</span>
             </div>
          </div>

          <div className="w-full max-w-3xl flex-1 flex items-center justify-between relative mt-20 mb-10 z-10">
             <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
                <path d="M 100 120 L 350 120" fill="none" stroke={a ? "#2dd4bf" : "#1e293b"} strokeWidth="4" className={`transition-all duration-500 ${a ? 'drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]' : ''}`} />
                <path d="M 100 280 L 350 280" fill="none" stroke={b ? "#2dd4bf" : "#1e293b"} strokeWidth="4" className={`transition-all duration-500 ${b ? 'drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]' : ''}`} />
                <path d="M 450 200 L 700 200" fill="none" stroke={output ? "#2dd4bf" : "#1e293b"} strokeWidth="6" className={`transition-all duration-500 ${output ? 'drop-shadow-[0_0_12px_rgba(45,212,191,0.8)]' : ''}`} />
             </svg>

             <div className="flex flex-col gap-32 relative z-20">
                {[a, b].map((val, i) => (
                  <button key={i} onClick={() => i === 0 ? setA(a ? 0 : 1) : setB(b ? 0 : 1)}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] border-4 flex flex-col items-center justify-center gap-2 transition-all duration-500 group relative ${val ? 'bg-teal-500/20 border-teal-400 shadow-[0_0_40px_rgba(45,212,191,0.2)]' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest absolute -top-8 left-1/2 -translate-x-1/2">Input {i === 0 ? 'A' : 'B'}</span>
                    <span className={`text-3xl md:text-4xl font-black tabular-nums ${val ? 'text-teal-400' : 'text-slate-700'}`}>{val}</span>
                  </button>
                ))}
             </div>

             <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-[10px] border-double transition-colors duration-700 animate-[spin_10s_linear_infinite] ${output ? 'border-teal-400/30' : 'border-slate-800'}`}></div>
                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-slate-900 border-2 flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ${output ? 'border-teal-400 shadow-[0_0_50px_rgba(45,212,191,0.3)]' : 'border-slate-700'}`}>
                   <span className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">{gate}</span>
                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${output ? 'text-teal-400' : 'text-slate-600'}`}>{currentInfo.symbol}</span>
                </div>
             </div>

             <div className="relative z-20">
                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-[12px] flex items-center justify-center transition-all duration-700 relative overflow-hidden ${output ? 'bg-teal-500/10 border-teal-400 shadow-[0_0_80px_rgba(45,212,191,0.4)]' : 'bg-slate-900 border-slate-800'}`}>
                   <i className={`fa-solid fa-bolt text-3xl md:text-4xl transition-all duration-700 ${output ? 'text-teal-400 scale-125' : 'text-slate-800'}`}></i>
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Output Result</span>
             </div>
          </div>

          <div className="mt-auto w-full max-w-2xl bg-white/5 backdrop-blur-md p-2 rounded-[2.5rem] border border-white/10 flex justify-between gap-1 shadow-2xl relative z-30 mb-2">
             {Object.keys(GATE_INFO).map((g) => (
               <button key={g} onClick={() => setGate(g as any)}
                 className={`flex-1 py-4 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${gate === g ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                 {g}
               </button>
             ))}
          </div>
        </div>

        {/* NEW: Implementation Protocol - FILLS SPACE BELOW AND ALIGNS WITH SIDEBAR BOTTOM */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl flex flex-col flex-1 relative overflow-hidden group min-h-[400px]">
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                       <i className="fa-solid fa-microchip"></i>
                    </div>
                    <div>
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Electronic Switching</h3>
                       <p className="text-xl font-black text-slate-900 tracking-tight">Implementation Protocol</p>
                    </div>
                 </div>
                 <div className="hidden md:flex gap-4">
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Vcc High</span>
                       <span className="text-xs font-black text-emerald-600 leading-none">5.0V DC</span>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Gnd Low</span>
                       <span className="text-xs font-black text-slate-900 leading-none">0.0V DC</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                 <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                       <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-3">CMOS Topology</p>
                       <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">
                          {currentInfo.topology}
                       </p>
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          <i className="fa-solid fa-circle-nodes text-indigo-300"></i>
                          MOSFET Configuration Active
                       </div>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                       <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3">Performance Advantage</p>
                       <p className="text-sm font-bold text-emerald-900 leading-relaxed italic">
                          "{currentInfo.advantage}"
                       </p>
                    </div>
                 </div>

                 <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative flex flex-col justify-center overflow-hidden border border-slate-800 shadow-2xl">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Silicon Footprint Analysis</h4>
                    <div className="space-y-4">
                       {[
                         { label: 'Gate Capacitance', val: 'Low', color: 'bg-emerald-500' },
                         { label: 'Switching Velocity', val: 'Ultra-Fast', color: 'bg-indigo-500' },
                         { label: 'Thermal Output', val: 'Optimized', color: 'bg-amber-500' }
                       ].map((stat, idx) => (
                         <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                               <span>{stat.label}</span>
                               <span className="text-white">{stat.val}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full ${stat.color} w-[85%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]`}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <i className="fa-solid fa-atom absolute -bottom-10 -right-10 text-[160px] opacity-[0.03] rotate-12 transition-transform duration-700 group-hover:scale-110"></i>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    Integrated Component Topology
                 </span>
                 <span className="opacity-40">Serial: LX-7000-LOGIC</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Analytical Sidebar (Right Column) */}
      <div className="lg:col-span-4 flex flex-col gap-6 order-2 h-full">
        
        {/* Module 1: Holographic Truth Table */}
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col min-h-[300px]">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6 flex items-center gap-2">
             <i className="fa-solid fa-table-list"></i> TRUTH TABLE TELEMETRY
           </h3>
           <div className="space-y-2 relative z-10 flex-1">
              <div className="grid grid-cols-3 text-center text-[9px] font-black text-slate-500 uppercase tracking-widest pb-3 border-b border-slate-800 mb-2">
                 <span>Input A</span> <span>Input B</span> <span>Output</span>
              </div>
              {[ {ia: 0, ib: 0}, {ia: 0, ib: 1}, {ia: 1, ib: 0}, {ia: 1, ib: 1} ].map((row, idx) => {
                let res = 0;
                if (gate === 'AND') res = row.ia && row.ib ? 1 : 0;
                else if (gate === 'OR') res = row.ia || row.ib ? 1 : 0;
                else if (gate === 'XOR') res = row.ia ^ row.ib ? 1 : 0;
                else if (gate === 'NAND') res = !(row.ia && row.ib) ? 1 : 0;
                else if (gate === 'NOR') res = !(row.ia || row.ib) ? 1 : 0;
                const isCurrent = a === row.ia && b === row.ib;
                return (
                  <div key={idx} className={`grid grid-cols-3 text-center py-2 rounded-xl transition-all duration-300 border ${isCurrent ? 'bg-teal-500/10 border-teal-500/50 text-white shadow-lg' : 'border-transparent text-slate-500 opacity-40'}`}>
                     <span className="font-mono font-black">{row.ia}</span>
                     <span className="font-mono font-black">{row.ib}</span>
                     <span className={`font-mono font-black ${isCurrent && res ? 'text-teal-400' : ''}`}>{res}</span>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Module 2: Technical Dossier */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200 flex flex-col min-h-[450px] relative overflow-hidden">
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-all ${output ? 'bg-teal-600' : 'bg-slate-900'}`}>
                    <i className="fa-solid fa-fingerprint"></i>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-2">Classification</h4>
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{gate} Specification</p>
                 </div>
              </div>

              <div className="space-y-6 flex-1">
                 <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-2">Gate Definition</p>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{currentInfo.description}"</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-2xl flex flex-col gap-1 border-b-4 border-teal-500/30">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Delay (tpd)</span>
                       <span className="text-white font-black text-base tabular-nums">{currentInfo.delay}</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl flex flex-col gap-1 border-b-4 border-teal-500/30">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Power (Pd)</span>
                       <span className="text-white font-black text-base tabular-nums">{currentInfo.power}</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl flex flex-col gap-1 border-b-4 border-teal-500/30">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Transistors</span>
                       <span className="text-white font-black text-base tabular-nums">{currentInfo.transistors}</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl flex flex-col gap-1 border-b-4 border-teal-500/30">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Logic Class</span>
                       <span className="text-white font-black text-base tabular-nums">CMOS</span>
                    </div>
                 </div>

                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Boolean Algebra</span>
                    </div>
                    <p className="text-lg font-mono font-black text-indigo-900 text-center">{currentInfo.formula}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Module 3: Universal Application Suite */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group min-h-[220px]">
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <i className="fa-solid fa-graduation-cap text-teal-200"></i>
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-200 mb-1">REAL-WORLD LOGIC</h3>
                    <p className="text-base font-black leading-none">Engineering Case</p>
                 </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-4">
                 <p className="text-xs font-bold leading-relaxed">
                   "{currentInfo.useCase}"
                 </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-teal-200">System Ready</span>
                 </div>
              </div>
           </div>
           <i className="fa-solid fa-microchip absolute -bottom-6 -right-6 text-[140px] opacity-[0.05] -rotate-12 transition-transform duration-700 group-hover:scale-110"></i>
        </div>

      </div>
    </div>
  );
};

export default LogicSimulation;
