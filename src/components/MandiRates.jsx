import React from 'react';
import { MapPin, TrendingUp, TrendingDown, ArrowUpRight, Activity } from 'lucide-react';
import { MANDI_DATA, UI_TEXT } from '../data/agriData';

export default function MandiRates({ currentLang, onQueryMandi }) {
  const t = UI_TEXT[currentLang] || UI_TEXT.en;

  const getGaugePercentage = (modalStr, rangeStr) => {
    try {
      const modal = parseInt(modalStr.replace(/[^0-9]/g, ''));
      const parts = rangeStr.split('-').map(s => parseInt(s.replace(/[^0-9]/g, '')));
      if (parts.length === 2 && parts[1] > parts[0]) {
        const pct = Math.round(((modal - parts[0]) / (parts[1] - parts[0])) * 100);
        return Math.max(15, Math.min(95, pct));
      }
    } catch (e) {
      // fallback
    }
    return 70;
  };

  return (
    <section id="mandi" className="py-14 w-full px-4 sm:px-6 lg:px-10 xl:px-14 border-t border-emerald-500/20">
      <div className="w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md border border-amber-400 text-amber-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Real-Time APMC Price Discovery</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {t.mandiSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 font-medium drop-shadow-sm">
            {t.mandiSectionDesc}
          </p>
        </div>

        {/* Mandi Cards 4-Column Full-Width Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
          {MANDI_DATA.map((item) => {
            const cropName =
              currentLang === 'ta' ? item.cropTa : currentLang === 'hi' ? item.cropHi : item.cropEn;
            const tip =
              currentLang === 'ta' ? item.tipTa : currentLang === 'hi' ? item.tipHi : item.tipEn;
            const gaugePct = getGaugePercentage(item.modalRate, item.priceRange);
            const isUp = item.trendType === 'up';

            return (
              <div
                key={item.id}
                className="bg-white/95 backdrop-blur-md border-2 border-emerald-300/80 hover:border-emerald-500 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                        {cropName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-semibold mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{item.mandi}</span>
                      </p>
                    </div>

                    <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                      {item.distanceKm} {t.kmAway}
                    </span>
                  </div>

                  {/* VISUAL ARROW & PROFIT/LOSS BADGE */}
                  <div className="my-2.5">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs ${
                        isUp
                          ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white'
                          : 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
                      }`}
                    >
                      {isUp ? (
                        <>
                          <TrendingUp className="w-4 h-4 animate-bounce" />
                          <span>▲ {item.trend}</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 animate-bounce" />
                          <span>▼ {item.trend}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-amber-50/40 border-2 border-emerald-200/80 rounded-2xl p-4 my-2.5">
                    <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                      {t.mandiModalRate}
                    </span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-3xl font-black text-emerald-950 tracking-tight">
                        {item.modalRate}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        / 100 kg
                      </span>
                    </div>

                    {/* VISUAL PRICE GAUGE */}
                    <div className="mt-3 pt-3 border-t border-emerald-200/60">
                      <div className="flex justify-between text-[10px] font-extrabold text-slate-600 mb-1">
                        <span>Low ({item.priceRange.split('-')[0].trim()})</span>
                        <span className="text-emerald-800 font-bold">Peak ({item.priceRange.split('-')[1]?.trim()})</span>
                      </div>

                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 relative shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUp
                              ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600'
                              : 'bg-gradient-to-r from-amber-400 to-rose-500'
                          }`}
                          style={{ width: `${gaugePct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-1 block text-center">
                        🎯 Current Rate is {gaugePct}% of Highest Peak
                      </span>
                    </div>
                  </div>

                  {/* Practical Advice Note */}
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                    <p>💡 {tip}</p>
                  </div>
                </div>

                {/* Ask Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href="#chat"
                    onClick={() => onQueryMandi(`What is the price forecast and best time to sell ${item.cropEn} in ${item.mandi}?`)}
                    className="w-full bg-gradient-to-r from-emerald-800 to-green-900 hover:from-emerald-900 hover:to-black text-white py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Ask Price Prediction</span>
                    <ArrowUpRight className="w-4 h-4" />
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
