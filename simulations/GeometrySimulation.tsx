
import React, { useState, useRef, useEffect, useMemo } from 'react';

const GeometrySimulation: React.FC = () => {
  const [points, setPoints] = useState([
    { id: 'A', x: 200, y: 150 },
    { id: 'B', x: 100, y: 300 },
    { id: 'C', x: 300, y: 300 },
  ]);
  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = (id: string) => setDragging(id);
  
  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging || !svgRef.current) return;
    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    if (!CTM) return;
    
    const x = (clientX - CTM.e) / CTM.a;
    const y = (clientY - CTM.f) / CTM.d;

    setPoints(prev => prev.map(p => p.id === dragging ? { 
      ...p, 
      x: Math.max(20, Math.min(x, 380)), 
      y: Math.max(20, Math.min(y, 380)) 
    } : p));
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseUp = () => setDragging(null);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const stats = useMemo(() => {
    const dist = (p1: any, p2: any) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    const sideA = dist(points[1], points[2]); // BC
    const sideB = dist(points[0], points[2]); // AC
    const sideC = dist(points[0], points[1]); // AB
    
    const angA = Math.acos(Math.max(-1, Math.min(1, (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)))) * (180 / Math.PI);
    const angB = Math.acos(Math.max(-1, Math.min(1, (sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)))) * (180 / Math.PI);
    const angC = 180 - angA - angB;

    const tol = 5; 
    const isEquilateral = Math.abs(sideA - sideB) < tol && Math.abs(sideB - sideC) < tol;
    const isIsosceles = !isEquilateral && (Math.abs(sideA - sideB) < tol || Math.abs(sideB - sideC) < tol || Math.abs(sideA - sideC) < tol);

    const isRight = Math.abs(angA - 90) < 2 || Math.abs(angB - 90) < 2 || Math.abs(angC - 90) < 2;
    const isObtuse = angA > 91 || angB > 91 || angC > 91;

    return { 
      sideA, sideB, sideC, 
      angA, angB, angC, 
      sideType: isEquilateral ? "Equilateral" : (isIsosceles ? "Isosceles" : "Scalene"),
      angleType: isRight ? "Right" : (isObtuse ? "Obtuse" : "Acute"),
      goals: {
        right: isRight,
        equilateral: isEquilateral,
        obtuse: isObtuse,
        isosceles: isIsosceles || isEquilateral
      }
    };
  }, [points]);

  const handleReset = () => {
    setPoints([
      { id: 'A', x: 200, y: 150 },
      { id: 'B', x: 100, y: 300 },
      { id: 'C', x: 300, y: 300 },
    ]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header Row - Full Width */}
      <div className="md:col-span-12">
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="bg-cyan-50/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black text-cyan-600 uppercase tracking-widest border border-cyan-100 flex items-center gap-2">
              <i className="fa-solid fa-compass-drafting"></i>
              Geometric Sandbox Simulator
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl hidden sm:block">
              Dynamic Euclidean Engine Active
            </div>
        </div>
      </div>

      {/* 2. Visual Sandbox Simulator */}
      <div className="md:col-span-12">
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-slate-200 relative overflow-hidden h-[450px] md:h-[600px]">
          <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-inner relative overflow-hidden h-full flex items-center justify-center">
            <svg 
              ref={svgRef} 
              viewBox="0 0 400 400" 
              onMouseMove={handleMouseMove} 
              onTouchMove={handleTouchMove}
              className="w-full h-full max-w-2xl cursor-crosshair touch-none"
            >
              <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <rect width="50" height="50" fill="url(#smallGrid)" />
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                </pattern>
                <filter id="handleShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
                </filter>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#grid)" />

              <polygon 
                points={points.map(p => `${p.x},${p.y}`).join(' ')} 
                fill="rgba(6, 182, 212, 0.12)" 
                stroke="#0891b2" 
                strokeWidth="4" 
                strokeLinejoin="round"
                className="transition-all duration-300"
              />

              {points.map(p => (
                <g key={p.id} onMouseDown={() => handleMouseDown(p.id)} onTouchStart={() => handleMouseDown(p.id)} className="cursor-move group/handle">
                  <circle cx={p.x} cy={p.y} r="22" fill="white" fillOpacity="0" />
                  <circle cx={p.x} cy={p.y} r="14" fill="white" stroke={dragging === p.id ? '#06b6d4' : '#0891b2'} strokeWidth="4" filter="url(#handleShadow)" className="transition-all duration-200" />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" className="text-[12px] font-black fill-cyan-900 pointer-events-none select-none">{p.id}</text>
                </g>
              ))}

              <g className="text-[10px] font-black fill-slate-500 pointer-events-none">
                <text x={points[0].x} y={points[0].y - 25} textAnchor="middle" className="fill-indigo-600">{Math.round(stats.angA)}°</text>
                <text x={points[1].x - 20} y={points[1].y + 20} textAnchor="middle">{Math.round(stats.angB)}°</text>
                <text x={points[2].x + 20} y={points[2].y + 20} textAnchor="middle">{Math.round(stats.angC)}°</text>
              </g>

              <g className="text-[8px] font-black fill-cyan-700 pointer-events-none">
                <text x={(points[0].x + points[1].x)/2 - 15} y={(points[0].y + points[1].y)/2} textAnchor="end">{Math.round(stats.sideC)}u</text>
                <text x={(points[0].x + points[2].x)/2 + 15} y={(points[0].y + points[2].y)/2} textAnchor="start">{Math.round(stats.sideB)}u</text>
                <text x={(points[1].x + points[2].x)/2} y={(points[1].y + points[2].y)/2 + 25} textAnchor="middle">{Math.round(stats.sideA)}u</text>
              </g>
            </svg>

            {/* Float UI Controls */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
               <button 
                 onClick={handleReset}
                 className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-200 text-slate-400 hover:text-cyan-600 hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                 title="Reset Shape"
               >
                 <i className="fa-solid fa-rotate-right text-lg"></i>
               </button>
            </div>

            <div className="absolute bottom-6 left-6 pointer-events-none">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-3">
                 <i className="fa-solid fa-hand-pointer text-cyan-500 animate-bounce"></i>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Drag vertices to explore</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Status Report - 8 Columns */}
      <div className="md:col-span-8 flex flex-col gap-8">
        {/* Geometric Analysis Panel */}
        <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
               <p className="text-[9px] md:text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Geometric Analytics</p>
               <h4 className="text-2xl md:text-4xl font-black tracking-tight leading-none">{stats.angleType} {stats.sideType}</h4>
               <p className="text-slate-500 text-[10px] mt-2 font-medium">Coordinate precision calibrated to Euclidean plane constants.</p>
            </div>
            
            <div className="flex gap-10 md:gap-14 border-t border-slate-800 pt-6 md:border-0 md:pt-0">
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">Internal Sum</span>
                  <span className="text-xl md:text-3xl font-black text-emerald-400 tracking-tighter">180.0°</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">Bounded Area</span>
                  <span className="text-xl md:text-3xl font-black text-white tracking-tighter">
                    {Math.round(0.5 * Math.abs(points[0].x*(points[1].y - points[2].y) + points[1].x*(points[2].y - points[0].y) + points[2].x*(points[0].y - points[1].y)))}<span className="text-xs text-slate-500 ml-1">u²</span>
                  </span>
               </div>
            </div>
          </div>
          <i className="fa-solid fa-calculator absolute -bottom-10 -right-10 text-[180px] opacity-[0.03] -rotate-12"></i>
        </div>

        {/* EXPANDED: Objectives & Research Section - Fills the space and aligns with Benchmarks */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-xl border border-slate-200 flex flex-col flex-1">
           <div className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <i className="fa-solid fa-microchip"></i>
                 </div>
                 <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Euclidean Research Suite</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Foundational Geometry Protocol</p>
                 </div>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
                Explore the relationship between side lengths and internal angles dictated by the <span className="text-indigo-600 font-bold underline">180° Euclidean Constant</span>. Mastery of these primitive structures is essential for advanced trigonometry and spatial engineering.
              </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4 group hover:bg-white hover:border-indigo-200 transition-all duration-300">
                 <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm shadow-sm group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-ruler-combined"></i>
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-wider mb-1">Angular Archetypes</h4>
                    <p className="text-xs text-slate-500 leading-snug">
                       Mastering the 90° right angle creates the foundation for Pythagorean calculations, while obtuse expansion tests the limits of vertex stability.
                    </p>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4 group hover:bg-white hover:border-cyan-200 transition-all duration-300">
                 <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 text-sm shadow-sm group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-bezier-curve"></i>
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-cyan-600 uppercase tracking-wider mb-1">Symmetry Control</h4>
                    <p className="text-xs text-slate-500 leading-snug">
                       Isosceles and Equilateral configurations redistribute structural tension evenly, making them the most stable shapes in architectural design.
                    </p>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4 group hover:bg-white hover:border-emerald-200 transition-all duration-300">
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm shadow-sm group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-bridge"></i>
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-1">Truss Logic</h4>
                    <p className="text-xs text-slate-500 leading-snug">
                       Triangles are the only polygon that cannot be deformed without changing the length of its sides, serving as the "atom" of engineering.
                    </p>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4 group hover:bg-white hover:border-amber-200 transition-all duration-300">
                 <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-sm shadow-sm group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-infinity"></i>
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-wider mb-1">Sine/Cosine Laws</h4>
                    <p className="text-xs text-slate-500 leading-snug">
                       The ratio of a side to the sine of its opposite angle is constant for all three vertices in any triangle on a Euclidean plane.
                    </p>
                 </div>
              </div>
           </div>

           <div className="mt-auto p-6 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-6 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 z-10">
                 <i className="fa-solid fa-graduation-cap text-indigo-400 text-xl"></i>
              </div>
              <div className="z-10">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Euclidean Constant Protocol</p>
                <p className="text-lg font-serif italic text-indigo-50 leading-tight">
                   "The internal angles of any non-degenerate triangle in a 2D Euclidean plane always sum to exactly 180°."
                </p>
              </div>
              <i className="fa-solid fa-shapes absolute -bottom-10 -right-10 text-[180px] opacity-[0.03] rotate-12"></i>
           </div>
        </div>
      </div>

      {/* 4. Benchmarks Section - 4 Columns */}
      <div className="md:col-span-4 h-full flex flex-col">
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-xl border border-slate-200 h-full flex flex-col">
           <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                <i className="fa-solid fa-award text-amber-500 text-base"></i> Simulator Benchmarks
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mission Milestones</p>
           </div>
           
           <div className="space-y-4 flex-1">
              <GoalItem label="Right Angle" desc="Corner @ 90° Precision" active={stats.goals.right} icon="fa-square" />
              <GoalItem label="Equilateral" desc="Universal Side Parity" active={stats.goals.equilateral} icon="fa-vector-square" />
              <GoalItem label="Obtuse" desc="Wide Vertex Expansion" active={stats.goals.obtuse} icon="fa-angle-up" />
              <GoalItem label="Isosceles" desc="Reflective Side Symmetry" active={stats.goals.isosceles} icon="fa-equals" />
           </div>
           
           <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-6 text-white flex flex-col gap-4 shadow-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                       <i className="fa-solid fa-lightbulb text-indigo-200 text-sm"></i>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">Intelligence Tip</span>
                 </div>
                 <p className="text-[10px] font-bold leading-relaxed text-indigo-100 uppercase tracking-tight">
                    Achieve 100% structural precision by manually dragging vertices until the telemetry confirms archetype parity.
                 </p>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${(Object.values(stats.goals).filter(Boolean).length / 4) * 100}%` }}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

const GoalItem = ({ label, desc, active, icon }: { label: string, desc: string, active: boolean, icon: string }) => (
  <div className={`p-5 rounded-[2rem] border-2 transition-all duration-500 flex items-center gap-4 ${
    active 
      ? 'bg-emerald-50 border-emerald-400 shadow-md scale-[1.03] z-10' 
      : 'bg-slate-50 border-slate-100 opacity-60'
  }`}>
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 shrink-0 ${
      active ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-white text-slate-300'
    }`}>
      <i className={`fa-solid ${active ? 'fa-check' : icon} ${active ? 'text-sm' : 'text-base'}`}></i>
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

export default GeometrySimulation;
