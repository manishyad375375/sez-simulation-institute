
import React from 'react';

const WorkflowDiagram: React.FC = () => {
  const steps = [
    { icon: 'fa-input-numeric', title: '1. Inputs', desc: 'Angle (θ) & Velocity (V₀) captured via state.' },
    { icon: 'fa-calculator', title: '2. Math Engine', desc: 'Calculate Kinematics: Vx, Vy, Time, Max Height, Range.' },
    { icon: 'fa-function', title: '3. Quadratic Mapping', desc: 'Convert physics to y = ax² + bx + c.' },
    { icon: 'fa-microchip', title: '4. Render Frame', desc: 'Canvas loops @ 60fps calculating x(t) and y(t).' },
    { icon: 'fa-bullseye', title: '5. Game Logic', desc: 'Evaluate Target Hit and display educational data.' },
  ];

  return (
    <div className="bg-indigo-900 rounded-2xl p-6 shadow-xl border border-indigo-700 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500 rounded-lg text-white">
          <i className="fa-solid fa-sitemap"></i>
        </div>
        <h3 className="text-white font-bold text-lg">System Workflow Diagram</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            <div className="bg-indigo-800/50 p-4 rounded-xl border border-indigo-700 h-full flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white mb-3 font-bold text-xs">
                {i + 1}
              </div>
              <h4 className="text-indigo-200 font-bold text-xs mb-2 uppercase tracking-tight">{step.title}</h4>
              <p className="text-indigo-300 text-[10px] leading-relaxed">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden sm:block absolute top-1/2 -right-2 translate-x-1/2 -translate-y-1/2 z-10 text-indigo-400">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center border-t border-indigo-700/50 pt-4">
        <div className="flex items-center gap-2 text-[10px] text-indigo-300 uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-green-400"></span> React 18+
        </div>
        <div className="flex items-center gap-2 text-[10px] text-indigo-300 uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span> TypeScript
        </div>
        <div className="flex items-center gap-2 text-[10px] text-indigo-300 uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-pink-400"></span> HTML5 Canvas
        </div>
        <div className="flex items-center gap-2 text-[10px] text-indigo-300 uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Tailwind CSS
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
