
import React, { useState, useCallback, useEffect } from 'react';
import { SimulationState, TrajectoryPoint, QuadraticCoefficients } from '../types';
import Controls from '../components/Controls';
import SimulationCanvas from '../components/SimulationCanvas';
import { QuadraticLink, MotionAnalysis } from '../components/Dashboard';

const GRAVITY = 9.81;
const DEFAULT_TARGET_X = 50;

interface Props {
  onComplete?: (score: number) => void;
}

const ProjectileSimulation: React.FC<Props> = ({ onComplete }) => {
  const [sim, setSim] = useState<SimulationState>({
    angle: 45,
    velocity: 25,
    gravity: GRAVITY,
    isFiring: false,
    isComplete: false,
    history: [],
    maxHeight: 0,
    range: 0,
    targetX: DEFAULT_TARGET_X,
    targetHit: false,
  });

  const getQuadratic = useCallback((): QuadraticCoefficients => {
    const rad = (sim.angle * Math.PI) / 180;
    const v0x = sim.velocity * Math.cos(rad);
    const a = -(sim.gravity / (2 * Math.pow(v0x, 2)));
    const b = Math.tan(rad);
    const c = 0;
    return { a, b, c };
  }, [sim.angle, sim.velocity, sim.gravity]);

  const calculateStats = useCallback(() => {
    const rad = (sim.angle * Math.PI) / 180;
    const v0y = sim.velocity * Math.sin(rad);
    const v0x = sim.velocity * Math.cos(rad);
    const timeOfFlight = (2 * v0y) / sim.gravity;
    const range = v0x * timeOfFlight;
    const maxHeight = (v0y * v0y) / (2 * sim.gravity);
    return { range, maxHeight, timeOfFlight };
  }, [sim.angle, sim.velocity, sim.gravity]);

  const handleFire = () => {
    if (sim.isFiring) return;
    const { range, maxHeight } = calculateStats();
    setSim(prev => ({
      ...prev,
      isFiring: true,
      isComplete: false,
      history: [],
      maxHeight,
      range,
      targetHit: false
    }));
  };

  const handleReset = () => {
    setSim(prev => ({
      ...prev,
      isFiring: false,
      isComplete: false,
      history: [],
      maxHeight: 0,
      range: 0,
      targetHit: false,
      targetX: Math.floor(Math.random() * 60) + 20
    }));
  };

  const onSimulationFinish = (hit: boolean) => {
    setSim(prev => ({ ...prev, isFiring: false, isComplete: true, targetHit: hit }));
    if (hit && onComplete) {
      onComplete(100); 
    }
  };

  const updateHistory = (point: TrajectoryPoint) => {
    setSim(prev => ({ ...prev, history: [...prev.history, point] }));
  };

  const coefficients = getQuadratic();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in slide-in-from-right-8 duration-700 w-full max-w-7xl mx-auto pb-12">
      <div className="col-span-1 lg:col-span-12 order-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl gap-6">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <i className="fa-solid fa-square-root-variable text-2xl"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Module 01 • Analysis</p>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Trajectory Dynamics</h2>
              </div>
           </div>
           <div className="hidden sm:flex bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 font-black text-[10px] uppercase tracking-widest border border-indigo-100">
              Interactive Physics
           </div>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-12 order-2">
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[2rem] border border-indigo-500 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xs font-black text-indigo-200 mb-2 flex items-center gap-2 uppercase tracking-[0.2em]">
                <i className="fa-solid fa-bullseye"></i>
                Mission Objective
              </h3>
              <p className="text-xl md:text-2xl font-black text-white leading-tight">
                Achieve a parabolic root at exactly <span className="text-yellow-400 underline underline-offset-8 decoration-white/20">{sim.targetX}m</span>
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div>
                <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Learning</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight">Kinematic Vertex Mapping</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-8 order-3">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative group h-full">
          <div className="absolute top-8 left-8 z-10 bg-white/90 px-5 py-2 rounded-2xl text-[10px] font-black border border-slate-200 flex items-center gap-3 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            LIVE KINEMATIC RENDER
          </div>
          <div className="p-4 md:p-8 bg-slate-50/30">
            <div className="rounded-[1.5rem] overflow-hidden border border-slate-200 shadow-inner bg-white">
              <SimulationCanvas sim={sim} onFinish={onSimulationFinish} onUpdate={updateHistory} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-4 order-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 lg:p-10 h-full">
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-1 flex items-center gap-3 text-slate-800 tracking-tight">Control Deck</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Input Configuration</p>
          </div>
          <Controls sim={sim} setSim={setSim} onFire={handleFire} onReset={handleReset} />
        </div>
      </div>

      <div className="col-span-1 lg:col-span-4 order-5 lg:col-start-9">
        <MotionAnalysis sim={sim} />
      </div>

      <div className="col-span-1 lg:col-span-8 order-6 lg:row-start-4">
        <QuadraticLink sim={sim} coefficients={coefficients} />
      </div>
    </div>
  );
};

export default ProjectileSimulation;
