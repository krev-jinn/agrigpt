import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import CropPlanner from './components/CropPlanner';
import MandiRates from './components/MandiRates';
import SchemesGuide from './components/SchemesGuide';
import { UI_TEXT } from './data/agriData';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const t = UI_TEXT[currentLang] || UI_TEXT.en;

  const handleQueryInChat = (promptText) => {
    window.dispatchEvent(new CustomEvent('agrigpt-quick-query', { detail: promptText }));
    const chatElement = document.getElementById('chat');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col selection:bg-emerald-300 selection:text-emerald-950">
      {/* Top Navbar with Samunnati Logo (Full Screen Width) */}
      <Navbar
        currentLang={currentLang}
        setLang={setCurrentLang}
      />

      {/* Full-Width Scrollable Main Sections */}
      <main className="w-full flex-1">
        {/* 1. Voice & Text AI Assistant */}
        <ChatAssistant
          currentLang={currentLang}
          setGlobalLang={setCurrentLang}
        />

        {/* 2. Best Crop to Cultivate at this Time */}
        <CropPlanner
          currentLang={currentLang}
          onSelectCrop={(cropName) => {
            handleQueryInChat(`What is the step-by-step cultivation guide and profit for ${cropName}?`);
          }}
        />

        {/* 3. Nearby Mandi Rates with Visual Gauges */}
        <MandiRates
          currentLang={currentLang}
          onQueryMandi={(query) => {
            handleQueryInChat(query);
          }}
        />

        {/* 4. Government Schemes & Financial Support */}
        <SchemesGuide
          currentLang={currentLang}
          onQueryScheme={(query) => {
            handleQueryInChat(query);
          }}
        />
      </main>

      {/* Full Screen Width Footer */}
      <footer className="w-full bg-gradient-to-r from-emerald-950 via-slate-950 to-green-950 text-slate-300 py-8 px-4 sm:px-6 lg:px-10 xl:px-14 border-t-2 border-emerald-500/40 mt-auto">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
              <img
                src="/samunnati-logo.png"
                alt="Samunnati"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-black text-white text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <span>AgriGPT</span>
                <span className="text-emerald-400 font-semibold">• AI for Farmers</span>
              </p>
              <p className="text-emerald-300/80 text-[11px] font-medium">
                Samunnati Finance Initiative • Empowering Indian Agriculture
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-300 font-bold text-[11px]">
            <span className="bg-emerald-900/90 px-3 py-1 rounded-xl border border-emerald-600/70 text-emerald-200">
              🎙️ தமிழ் • हिन्दी • English
            </span>
            <span>•</span>
            <span className="text-emerald-300">Guaranteed Voice & Audio in Tamil & Hindi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
