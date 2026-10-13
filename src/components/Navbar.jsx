import React from 'react';
import { Sprout, MessageSquare, TrendingUp, Landmark } from 'lucide-react';
import { LANGUAGES, UI_TEXT } from '../data/agriData';

export default function Navbar({ currentLang, setLang }) {
  const t = UI_TEXT[currentLang] || UI_TEXT.en;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg w-full">
      {/* Top Agricultural Status Ribbon spanning full screen width */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-amber-950 text-white py-1 px-4 sm:px-6 lg:px-10 text-xs w-full">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-200 font-semibold text-[11px] sm:text-xs">
              🌾 October Sowing Season Active • Live Mandi Rates Online
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src="/samunnati-logo.png" 
              alt="Samunnati" 
              className="h-4 w-4 rounded-full object-cover shadow-2xs" 
            />
            <span className="text-amber-200 font-bold tracking-wide text-[11px]">
              Samunnati Finance Initiative
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar with Logos & Feature Buttons (Full Width) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-emerald-100 py-3 px-4 sm:px-6 lg:px-10 xl:px-14 w-full">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => scrollTo('chat')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-green-700 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="/samunnati-logo.png"
                    alt="Samunnati Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight flex items-center gap-1.5">
                  <span>{t.brandName}</span>
                </h1>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs uppercase tracking-wider">
                  AI Farm Copilot
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Feature Navigation Buttons (Buttons, not plain links) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none max-w-full">
            <button
              onClick={() => scrollTo('chat')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-700 to-green-700 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-emerald-200" />
              <span>{t.navVoice}</span>
            </button>

            <button
              onClick={() => scrollTo('crops')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 shadow-2xs hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{t.navCrops}</span>
            </button>

            <button
              onClick={() => scrollTo('mandi')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 shadow-2xs hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>{t.navMandi}</span>
            </button>

            <button
              onClick={() => scrollTo('schemes')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 shadow-2xs hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Landmark className="w-4 h-4 text-teal-600" />
              <span>{t.navSchemes}</span>
            </button>
          </div>

          {/* Multilingual Switcher Pills */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-slate-100 to-emerald-50/80 p-1.5 rounded-2xl border border-emerald-200/80 shadow-2xs shrink-0">
            {Object.values(LANGUAGES).map((lang) => {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLang(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-white/80'
                  }`}
                >
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
}
