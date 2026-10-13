import React from 'react';
import { Calendar, Droplets, ArrowUpRight, Sparkles, Clock } from 'lucide-react';
import { CROPS_DATA, UI_TEXT } from '../data/agriData';

export default function CropPlanner({ currentLang, onSelectCrop }) {
  const t = UI_TEXT[currentLang] || UI_TEXT.en;

  const getProfitRating = (profitStr) => {
    if (profitStr.includes('85,000') || profitStr.includes('90,000')) return { percent: 95, stars: '★★★★★', label: 'Very High Profit' };
    if (profitStr.includes('50,000')) return { percent: 85, stars: '★★★★★', label: 'High & Stable Profit' };
    if (profitStr.includes('44,000')) return { percent: 78, stars: '★★★★☆', label: 'Guaranteed MSP Return' };
    return { percent: 65, stars: '★★★☆☆', label: 'Fast Short-Duration' };
  };

  return (
    <section id="crops" className="py-14 w-full px-4 sm:px-6 lg:px-10 xl:px-14 border-t border-emerald-500/20">
      <div className="w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-400 text-emerald-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optimal Sowing Window: October - November (Rabi / Samba)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {t.cropSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 font-medium drop-shadow-sm">
            {t.cropSectionDesc}
          </p>
        </div>

        {/* Crops 4-Column Grid Spanning 100% Full Screen Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
          {CROPS_DATA.map((crop) => {
            const cropName =
              currentLang === 'ta' ? crop.nameTa : currentLang === 'hi' ? crop.nameHi : crop.nameEn;
            const advice =
              currentLang === 'ta' ? crop.adviceTa : currentLang === 'hi' ? crop.adviceHi : crop.adviceEn;
            const profitInfo = getProfitRating(crop.profitPerAcre);

            return (
              <div
                key={crop.id}
                className="bg-white/95 backdrop-blur-md border-2 border-emerald-300/80 hover:border-emerald-500 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1 border border-emerald-200">
                        {crop.season}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                        {cropName}
                      </h3>
                    </div>

                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl shadow-xs inline-flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3 h-3" />
                      <span>Top Choice</span>
                    </span>
                  </div>

                  {/* VISUAL PROFIT METER FOR FARMERS */}
                  <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950 rounded-2xl p-4 text-white shadow-md my-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-emerald-200 font-bold uppercase tracking-wider">
                        {t.expectedProfit}
                      </span>
                      <span className="text-amber-300 font-black tracking-wide">
                        {profitInfo.stars}
                      </span>
                    </div>

                    <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                      {crop.profitPerAcre}
                    </div>

                    {/* Visual Profit Bar */}
                    <div className="mt-2">
                      <div className="w-full bg-emerald-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-emerald-700/60 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 via-emerald-300 to-emerald-400 rounded-full transition-all duration-700"
                          style={{ width: `${profitInfo.percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-200 font-bold block mt-1">
                        📈 Profit Index: {profitInfo.percent}/100
                      </span>
                    </div>
                  </div>

                  {/* Trait Visual Chips */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-2xl shadow-2xs">
                      <span className="text-slate-500 font-semibold block flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{t.cropDuration}</span>
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs mt-0.5 block">
                        {crop.duration}
                      </span>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-2xl shadow-2xs">
                      <span className="text-slate-500 font-semibold block flex items-center gap-1 text-[11px]">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span>{t.bestSoil}</span>
                      </span>
                      <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">
                        {crop.soil}
                      </span>
                    </div>
                  </div>

                  {/* Creative Care Advice */}
                  <div className="text-xs text-slate-700 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 leading-relaxed font-medium mt-3">
                    <p className="flex items-start gap-1.5">
                      <span className="text-base shrink-0">💡</span>
                      <span><strong>Advice:</strong> {advice}</span>
                    </p>
                  </div>
                </div>

                {/* Ask Assistant Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <a
                    href="#chat"
                    onClick={() => onSelectCrop(cropName)}
                    className="w-full text-center inline-flex items-center justify-center gap-2 text-xs font-black text-white bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-800 hover:to-emerald-950 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>Ask Sowing Guide</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
