
import React, { useState } from 'react';
import { Organelle } from '../types';

interface ExtendedOrganelle extends Organelle {
  icon: string;
  color: string;
  fact: string;
  location: { top: string; left: string };
}

const ORGANELLES: ExtendedOrganelle[] = [
  { 
    id: 'nucleus', 
    name: 'Nucleus', 
    description: 'The control center of the cell. It contains the cell\'s DNA and coordinates crucial functions like growth and reproduction.',
    fact: 'The nucleus is the largest organelle in animal cells and is protected by a double membrane called the nuclear envelope.',
    icon: 'fa-dna',
    color: 'bg-purple-500',
    location: { top: '48%', left: '48%' } // Centered
  },
  { 
    id: 'mitochondria', 
    name: 'Mitochondria', 
    description: 'Known as the "powerhouse of the cell," these organelles generate most of the cell\'s supply of adenosine triphosphate (ATP).',
    fact: 'Mitochondria have their own independent DNA, which is inherited only from your mother!',
    icon: 'fa-bolt-lightning',
    color: 'bg-orange-500',
    location: { top: '30%', left: '28%' } // Safe upper-left
  },
  { 
    id: 'chloroplast', 
    name: 'Chloroplast', 
    description: 'The site of photosynthesis in plant cells. They capture light energy to produce food (glucose) for the plant.',
    fact: 'Chloroplasts contain a green pigment called chlorophyll, which is why most plants look green.',
    isPlantOnly: true,
    icon: 'fa-sun-plant-wilt',
    color: 'bg-emerald-500',
    location: { top: '25%', left: '65%' } // Safe upper-right
  },
  { 
    id: 'cell-wall', 
    name: 'Cell Wall', 
    description: 'A rigid outer layer that provides structural support, protection, and filtering for plant cells.',
    fact: 'While animal cells only have a flexible membrane, plant cell walls are made of tough cellulose, similar to wood.',
    isPlantOnly: true,
    icon: 'fa-shield-halved',
    color: 'bg-green-700',
    location: { top: '15%', left: '50%' } // Pulled down from edge to prevent clipping
  },
  { 
    id: 'vacuole', 
    name: 'Vacuole', 
    description: 'Storage sacs for water, nutrients, or waste products. In plants, a single large central vacuole maintains cell pressure.',
    fact: 'In a healthy plant, the central vacuole is full of water, pushing against the cell wall to keep the plant upright.',
    icon: 'fa-droplet',
    color: 'bg-sky-400',
    location: { top: '65%', left: '25%' } // Safe bottom-left
  },
  { 
    id: 'golgi', 
    name: 'Golgi Apparatus', 
    description: 'The "post office" of the cell. It modifies, sorts, and packages proteins for secretion or delivery to other organelles.',
    fact: 'It was named after Camillo Golgi, the Italian biologist who discovered it in 1898.',
    icon: 'fa-box-archive',
    color: 'bg-yellow-500',
    location: { top: '68%', left: '68%' } // Safe bottom-right
  },
  { 
    id: 'ribosomes', 
    name: 'Ribosomes', 
    description: 'Tiny protein factories. They translate genetic code from the nucleus into long chains of amino acids to build proteins.',
    fact: 'A single cell can contain millions of ribosomes, showing just how important protein production is!',
    icon: 'fa-microchip',
    color: 'bg-red-400',
    location: { top: '45%', left: '80%' } // Safe middle-right
  },
  { 
    id: 'lysosome', 
    name: 'Lysosome', 
    description: 'The cell\'s waste disposal system. They contain digestive enzymes to break down waste materials and cellular debris.',
    fact: 'If a cell is damaged beyond repair, lysosomes can break open and digest the whole cell (known as self-destruction).',
    isAnimalOnly: true,
    icon: 'fa-trash-can',
    color: 'bg-rose-600',
    location: { top: '80%', left: '50%' } // Pulled up from bottom edge
  }
];

