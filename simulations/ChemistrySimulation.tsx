
import React, { useState, useMemo } from 'react';

interface ChemicalReaction {
  id: string;
  name: string;
  formula: string;
  reactants: { id: string; name: string; formula: string; atoms: { H?: number; O?: number; N?: number; C?: number } }[];
  products: { id: string; name: string; formula: string; atoms: { H?: number; O?: number; N?: number; C?: number } }[];
  correctCounts: number[]; // Correct counts to balance
}

const REACTIONS: ChemicalReaction[] = [
  {
    id: 'h2o',
    name: 'Formation of Water',
    formula: 'H₂ + O₂ → H₂O',
    reactants: [
      { id: 'h2', name: 'Hydrogen', formula: 'H₂', atoms: { H: 2 } },
      { id: 'o2', name: 'Oxygen', formula: 'O₂', atoms: { O: 2 } }
    ],
    products: [
      { id: 'h2o', name: 'Water', formula: 'H₂O', atoms: { H: 2, O: 1 } }
    ],
    correctCounts: [2, 1, 2] // 2H2 + 1O2 -> 2H2O
  },
  {
    id: 'nh3',
    name: 'Ammonia Synthesis',
    formula: 'N₂ + H₂ → NH₃',
    reactants: [
      { id: 'n2', name: 'Nitrogen', formula: 'N₂', atoms: { N: 2 } },
      { id: 'h2', name: 'Hydrogen', formula: 'H₂', atoms: { H: 2 } }
    ],
    products: [
      { id: 'nh3', name: 'Ammonia', formula: 'NH₃', atoms: { N: 1, H: 3 } }
    ],
    correctCounts: [1, 3, 2] // 1N2 + 3H2 -> 2NH3
  },
  {
    id: 'ch4',
    name: 'Methane Combustion',
    formula: 'CH₄ + O₂ → CO₂ + H₂O',
    reactants: [
      { id: 'ch4', name: 'Methane', formula: 'CH₄', atoms: { C: 1, H: 4 } },
      { id: 'o2', name: 'Oxygen', formula: 'O₂', atoms: { O: 2 } }
    ],
    products: [
      { id: 'co2', name: 'Carbon Dioxide', formula: 'CO₂', atoms: { C: 1, O: 2 } },
      { id: 'h2o', name: 'Water', formula: 'H₂O', atoms: { H: 2, O: 1 } }
    ],
    correctCounts: [1, 2, 1, 2] // CH4 + 2O2 -> CO2 + 2H2O
  }
];

