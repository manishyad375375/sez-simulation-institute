
import React from 'react';
import { SimulationState, QuadraticCoefficients } from '../types';

interface DashboardProps {
  sim: SimulationState;
  coefficients: QuadraticCoefficients;
}

export const QuadraticLink: React.FC<DashboardProps> = ({ coefficients }) => {
  const { a, b, c } = coefficients;
  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-200 h-full flex flex-col justify-center">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <i className="fa-solid fa-square-root-variable text-indigo-500"></i>
        Quadratic Link
      </h3>
      <div className="bg-slate-900 rounded-2xl p-8 text-center shadow-inner border-2 border-slate-800">
        <p className="text-indigo-400 font-serif italic text-[11px] mb-4 uppercase tracking-[0.2em] opacity-70">Standard Form: y = ax² + bx + c</p>
        <div className="text-white font-serif text-xl md:text-3xl overflow-x-auto whitespace-nowrap py-2 tracking-wide flex items-center justify-center gap-1">
          <span className="italic">y</span> <span>=</span> 
          <span className="text-pink-400 font-black">{a.toFixed(4)}</span><span className="italic">x</span><sup>2</sup> 
          <span>+</span> 
          <span className="text-blue-400 font-black">{b.toFixed(3)}</span><span className="italic">x</span> 
          <span>+</span> 
          <span className="text-yellow-400 font-black">{c}</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic mb-1">a (Concavity)</p>
          <p className="text-xs font-mono font-bold text-slate-700">{a.toFixed(4)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic mb-1">b (Initial Slope)</p>
          <p className="text-xs font-mono font-bold text-slate-700">{b.toFixed(3)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic mb-1">c (Y-Intercept)</p>
          <p className="text-xs font-mono font-bold text-slate-700">0.00</p>
        </div>
      </div>
    </div>
  );
};

export const MotionAnalysis: React.FC<{ sim: SimulationState }> = ({ sim }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-200 h-full flex flex-col justify-center">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <i className="fa-solid fa-chart-simple text-indigo-500"></i>
        Motion Analysis
      </h3>
      <div className="space-y-8">
        <div className="flex justify-between items-end gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Height (Vertex)</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-800 tabular-nums">{sim.maxHeight.toFixed(2)}</span>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">m</span>
            </div>
          </div>
          <div className="w-24 h-2.5 bg-indigo-50 rounded-full overflow-hidden border border-slate-100">
            <div 
              className="h-full bg-indigo-500 transition-all duration-700 rounded-full" 
              style={{ width: `${Math.min(100, (sim.maxHeight / 50) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-end gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Range (Roots)</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-800 tabular-nums">{sim.range.toFixed(2)}</span>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">m</span>
            </div>
          </div>
          <div className="w-24 h-2.5 bg-indigo-50 rounded-full overflow-hidden border border-slate-100">
            <div 
              className="h-full bg-indigo-500 transition-all duration-700 rounded-full" 
              style={{ width: `${Math.min(100, (sim.range / 150) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <QuadraticLink {...props} />
      <MotionAnalysis sim={props.sim} />
    </div>
  );
};

export default Dashboard;
