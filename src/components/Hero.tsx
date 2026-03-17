import React from 'react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-orange-accent font-bold tracking-widest mb-4"
      >
        ⚽ Powered by AI · Built for The Jersey Guys
      </motion.p>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display text-7xl md:text-8xl leading-[0.9] mb-6"
      >
        <span className="block text-white">DROP THE KIT.</span>
        <span className="block gradient-text animate-gradient">GET THE POST.</span>
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/60 text-lg max-w-2xl mb-10"
      >
        The ultimate content engine for India's premier jersey hub. Upload your latest drop and get professional Instagram content in seconds.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {[
          { label: "⚡ Instant Generation", color: "border-orange-accent/30" },
          { label: "🎨 AI Image Prompts", color: "border-blue-accent/30" },
          { label: "📱 Instagram Ready", color: "border-purple-accent/30" },
          { label: "🏆 30+ Jerseys/Day Free", color: "border-white/20" }
        ].map((pill, i) => (
          <span key={i} className={`px-4 py-2 rounded-full border ${pill.color} bg-white/5 text-xs font-heading font-bold tracking-wider`}>
            {pill.label}
          </span>
        ))}
      </motion.div>

      <div className="w-full h-[1px] bg-gradient-to-r from-orange-accent via-purple-accent to-blue-accent opacity-50" />
    </section>
  );
};

export default Hero;
