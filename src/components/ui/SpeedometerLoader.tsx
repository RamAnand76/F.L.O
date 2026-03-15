import React from 'react';
import { motion } from 'motion/react';

export function SpeedometerLoader({ onComplete }: { onComplete?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative w-64 h-64">
        {/* Speedometer Base */}
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="12"
            strokeDasharray="377"
            strokeDashoffset="125"
            strokeLinecap="round"
          />
          {/* Progress Track */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#speed-gradient)"
            strokeWidth="12"
            strokeDasharray="377"
            strokeDashoffset="377"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 377 }}
            animate={{ strokeDashoffset: 125 }}
            transition={{
              duration: 2.5,
              ease: [0.4, 0, 1, 1], // Custom acceleration curve
            }}
          />
          <defs>
            <linearGradient id="speed-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-t from-transparent via-white to-white origin-bottom -translate-x-1/2 -translate-y-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          initial={{ rotate: -120 }}
          animate={{ rotate: 120 }}
          transition={{
            duration: 2.5,
            ease: [0.4, 0, 1, 1], // Custom acceleration curve
          }}
        />

        {/* Center Point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-900 border-4 border-white rounded-full z-10 shadow-xl" />

        {/* Digital Speed */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <motion.span 
            className="text-4xl font-black italic tracking-tighter text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Counter from={0} to={100} duration={2.5} onComplete={onComplete} />
          </motion.span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">km/h</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-bold tracking-tight text-white italic">Unleashing Your Dreams...</h3>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Counter({ from, to, duration, onComplete }: { from: number; to: number; duration: number; onComplete?: () => void }) {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Acceleration curve: start slow, end fast
      // Using a power function for acceleration feel
      const easedProgress = Math.pow(progress, 2);
      
      const currentCount = Math.floor(from + (to - from) * easedProgress);
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        if (onComplete) {
          setTimeout(onComplete, 200); // Small delay at 100 before transition
        }
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, onComplete]);

  return <>{count}</>;
}
