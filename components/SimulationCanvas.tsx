
import React, { useRef, useEffect, useState } from 'react';
import { SimulationState, TrajectoryPoint } from '../types';

interface Props {
  sim: SimulationState;
  onFinish: (hit: boolean) => void;
  onUpdate: (point: TrajectoryPoint) => void;
}

const SimulationCanvas: React.FC<Props> = ({ sim, onFinish, onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Constants for base simulation metrics
  const BASE_WIDTH = 720;
  const BASE_HEIGHT = 400;
  const GROUND_Y_RATIO = 0.8; // 320/400
  const START_X_RATIO = 0.07; // 50/720
  const BASE_SCALE = 8;

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const { width } = container.getBoundingClientRect();
      const scale = width / BASE_WIDTH;
      
      canvas.width = width;
      canvas.height = BASE_HEIGHT * scale;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Derived values for the current responsive state
    const currentScale = (canvas.width / BASE_WIDTH) * BASE_SCALE;
    const GROUND_Y = canvas.height * GROUND_Y_RATIO;
    const START_X = canvas.width * START_X_RATIO;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid (Subtle)
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const gridSize = 40 * (canvas.width / BASE_WIDTH);
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw Ground with Gradient
      const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height);
      groundGrad.addColorStop(0, '#94a3b8');
      groundGrad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

      // Draw Target
      const targetPX = START_X + sim.targetX * currentScale;
      ctx.fillStyle = sim.targetHit ? '#10b981' : '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(targetPX - (15 * currentScale/BASE_SCALE), GROUND_Y - 5, 30 * currentScale/BASE_SCALE, 10, 4);
      ctx.fill();
      
      // Target Label
      ctx.font = `black ${Math.max(10, 12 * (canvas.width/BASE_WIDTH))}px Inter`;
      ctx.fillStyle = sim.targetHit ? '#059669' : '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(`TARGET: ${sim.targetX}m`, targetPX, GROUND_Y + (25 * (canvas.width/BASE_WIDTH)));

      // Draw Cannon Base
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(START_X, GROUND_Y, 12 * (canvas.width/BASE_WIDTH), 0, Math.PI, true);
      ctx.fill();

      // Trace (History)
      if (sim.history.length > 1) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(START_X + sim.history[0].x * currentScale, GROUND_Y - sim.history[0].y * currentScale);
        for (let i = 1; i < sim.history.length; i++) {
          ctx.lineTo(START_X + sim.history[i].x * currentScale, GROUND_Y - sim.history[i].y * currentScale);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (sim.isFiring) {
        const currentTime = performance.now() / 1000;
        if (startTimeRef.current === 0) startTimeRef.current = currentTime;
        
        const t = (currentTime - startTimeRef.current) * 2;
        const rad = (sim.angle * Math.PI) / 180;
        const v0x = sim.velocity * Math.cos(rad);
        const v0y = sim.velocity * Math.sin(rad);

        const x = v0x * t;
        const y = v0y * t - 0.5 * sim.gravity * t * t;

        const px = START_X + x * currentScale;
        const py = GROUND_Y - y * currentScale;

        if (Math.floor(t * 100) % 2 === 0) onUpdate({ x, y, t });

        if (y <= 0 && t > 0.1) {
          cancelAnimationFrame(animationRef.current!);
          const isHit = Math.abs(x - sim.targetX) < 2;
          onFinish(isHit);
          startTimeRef.current = 0;
          return;
        }

        // Projectile (No Glow/ShadowBlur)
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.arc(px, py, 6 * (canvas.width/BASE_WIDTH), 0, Math.PI * 2);
        ctx.fill();

        // Vector Visuals
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + (30 * (canvas.width/BASE_WIDTH)), py);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [sim, onFinish, onUpdate]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto block bg-white"
      />
    </div>
  );
};

export default SimulationCanvas;
