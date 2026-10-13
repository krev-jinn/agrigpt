import React from 'react';
import { Landmark, CheckCircle, ArrowUpRight, Gift, ShieldAlert, BadgePercent } from 'lucide-react';
import { SCHEMES_DATA, UI_TEXT } from '../data/agriData';

export default function SchemesGuide({ currentLang, onQueryScheme }) {
  const t = UI_TEXT[currentLang] || UI_TEXT.en;

  const schemeIcons = [
    { icon: Gift, color: 'text-amber-500 bg-amber-100' },
    { icon: ShieldAlert, color: 'text-teal-600 bg-teal-100' },
    { icon: BadgePercent, color: 'text-emerald-600 bg-emerald-100' },
  ];

  return (
    <section id="schemes" className="py-14 w-full px-4 sm:px-6 lg:px-10 xl:px-14 border-t border-emerald-500/20">
      <div className="w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md border border-teal-400 text-teal-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <Landmark className="w-3.5 h-3.5 text-teal-400" />
            <span>Direct Benefit Transfer & Subsidized Welfare</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {t.schemesSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 font-medium drop-shadow-sm">
            {t.schemesSectionDesc}
          </p>
        </div>

        {/* Schemes Full-Width Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {SCHEMES_DATA.map((scheme, idx) => {
            const title =
              currentLang === 'ta' ? scheme.titleTa : currentLang === 'hi' ? scheme.titleHi : scheme.titleEn;
            const benefit =
              currentLang === 'ta' ? scheme.benefitTa : currentLang === 'hi' ? scheme.benefitHi : scheme.benefitEn;
            const how =
              currentLang === 'ta' ? scheme.howTa : currentLang === 'hi' ? scheme.howHi : scheme.howEn;
            const iconObj = schemeIcons[idx % schemeIcons.length];
            const IconComp = iconObj.icon;

            return (
              <div
                key={scheme.id}
                className="bg-white/95 backdrop-blur-md border-2 border-emerald-300/80 hover:border-emerald-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                      {title}
                    </h3>
                    <div className={`w-11 h-11 rounded-2xl ${iconObj.color} flex items-center justify-center shrink-0 shadow-xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Benefit Highlight Box */}
                  <div className="bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-300/90 rounded-2xl p-4 mb-4 text-xs">
                    <span className="font-black text-amber-950 uppercase tracking-wide block mb-1">
                      🎁 Direct Financial Payout:
                    </span>
                    <p className="font-black text-amber-900 text-sm sm:text-base leading-snug">
                      {benefit}
                    </p>
                  </div>

                  {/* How to Apply */}
                  <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 leading-relaxed font-medium">
                    <span className="font-extrabold text-slate-900 block mb-1 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>How to receive benefits:</span>
                    </span>
                    <p>{how}</p>
                  </div>
                </div>

                {/* Ask Assistant Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                  <a
                    href="#chat"
                    onClick={() => onQueryScheme(`How can I apply for ${scheme.titleEn}?`)}
                    className="w-full text-center inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-950 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <span>Ask Step-by-Step Help</span>
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
