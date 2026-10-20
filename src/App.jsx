import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';

export default function App() {
  const [currentLang, setCurrentLang] = useState('ta'); // Default to Tamil as requested, easily switched anytime!

  return (
    <div className="w-full min-h-screen flex flex-col selection:bg-emerald-300 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        setLang={setCurrentLang}
      />

      {/* Primary Deliverable: AgriGPT Multilingual AI Chatbot */}
      <main className="w-full flex-1 flex flex-col justify-center">
        <ChatAssistant
          currentLang={currentLang}
          setGlobalLang={setCurrentLang}
        />
      </main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-emerald-950 via-slate-950 to-green-950 text-slate-300 py-6 px-4 sm:px-6 lg:px-10 xl:px-14 border-t-2 border-emerald-500/40 mt-auto">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
              <img
                src="/samunnati-logo.png"
                alt="Samunnati"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-black text-white text-sm tracking-tight flex items-center gap-1.5">
                <span>AgriGPT</span>
                <span className="text-emerald-400 font-semibold">• AI for Indian Agriculture</span>
              </p>
              <p className="text-emerald-300/80 text-[11px] font-medium">
                Samunnati Finance Initiative • Empowering Farmers in Regional Languages
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-300 font-bold text-[11px]">
            <span className="bg-emerald-900/90 px-3 py-1 rounded-xl border border-emerald-600/70 text-emerald-200">
              🎙️ தமிழ் • हिन्दी • తెలుగు • ಕನ್ನಡ • മലയാളം • ਪੰਜਾਬੀ • मराठी • বাংলা • English
            </span>
            <span>•</span>
            <span className="text-emerald-300">Bhashini & ICAR Krishi Grounded</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
