import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LoadingOverlay: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Detecting jersey & team...",
    "Generating image prompt...",
    "Writing caption & hashtags...",
    "Building content strategy..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
    >
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        {/* Concentric Rings */}
        <motion.div 
          className="absolute inset-0 border-4 border-orange-accent/30 border-t-orange-accent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-4 border-4 border-purple-accent/30 border-t-purple-accent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-8 border-4 border-blue-accent/30 border-t-blue-accent rounded-full"
          animate={{ rotate: 180 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Core */}
        <motion.div 
          className="w-8 h-8 rounded-full bg-white shadow-[0_0_30px_white]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      <h3 className="font-display text-6xl tracking-widest gradient-text animate-gradient mb-12">
        ANALYZING
      </h3>

      <div className="space-y-4 w-full max-w-xs">
        {steps.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: i <= step ? 1 : 0.2,
              x: 0
            }}
            className="flex items-center gap-4"
          >
            <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
              i < step ? 'bg-purple-accent' : i === step ? 'bg-orange-accent animate-pulse' : 'bg-white/20'
            }`} />
            <span className={`font-heading text-sm tracking-widest uppercase ${i === step ? 'text-white' : 'text-white/40'}`}>
              {s}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
