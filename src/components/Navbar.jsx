import React from 'react';
import { Sprout, Sparkles, Volume2, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/aiService';

export default function Navbar({ currentLang, setLang, onOpenConfig }) {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 shadow-lg w-full">
      {/* Top Agricultural Status Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-amber-950 text-white py-1 px-4 sm:px-6 lg:px-10 text-xs w-full">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-200 font-semibold text-[11px] sm:text-xs">
              🌾 National AI Agri Copilot • 9 Indian Languages • Bhashini & ICAR Grounded
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src="/samunnati-logo.png" 
              alt="Samunnati" 
              className="h-4 w-4 rounded-full object-cover shadow-2xs" 
            />
            <span className="text-amber-200 font-bold tracking-wide text-[11px]">
              Samunnati Initiative
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-emerald-100 py-3 px-4 sm:px-6 lg:px-10 xl:px-14 w-full">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-green-700 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                <img
                  src="/samunnati-logo.png"
                  alt="Samunnati Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                  AgriGPT
                </h1>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs uppercase tracking-wider">
                  AI Farm Copilot
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Multilingual Conversational AI for Indian Agriculture
              </p>
            </div>
          </div>

          {/* Center Badges */}
          <div className="hidden md:flex items-center gap-2.5 text-xs font-bold text-emerald-950 bg-emerald-50/80 border border-emerald-200 px-3.5 py-1.5 rounded-2xl">
            <span className="flex items-center gap-1 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Real-Time Agronomic LLM</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Voice-to-Voice in 9 Languages</span>
            </span>
          </div>

          {/* Right Language Pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gradient-to-r from-slate-100 to-emerald-50 p-1 rounded-2xl border border-emerald-300 shadow-2xs">
              <Globe className="w-4 h-4 text-emerald-700 ml-1.5 mr-0.5" />
              <select
                value={currentLang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-emerald-950 font-black text-xs sm:text-sm py-1 pr-2 outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