const ChemistrySimulation: React.FC = () => {
  const [activeReactionIdx, setActiveReactionIdx] = useState(0);
  const reaction = REACTIONS[activeReactionIdx];
  const [counts, setCounts] = useState<number[]>(new Array(REACTIONS[activeReactionIdx].reactants.length + REACTIONS[activeReactionIdx].products.length).fill(0));

  const handleReset = (newIdx: number) => {
    setActiveReactionIdx(newIdx);
    setCounts(new Array(REACTIONS[newIdx].reactants.length + REACTIONS[newIdx].products.length).fill(0));
  };

  const updateCount = (idx: number, delta: number) => {
    const newCounts = [...counts];
    newCounts[idx] = Math.max(0, newCounts[idx] + delta);
    setCounts(newCounts);
  };

  const stats = useMemo(() => {
    const reactantAtoms: Record<string, number> = {};
    const productAtoms: Record<string, number> = {};
    
    reaction.reactants.forEach((r, i) => {
      Object.entries(r.atoms).forEach(([atom, count]) => {
        reactantAtoms[atom] = (reactantAtoms[atom] || 0) + (count * counts[i]);
      });
    });

    reaction.products.forEach((p, i) => {
      const idx = reaction.reactants.length + i;
      Object.entries(p.atoms).forEach(([atom, count]) => {
        productAtoms[atom] = (productAtoms[atom] || 0) + (count * counts[idx]);
      });
    });

    const allAtoms = Array.from(new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]));
    const isBalanced = allAtoms.length > 0 && allAtoms.every(a => reactantAtoms[a] === productAtoms[a]);
    
    const leftTotal = Object.values(reactantAtoms).reduce((a, b) => a + b, 0);
    const rightTotal = Object.values(productAtoms).reduce((a, b) => a + b, 0);
    const diff = rightTotal - leftTotal;
    const rotation = Math.max(-15, Math.min(15, diff * 5));

    return { reactantAtoms, productAtoms, allAtoms, isBalanced, rotation, leftTotal, rightTotal };
  }, [reaction, counts]);

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 max-w-7xl mx-auto px-4 md:px-0">
      {/* Top Controls: Reaction Selection */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Select Simulator Session</h3>
          <p className="text-xl font-black text-slate-800 tracking-tight">{reaction.name}</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          {REACTIONS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => handleReset(i)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeReactionIdx === i ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {r.formula}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Equation & Balance Scale View */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] p-6 md:px-12 md:py-10 shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="text-center shrink-0">
            <span className="inline-block px-4 py-2 bg-indigo-50 rounded-2xl text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 shadow-sm border border-indigo-100">Mass Conservation Simulator</span>
            
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-lg md:text-xl font-black bg-slate-900 py-6 px-10 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl text-white relative z-50">
               {reaction.reactants.map((r, i) => (
                  <React.Fragment key={r.id}>
                    <div className="flex flex-col items-center">
                      <span className="text-indigo-400 text-3xl tabular-nums">{counts[i] || '?'}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{r.formula}</span>
                    </div>
                    {i < reaction.reactants.length - 1 && <span className="text-slate-700 text-xl font-light">+</span>}
                  </React.Fragment>
               ))}
               <span className="text-slate-600 text-3xl px-2">→</span>
               {reaction.products.map((p, i) => (
                  <React.Fragment key={p.id}>
                    <div className="flex flex-col items-center">
                      <span className="text-pink-400 text-3xl tabular-nums">{counts[reaction.reactants.length + i] || '?'}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{p.formula}</span>
                    </div>
                    {i < reaction.products.length - 1 && <span className="text-slate-700 text-xl font-light">+</span>}
                  </React.Fragment>
               ))}
            </div>
          </div>

          <div className="relative mt-32 flex flex-col items-center justify-center min-h-[450px]">
             {/* Center Base Line */}
             <div className="absolute bottom-6 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
             
             <div className="relative w-full max-w-2xl flex flex-col items-center">
                {/* Balance Arm */}
                <div 
                  className="w-full h-4 bg-slate-800 rounded-full transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) relative z-20 shadow-2xl ring-4 ring-slate-900/10"
                  style={{ transform: `rotate(${stats.rotation}deg)` }}
                >
                   {/* Left Hanging Part (Reactants) */}
                   <div className="absolute -left-4 md:-left-8 -top-2 w-32 md:w-44 transition-all duration-1000 origin-top" style={{ transform: `rotate(${-stats.rotation}deg)` }}>
                     {/* Chamber sitting ON the plate area */}
                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 md:w-36 h-40 bg-cyan-500/10 border-x-2 border-t-2 border-cyan-200/40 rounded-t-3xl rounded-b-lg shadow-[inset_0_10px_30px_rgba(34,211,238,0.1)] overflow-hidden z-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent"></div>
                        <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded-full"></div>
                        {/* Fill level based on mass */}
                        <div className="absolute bottom-0 w-full bg-cyan-400/30 transition-all duration-1000" style={{ height: `${Math.min(100, (stats.leftTotal / 12) * 100)}%` }}></div>
                     </div>
                     
                     {/* Strings/Supports */}
                     <div className="h-40 border-l-2 border-r-2 border-slate-300 mx-auto w-1 rotate-[-8deg] absolute left-[45%] top-2 opacity-40"></div>
                     <div className="h-40 border-l-2 border-r-2 border-slate-300 mx-auto w-1 rotate-[8deg] absolute right-[45%] top-2 opacity-40"></div>
                     
                     {/* Label Plate */}
                     <div className="absolute top-40 -left-2 right-2 h-12 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white text-[10px] font-black uppercase tracking-widest border-b-4 border-indigo-900 z-10">
                       <span>REACTANTS</span>
                       <span className="text-[8px] opacity-70">MASS: {stats.leftTotal}</span>
                     </div>
                   </div>

                   {/* Right Hanging Part (Products) */}
                   <div className="absolute -right-4 md:-right-8 -top-2 w-32 md:w-44 transition-all duration-1000 origin-top" style={{ transform: `rotate(${-stats.rotation}deg)` }}>
                     {/* Chamber sitting ON the plate area */}
                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 md:w-36 h-40 bg-teal-500/10 border-x-2 border-t-2 border-teal-200/40 rounded-t-3xl rounded-b-lg shadow-[inset_0_10px_30px_rgba(20,184,166,0.1)] overflow-hidden z-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20 via-transparent to-transparent"></div>
                        <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded-full"></div>
                        <div className="absolute bottom-0 w-full bg-teal-400/30 transition-all duration-1000" style={{ height: `${Math.min(100, (stats.rightTotal / 12) * 100)}%` }}></div>
                     </div>

                     <div className="h-40 border-l-2 border-r-2 border-slate-300 mx-auto w-1 rotate-[-8deg] absolute left-[45%] top-2 opacity-40"></div>
                     <div className="h-40 border-l-2 border-r-2 border-slate-300 mx-auto w-1 rotate-[8deg] absolute right-[45%] top-2 opacity-40"></div>
                     
                     <div className="absolute top-40 -left-2 right-2 h-12 bg-gradient-to-b from-pink-500 to-pink-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white text-[10px] font-black uppercase tracking-widest border-b-4 border-pink-900 z-10">
                       <span>PRODUCTS</span>
                       <span className="text-[8px] opacity-70">MASS: {stats.rightTotal}</span>
                     </div>
                   </div>

                   {/* Center Pivot Point */}
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-600 border-4 border-slate-800 shadow-xl z-30"></div>
                </div>
                
                {/* Stand */}
                <div className="w-10 h-48 bg-gradient-to-b from-slate-200 to-slate-300 border-x-4 border-slate-400 -mt-2 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 w-1 ml-1.5"></div>
                </div>
                <div className="w-40 h-8 bg-slate-900 rounded-t-[2.5rem] shadow-2xl border-b-8 border-slate-800"></div>

                {/* Balance Status Badge */}
                <div className={`mt-8 px-10 py-3 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-700 ${
                  stats.isBalanced 
                    ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-200 scale-105 ring-4 ring-emerald-100 translate-y-[-5px]' 
                    : 'bg-white text-slate-400 border-2 border-slate-100 shadow-xl'
                }`}>
                  {stats.isBalanced ? (
                    <span className="flex items-center gap-3">
                      <i className="fa-solid fa-circle-check text-emerald-200"></i> Balanced
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <i className="fa-solid fa-scale-unbalanced text-slate-300"></i> Calibrating...
                    </span>
                  )}
                </div>
             </div>
          </div>
        </div>

        {/* Control Deck (Side) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Control Deck</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coefficients Configuration</p>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
              {reaction.reactants.map((r, i) => (
                <ControlCard 
                  key={r.id}
                  title={r.name} 
                  formula={r.formula}
                  count={counts[i]} 
                  setCount={(c: number) => updateCount(i, c - counts[i])} 
                  color="indigo" 
                  icon="fa-flask" 
                  mini
                />
              ))}
              <div className="h-px bg-slate-100 my-2"></div>
              {reaction.products.map((p, i) => (
                <ControlCard 
                  key={p.id}
                  title={p.name} 
                  formula={p.formula}
                  count={counts[reaction.reactants.length + i]} 
                  setCount={(c: number) => updateCount(reaction.reactants.length + i, c - counts[reaction.reactants.length + i])} 
                  color="pink" 
                  icon="fa-vial" 
                  mini
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                 <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Scientific Note</p>
                   <p className="text-xs font-bold leading-relaxed opacity-90">
                     Every atom present at the start must be accounted for at the end.
                   </p>
                 </div>
                 <i className="fa-solid fa-graduation-cap absolute -bottom-4 -right-4 text-6xl opacity-10 -rotate-12"></i>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-800 relative overflow-hidden">
           <div className="relative z-10">
             <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
               Live Atomic Telemetry
             </h4>
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Inputs</p>
                  {stats.allAtoms.map(atom => (
                    <AnalysisRow key={atom} label={`Atoms of ${atom}`} value={stats.reactantAtoms[atom] || 0} />
                  ))}
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Outputs</p>
                  {stats.allAtoms.map(atom => (
                    <AnalysisRow 
                      key={atom} 
                      label={`Atoms of ${atom}`} 
                      value={stats.productAtoms[atom] || 0} 
                      highlight={stats.productAtoms[atom] === stats.reactantAtoms[atom] && (stats.reactantAtoms[atom] || 0) > 0} 
                    />
                  ))}
                </div>
             </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-slate-100 to-white rounded-[3rem] p-10 border border-slate-200 shadow-xl flex flex-col justify-center">
           <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Conservation of Mass</h3>
           <p className="text-base text-slate-600 leading-relaxed font-medium">
             In a chemical reaction, matter is neither created nor destroyed. The total mass of reactants always equals the total mass of products.
           </p>
           <div className="mt-8 flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-atom"></i>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Principles</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight">Stoichiometry Logic</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ControlCard = ({ title, formula, count, setCount, color, icon, mini }: any) => (
  <div className={`bg-white rounded-[2rem] border shadow-sm transition-all duration-300 hover:border-slate-300 ${mini ? 'p-4 border-slate-100' : 'p-6 md:p-8 border-slate-200 shadow-xl'}`}>
    <div className={`flex items-center gap-3 ${mini ? 'mb-4' : 'mb-6'}`}>
      <div className={`w-8 h-8 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-inner shrink-0`}>
        <i className={`fa-solid ${icon} text-xs`}></i>
      </div> 
      <div className="truncate">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</h3>
        <p className="text-xs font-black text-slate-800 leading-none">{formula}</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <button 
        onClick={() => setCount(Math.max(0, count - 1))} 
        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg font-bold text-slate-400 hover:bg-slate-100 transition-all active:scale-90"
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      <span className="text-3xl font-black text-slate-800 tabular-nums">{count}</span>
      <button 
        onClick={() => setCount(count + 1)} 
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg transition-all active:scale-90 ${color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}`}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>
);

const AnalysisRow = ({ label, value, highlight }: any) => (
  <div className="flex justify-between items-center group">
    <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors">{label}</span>
    <span className={`text-lg font-black transition-all duration-500 tabular-nums ${highlight ? 'text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-slate-100'}`}>
      {value}
    </span>
  </div>
);

export default ChemistrySimulation;
