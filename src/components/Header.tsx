import React from 'react';
import { motion } from 'motion/react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <motion.div 
          className="w-12 h-12 rounded-full border-2 border-orange-accent pulse-orange overflow-hidden bg-black flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-6 rounded-full bg-orange-accent/20 border border-orange-accent/40" />
        </motion.div>
        <div>
          <h1 className="font-display text-2xl tracking-wider gradient-text">
            THE JERSEY GUYS
          </h1>
          <p className="font-heading text-[10px] tracking-[0.2em] text-white/50 uppercase">
            AI Content Engine v2.0
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-accent/10 border border-orange-accent/20">
          <motion.div 
            className="w-2 h-2 rounded-full bg-orange-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-heading text-xs font-bold text-orange-accent tracking-widest">AI LIVE</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