const CellSimulation: React.FC = () => {
  const [mode, setMode] = useState<'Animal' | 'Plant'>('Animal');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showDifferences, setShowDifferences] = useState(false);

  const activeOrganelles = ORGANELLES.filter(o => {
    if (mode === 'Animal' && o.isPlantOnly) return false;
    if (mode === 'Plant' && o.isAnimalOnly) return false;
    return true;
  });

  const selectedOrganelle = ORGANELLES.find(o => o.id === selectedId);

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg ${mode === 'Plant' ? 'bg-emerald-600' : 'bg-sky-500'}`}>
            <i className={`fa-solid ${mode === 'Plant' ? 'fa-leaf' : 'fa-paw'}`}></i>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{mode} Cell Anatomy</h2>
            <p className="text-slate-500 font-medium">Explore the microscopic architecture of life.</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => { setMode('Animal'); setShowDifferences(false); setSelectedId(null); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${mode === 'Animal' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fa-solid fa-dog"></i> Animal Mode
          </button>
          <button 
            onClick={() => { setMode('Plant'); setShowDifferences(false); setSelectedId(null); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${mode === 'Plant' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fa-solid fa-seedling"></i> Plant Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Cell Viewport */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl border border-slate-200 relative aspect-square flex items-center justify-center overflow-hidden h-full">
            {/* Cytoplasm Texture / Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-transparent to-transparent"></div>
            </div>

            {/* Cell Boundary */}
            <div className={`transition-all duration-1000 w-full h-full border-[8px] flex items-center justify-center relative ${
              mode === 'Plant' 
                ? 'rounded-[4rem] bg-emerald-50/50 border-emerald-600/30 shadow-[inset_0_0_80px_rgba(16,185,129,0.1)]' 
                : 'rounded-full bg-sky-50/50 border-sky-400/30 shadow-[inset_0_0_80px_rgba(56,189,248,0.1)]'
            }`}>
              {/* Dynamic Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-[0.03] pointer-events-none">
                {Array.from({length: 64}).map((_, i) => <div key={i} className="border border-slate-900"></div>)}
              </div>

              {/* Organelles Layer */}
              {activeOrganelles.map((o) => {
                const isActive = (selectedId === o.id || hoveredId === o.id);
                const isDiff = showDifferences && (o.isPlantOnly || o.isAnimalOnly);
                const isDimmed = showDifferences && !isDiff;

                return (
                  <button
                    key={o.id}
                    onMouseEnter={() => setHoveredId(o.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedId(selectedId === o.id ? null : o.id)}
                    className={`absolute transition-all duration-300 group ${
                      isDimmed ? 'opacity-20 scale-75' : 'opacity-100'
                    } ${isActive ? 'z-50' : 'z-20'}`}
                    style={{
                      top: o.location.top,
                      left: o.location.left,
                      transform: isActive ? 'scale(1.2) translate(-50%, -50%)' : 'translate(-50%, -50%)'
                    }}
                  >
                    <div className={`relative w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-2xl transition-all shadow-xl group-hover:shadow-2xl ${o.color} ${isActive ? 'ring-4 ring-white ring-offset-4' : ''} ${isDiff ? 'animate-bounce' : ''}`}>
                      <i className={`fa-solid ${o.icon} text-white text-xl md:text-2xl`}></i>
                    </div>
                    
                    {(isActive || showDifferences) && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none border border-slate-700">
                        {o.name.toUpperCase()}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Viewport UI Controls */}
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 flex justify-between items-center pointer-events-none">
              <div className="bg-white px-3 md:px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 pointer-events-auto">
                <button 
                  onClick={() => setShowDifferences(!showDifferences)}
                  className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-2 ${showDifferences ? 'bg-yellow-400 text-yellow-950' : 'bg-slate-900 text-white'}`}
                >
                  <i className={`fa-solid ${showDifferences ? 'fa-bolt' : 'fa-wand-magic-sparkles'}`}></i>
                  {showDifferences ? 'ACTIVE ANALYSIS' : 'SHOW SPECIALIZED PARTS'}
                </button>
              </div>
              <div className="flex gap-2 pointer-events-auto">
                <div className="bg-slate-900/10 px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-600 flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass-plus"></i> 12,000X
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info & Side Panel - STABLE CONTAINER */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 h-full flex flex-col overflow-hidden">
            {selectedOrganelle ? (
              /* DETAIL VIEW */
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 overflow-hidden">
                <div className={`p-10 flex flex-col justify-center h-full relative overflow-hidden text-white ${selectedOrganelle.color}`}>
                  <button 
                    onClick={() => setSelectedId(null)}
                    className="absolute top-8 left-8 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all border border-white/20 z-20"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  
                  <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between mb-6 mt-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-xl ring-1 ring-white/30">
                        <i className={`fa-solid ${selectedOrganelle.icon}`}></i>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {selectedOrganelle.isPlantOnly && (
                          <span className="bg-emerald-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                            Plant Only
                          </span>
                        )}
                        {selectedOrganelle.isAnimalOnly && (
                          <span className="bg-rose-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                            Animal Only
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="text-4xl font-black mb-4 tracking-tight drop-shadow-md">{selectedOrganelle.name}</h4>
                    <p className="text-lg font-medium text-white/90 leading-relaxed mb-8">
                      {selectedOrganelle.description}
                    </p>
                    
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-inner">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Did You Know?</p>
                      <p className="text-sm font-bold leading-relaxed">{selectedOrganelle.fact}</p>
                    </div>
                  </div>
                  <i className={`fa-solid ${selectedOrganelle.icon} absolute -bottom-20 -right-20 text-[300px] opacity-[0.07] -rotate-12`}></i>
                </div>
              </div>
            ) : (
              /* LIST/GRID VIEW */
              <div className="p-8 md:p-10 flex flex-col h-full animate-in fade-in slide-in-from-left-8 duration-500 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-list-check text-indigo-500"></i>
                    Neural Explorer
                  </h3>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight">Cell Components</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {activeOrganelles.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedId(o.id)}
                      onMouseEnter={() => setHoveredId(o.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col gap-4 text-left group ${
                        hoveredId === o.id 
                        ? 'border-indigo-400 bg-indigo-50 shadow-lg scale-[1.02]' 
                        : 'border-slate-50 bg-slate-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg shrink-0 shadow-md group-hover:scale-110 transition-transform ${o.color}`}>
                        <i className={`fa-solid ${o.icon}`}></i>
                      </div>
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${hoveredId === o.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                          Organelle
                        </span>
                        <span className={`text-sm font-black truncate leading-none ${hoveredId === o.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {o.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Empty State / Hint */}
                {!selectedId && (
                  <div className="mt-auto pt-8 border-t border-slate-100">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-center gap-5 shadow-xl">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-xl animate-pulse">
                        <i className="fa-solid fa-hand-pointer"></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Action Required</p>
                        <p className="text-xs font-bold opacity-80">Select a component for detailed biological analysis.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Comparison Section */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden mt-8">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-black mb-6 tracking-tight">Understanding the Differences</h3>
            <p className="text-slate-400 leading-relaxed font-medium mb-8">
              While animal and plant cells share many components like the nucleus and mitochondria, they have evolved specialized structures to survive in different ways.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="bg-emerald-500/20 border border-emerald-500/20 p-4 rounded-2xl flex-1">
                  <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">Plants</p>
                  <p className="text-sm font-bold">Use Chloroplasts to make energy from light.</p>
               </div>
               <div className="bg-sky-500/20 border border-sky-500/20 p-4 rounded-2xl flex-1">
                  <p className="text-sky-400 font-black text-xs uppercase tracking-widest mb-1">Animals</p>
                  <p className="text-sm font-bold">Get energy from eating food (Mitochondria only).</p>
               </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-arrows-to-circle"></i>
              </div>
              <div>
                <h4 className="font-black text-lg">Structural Rigidity</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Plants have cell walls for physical support because they lack skeletons. Animal cells are flexible.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-battery-three-quarters"></i>
              </div>
              <div>
                <h4 className="font-black text-lg">Energy Storage</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Plant cells typically have one large central vacuole, while animal cells have multiple smaller ones.</p>
              </div>
            </div>
          </div>
        </div>
        <i className="fa-solid fa-dna absolute top-[-50px] right-[-50px] text-[300px] opacity-5 rotate-12 pointer-events-none"></i>
      </div>
    </div>
  );
};

export default CellSimulation;
