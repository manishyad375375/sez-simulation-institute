
import React from 'react';
import { SimulationState } from '../types';

interface Props {
  sim: SimulationState;
  setSim: React.Dispatch<React.SetStateAction<SimulationState>>;
  onFire: () => void;
  onReset: () => void;
}

const Controls: React.FC<Props> = ({ sim, setSim, onFire, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700">Launch Angle</label>
            <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-indigo-600">{sim.angle}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="90" 
            step="1"
            value={sim.angle}
            onChange={(e) => setSim(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
            disabled={sim.isFiring}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
            <span>Horizon (0°)</span>
            <span>Vertical (90°)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700">Initial Velocity</label>
            <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-indigo-600">{sim.velocity} m/s</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="50" 
            step="1"
            value={sim.velocity}
            onChange={(e) => setSim(prev => ({ ...prev, velocity: parseInt(e.target.value) }))}
            disabled={sim.isFiring}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
            <span>Slow (5)</span>
            <span>Fast (50)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          onClick={onFire}
          disabled={sim.isFiring}
          className={`col-span-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            sim.isFiring 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          <i className="fa-solid fa-play"></i>
          FIRE
        </button>
        <button
          onClick={onReset}
          className="col-span-1 py-3 px-4 rounded-xl font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rotate-right"></i>
          RESET
        </button>
      </div>

      {sim.isComplete && (
        <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 ${
          sim.targetHit 
          ? 'bg-green-50 border-green-200 text-green-700' 
          : 'bg-orange-50 border-orange-200 text-orange-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              sim.targetHit ? 'bg-green-500' : 'bg-orange-500'
            } text-white`}>
              <i className={`fa-solid ${sim.targetHit ? 'fa-check' : 'fa-xmark'}`}></i>
            </div>
            <div>
              <p className="font-bold text-sm">{sim.targetHit ? 'TARGET HIT!' : 'MISSED TARGET'}</p>
              <p className="text-xs opacity-90">{sim.targetHit ? 'Perfect trajectory calculation!' : 'Adjust angle or velocity to retry.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;
