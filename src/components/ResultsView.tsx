import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ArrowRight, ExternalLink, PartyPopper } from 'lucide-react';

interface ContentData {
  detectedJersey: string;
  imagePrompt: string;
  caption: string;
  storyCaption: string;
  postFormat: string;
  productListing: string;
  tagSuggestions: string;
  hashtags: string[];
  contentIdeas: string[];
}

interface ResultsViewProps {
  data: ContentData;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ data, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const cards = [
    { label: "🎨 AI Image Prompt", content: data.imagePrompt, color: "text-blue-accent", type: 'prompt' },
    { label: "🔥 Instagram Caption", content: data.caption, color: "text-orange-accent" },
    { label: "📱 Story / Reel Caption", content: data.storyCaption, color: "text-purple-accent" },
    { label: "📸 Post Format Suggestion", content: data.postFormat, color: "text-blue-accent" },
    { label: "📝 Product Listing", content: data.productListing, color: "text-orange-accent" },
    { label: "🏷️ Accounts to Tag", content: data.tagSuggestions, color: "text-purple-accent" },
    { label: "#️⃣ Hashtags", content: data.hashtags, color: "text-blue-accent", type: 'hashtags' },
    { label: "💡 Content Ideas", content: data.contentIdeas, color: "text-orange-accent", type: 'list' },
  ];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyAll = () => {
    const allText = cards.map(c => `${c.label}:\n${Array.isArray(c.content) ? c.content.join(', ') : c.content}`).join('\n\n');
    copyToClipboard(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="px-6 max-w-4xl mx-auto pb-20">
      {/* Detected Jersey Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass rounded-2xl p-6 mb-12 border-orange-accent/30 flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-accent/5 to-purple-accent/5" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="text-4xl">🏟️</div>
          <div>
            <p className="font-heading text-xs font-bold tracking-[0.3em] text-orange-accent uppercase mb-1">Detected Jersey</p>
            <h3 className="text-3xl font-bold tracking-tight">{data.detectedJersey}</h3>
          </div>
        </div>
        
        <button 
          onClick={onReset}
          className="relative z-10 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-accent/50 transition-all font-heading text-xs font-bold tracking-widest uppercase"
        >
          ← Change Image
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <div className="relative h-[500px] flex flex-col items-center">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-8">
              {cards.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-8 bg-orange-accent' : i < currentIndex ? 'w-4 bg-purple-accent' : 'w-4 bg-white/10'
                  }`}
                />
              ))}
              <span className="ml-4 font-heading text-xs text-white/40 tracking-widest">
                {currentIndex + 1} / {cards.length}
              </span>
            </div>

            {/* Card Stack */}
            <div className="relative w-full max-w-md h-full perspective-1000">
              {cards.slice(currentIndex, currentIndex + 4).map((card, idx) => {
                const absoluteIndex = currentIndex + idx;
                const isFront = idx === 0;
                
                return (
                  <motion.div
                    key={absoluteIndex}
                    initial={isFront ? { scale: 0.8, opacity: 0, y: 50 } : false}
                    animate={{ 
                      scale: 1 - idx * 0.05,
                      y: idx * 15,
                      z: -idx * 50,
                      opacity: 1 - idx * 0.2,
                    }}
                    exit={{ 
                      x: 500, 
                      rotate: 45, 
                      scale: 0.5, 
                      opacity: 0,
                      transition: { duration: 0.5, ease: "backIn" }
                    }}
                    onClick={isFront ? handleNext : undefined}
                    className={`absolute inset-0 rounded-3xl p-8 flex flex-col cursor-pointer shadow-2xl border transition-colors
                      ${isFront ? 'bg-[#16143a] border-purple-accent/40 z-40' : 
                        idx === 1 ? 'bg-[#0e0d22] border-white/5 z-30' :
                        idx === 2 ? 'bg-[#0b0a1c] border-white/5 z-20' : 'bg-[#090817] border-white/5 z-10'}
                    `}
                  >
                    <div className={`font-heading text-xs font-bold tracking-[0.2em] uppercase mb-6 ${card.color}`}>
                      {card.label}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      {card.type === 'hashtags' ? (
                        <div className="flex flex-wrap gap-2">
                          {(card.content as string[]).map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-purple-accent/20 border border-purple-accent/30 text-xs text-purple-light">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : card.type === 'list' ? (
                        <ul className="space-y-4">
                          {(card.content as string[]).map((item, i) => (
                            <li key={i} className="flex gap-4">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-accent/20 border border-orange-accent/40 flex items-center justify-center text-[10px] text-orange-accent font-bold">
                                {i + 1}
                              </span>
                              <span className="text-sm text-white/80 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-lg leading-relaxed text-white/90 font-medium">
                          {card.content}
                        </p>
                      )}
                    </div>

                    {isFront && (
                      <div className="mt-8 flex flex-col items-center gap-3">
                        {card.type === 'prompt' && (
                          <div className="grid grid-cols-1 w-full gap-2">
                            <a 
                              href="https://ideogram.ai" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full py-2.5 rounded-xl bg-blue-accent/20 border border-blue-accent/40 text-blue-accent font-heading font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-blue-accent hover:text-white transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              IDEOGRAM
                            </a>
                            <div className="grid grid-cols-2 gap-2">
                              <a 
                                href="https://chatgpt.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-heading font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                <ExternalLink className="w-3 h-3" />
                                CHATGPT
                              </a>
                              <a 
                                href="https://gemini.google.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-heading font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all"
                              >
                                <ExternalLink className="w-3 h-3" />
                                GEMINI
                              </a>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-white/30 text-[10px] font-heading tracking-[0.2em] uppercase">
                          <span>👆 Tap to reveal next card</span>
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-center mb-12">
              <div className="w-24 h-24 rounded-full bg-purple-accent/20 flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="w-12 h-12 text-purple-accent" />
              </div>
              <h2 className="font-display text-5xl mb-2 text-purple-light">ALL CARDS REVIEWED!</h2>
              <p className="text-white/40 tracking-widest font-heading uppercase">Your content is ready for the drop.</p>
            </div>

            <button 
              onClick={handleCopyAll}
              className="w-full max-w-md py-5 rounded-2xl bg-gradient-to-r from-orange-accent to-purple-accent font-display text-2xl tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all mb-6 active:scale-95"
            >
              {copiedAll ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              {copiedAll ? 'COPIED TO CLIPBOARD' : '📋 COPY ALL CONTENT'}
            </button>

            <button 
              onClick={onReset}
              className="w-full max-w-md py-4 rounded-2xl bg-white/5 border border-white/10 font-heading text-sm font-bold tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 hover:border-orange-accent/50 transition-all mb-16 active:scale-95"
            >
              ← START NEW ANALYSIS
            </button>

            <div className="w-full space-y-8">
              {cards.map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-8 relative group"
                >
                  <button 
                    onClick={() => copyToClipboard(Array.isArray(card.content) ? card.content.join(', ') : card.content)}
                    className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4 text-white/40" />
                  </button>
                  
                  <div className={`font-heading text-xs font-bold tracking-[0.2em] uppercase mb-4 ${card.color}`}>
                    {card.label}
                  </div>

                  <div className="pr-12">
                    {card.type === 'hashtags' ? (
                      <div className="flex flex-wrap gap-2">
                        {(card.content as string[]).map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-purple-accent/20 border border-purple-accent/30 text-xs text-purple-light">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : card.type === 'list' ? (
                      <ul className="space-y-4">
                        {(card.content as string[]).map((item, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-accent/20 border border-orange-accent/40 flex items-center justify-center text-[10px] text-orange-accent font-bold">
                              {i + 1}
                            </span>
                            <span className="text-sm text-white/80 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/80 leading-relaxed">
                        {card.content}
                      </p>
                    )}
                  </div>

                  {card.type === 'prompt' && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a 
                        href="https://ideogram.ai" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-accent/20 border border-blue-accent/40 text-blue-accent font-heading font-bold text-xs hover:bg-blue-accent hover:text-white transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        IDEOGRAM
                      </a>
                      <a 
                        href="https://chatgpt.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-heading font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        CHATGPT
                      </a>
                      <a 
                        href="https://gemini.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-heading font-bold text-xs hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GEMINI
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsView;
