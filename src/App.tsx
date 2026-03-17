import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import BackgroundShader from './components/BackgroundShader';
import Header from './components/Header';
import Hero from './components/Hero';
import MainInterface from './components/MainInterface';
import LoadingOverlay from './components/LoadingOverlay';
import ResultsView from './components/ResultsView';
import { generateJerseyContent } from './services/geminiService';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleGenerate = async (image: string, mimeType: string, specs: string) => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const data = await generateJerseyContent(image, mimeType, specs);
      setResults(data);
    } catch (error: any) {
      console.error(error);
      alert(`Error generating content: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundShader />
      <Header />
      
      <main className="relative z-10">
        {!results && <Hero />}
        
        <AnimatePresence>
          {isLoading && <LoadingOverlay key="loading" />}
        </AnimatePresence>

        {!results ? (
          <MainInterface onGenerate={handleGenerate} isLoading={isLoading} />
        ) : (
          <ResultsView data={results} onReset={handleReset} />
        )}
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <p className="text-white/30 text-sm font-heading tracking-widest uppercase">
          Built for <span className="text-orange-accent">The Jersey Guys</span> · Agastya · Arhaan · Yuvaan · Shaurya · Shivaan
        </p>
      </footer>
    </div>
  );
}
