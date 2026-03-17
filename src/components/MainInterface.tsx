import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Zap } from 'lucide-react';

interface MainInterfaceProps {
  onGenerate: (image: string, mimeType: string, specs: string) => void;
  isLoading: boolean;
}

const MainInterface: React.FC<MainInterfaceProps> = ({ onGenerate, isLoading }) => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [specs, setSpecs] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 max-w-6xl mx-auto pb-20">
      {/* LEFT PANEL - Upload */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-3xl p-8 relative group hover:border-purple-accent/30 transition-colors"
      >
        <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-orange-accent to-purple-accent flex items-center justify-center font-display text-xl z-10">
          1
        </div>

        <div 
          className="h-full min-h-[400px] flex flex-col items-center justify-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-accent/50 hover:bg-white/5 transition-all group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-20 h-20 rounded-full bg-purple-accent/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                >
                  <Camera className="w-10 h-10 text-purple-accent" />
                </motion.div>
                <p className="font-heading text-xl font-bold tracking-wider mb-2">UPLOAD JERSEY PHOTO</p>
                <p className="text-white/40 text-sm">Drag and drop or click to browse</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col items-center"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.2)] border border-purple-accent/30">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="mt-6 text-orange-accent font-heading font-bold tracking-[0.2em] flex items-center gap-2">
                  <span>✓ READY TO ANALYZE</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Specs */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-3xl p-8 relative group hover:border-purple-accent/30 transition-colors flex flex-col"
      >
        <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-orange-accent to-purple-accent flex items-center justify-center font-display text-xl z-10">
          2
        </div>

        <div className="flex-1 flex flex-col">
          <label className="font-heading text-sm font-bold tracking-widest text-white/50 mb-4 uppercase">
            Additional Specifications (Optional)
          </label>
          <textarea 
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            placeholder="e.g. Price: ₹1499, Sizes: S-XXL, Player: Messi, Tone: Aggressive, Language: Hinglish"
            className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-accent focus:ring-1 focus:ring-purple-accent transition-all resize-none"
          />
          <p className="mt-4 text-white/30 text-xs italic">
            Hint: Mentioning the player name or specific kit details helps the AI.
          </p>
        </div>

        <button 
          disabled={!image || isLoading}
          onClick={() => image && onGenerate(image, mimeType, specs)}
          className={`mt-8 w-full py-6 rounded-2xl font-display text-3xl tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg
            ${!image || isLoading 
              ? 'bg-white/10 text-white/20 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-accent to-purple-accent hover:from-purple-accent hover:to-blue-accent hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(124,58,237,0.4)]'
            }`}
        >
          <Zap className={`${!image || isLoading ? 'text-white/20' : 'text-white'}`} fill="currentColor" />
          GENERATE CONTENT
        </button>
      </motion.div>
    </div>
  );
};

export default MainInterface;
