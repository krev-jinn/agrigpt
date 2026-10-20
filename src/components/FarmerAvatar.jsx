import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Smile, MessageCircle } from 'lucide-react';

export default function FarmerAvatar({ isSpeaking, isListening, currentLang, avatarType = 'farmer' }) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Animate mouth when speaking
  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 180);
    } else {
      setMouthOpen(false);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Periodic eye blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const getGreeting = () => {
    switch (currentLang) {
      case 'ta': return 'வணக்கம் உழவரே! என்ன சந்தேகம்?';
      case 'hi': return 'नमस्ते किसान भाई! क्या पूछना है?';
      case 'te': return 'నమస్కారం రైతు సోదరా!';
      case 'kn': return 'ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೆ!';
      case 'ml': return 'നമസ്കാരം കർഷക സുഹൃത്തേ!';
      case 'pa': return 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ!';
      case 'mr': return 'नमस्कार शेतकरी मित्रांनो!';
      case 'bn': return 'নমস্কার কৃষক ভাই!';
      default: return 'Hello Farmer Friend! Ask me anything.';
    }
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Animated SVG Farmer / Villager Avatar */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 group cursor-pointer">
        {/* Glow Ring on Voice Activity */}
        <div className={`absolute -inset-1 rounded-full blur-md transition-all duration-300 ${
          isSpeaking
            ? 'bg-gradient-to-r from-emerald-400 via-amber-400 to-green-500 opacity-90 animate-pulse'
            : isListening
            ? 'bg-rose-500 opacity-80 animate-ping'
            : 'bg-emerald-600/30 opacity-40'
        }`} />

        {/* Avatar SVG Container */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-100 via-emerald-100 to-amber-200 border-2 border-emerald-500 shadow-md flex items-center justify-center overflow-hidden">
          {avatarType === 'farmer' ? (
            /* Traditional Indian Villager / Farmer (Turban/Gamcha) */
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Sky/Sun background */}
              <circle cx="50" cy="50" r="48" fill="#fef9c3" />
              <path d="M10 80 Q50 65 90 80 L90 100 L10 100 Z" fill="#15803d" />

              {/* Farmer Body & Kurta */}
              <path d="M25 100 Q50 78 75 100 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Traditional Angavastram / Gamcha */}
              <path d="M30 85 Q50 95 70 85 Q65 100 35 100 Z" fill="#f59e0b" />

              {/* Neck & Face */}
              <rect x="44" y="62" width="12" height="15" rx="3" fill="#d97706" opacity="0.4" />
              <ellipse cx="50" cy="52" rx="20" ry="22" fill="#fcd34d" />

              {/* Saffron Turban / Pagdi / Thundu */}
              <path d="M26 42 Q50 16 74 42 Q80 30 65 20 Q50 12 35 20 Q20 30 26 42 Z" fill="#ea580c" />
              <path d="M32 32 Q50 24 68 32 Q74 26 60 18 Q50 14 40 18 Z" fill="#f97316" />
              {/* Turban fold badge / feather */}
              <circle cx="50" cy="24" r="3" fill="#fbbf24" />

              {/* Eyebrows */}
              <path d="M36 44 Q41 42 45 44" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M55 44 Q59 42 64 44" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Eyes with Blinking */}
              {isBlinking ? (
                <>
                  <path d="M37 49 Q41 52 45 49" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M55 49 Q59 52 63 49" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
                </>
              ) : (
                <>
                  <circle cx="41" cy="48" r="3" fill="#78350f" />
                  <circle cx="59" cy="48" r="3" fill="#78350f" />
                  <circle cx="42" cy="47" r="1" fill="#ffffff" />
                  <circle cx="60" cy="47" r="1" fill="#ffffff" />
                </>
              )}

              {/* Tilak / Bindi on forehead */}
              <path d="M49 34 L51 34 L50 40 Z" fill="#dc2626" />

              {/* Nose */}
              <path d="M50 49 Q52 54 49 56" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* Mustache */}
              <path d="M38 58 Q46 56 50 60 Q54 56 62 58 Q56 64 50 61 Q44 64 38 58 Z" fill="#78350f" />

              {/* Animated Mouth (Moves when speaking) */}
              {mouthOpen ? (
                <ellipse cx="50" cy="65" rx="5" ry="4" fill="#991b1b" />
              ) : (
                <path d="M46 64 Q50 67 54 64" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
              )}

              {/* Cheerful Blush */}
              <ellipse cx="34" cy="55" rx="4" ry="2.5" fill="#f87171" opacity="0.4" />
              <ellipse cx="66" cy="55" rx="4" ry="2.5" fill="#f87171" opacity="0.4" />
            </svg>
          ) : (
            /* Agronomist Dr. Priya */
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#dcfce7" />
              <path d="M26 100 Q50 78 74 100 Z" fill="#0284c7" />
              <ellipse cx="50" cy="52" rx="19" ry="21" fill="#fed7aa" />
              <path d="M28 42 Q50 20 72 42 Q78 68 70 75 Q68 50 65 42 Q50 32 35 42 Q32 50 30 75 Z" fill="#3b0764" />
              {isBlinking ? (
                <path d="M38 50 Q42 53 46 50 M54 50 Q58 53 62 50" stroke="#3b0764" strokeWidth="2" fill="none" />
              ) : (
                <>
                  <circle cx="42" cy="49" r="3" fill="#3b0764" />
                  <circle cx="58" cy="49" r="3" fill="#3b0764" />
                </>
              )}
              {mouthOpen ? (
                <ellipse cx="50" cy="62" rx="4" ry="3" fill="#be123c" />
              ) : (
                <path d="M46 61 Q50 64 54 61" stroke="#be123c" strokeWidth="2" fill="none" />
              )}
            </svg>
          )}

          {/* Voice Wave Indicator overlay when speaking */}
          {isSpeaking && (
            <div className="absolute bottom-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-sm animate-bounce">
              <Volume2 className="w-3 h-3" />
              <span>Speaking</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Speech Bubble from Avatar */}
      <div className="hidden sm:block bg-white/95 backdrop-blur-md border-2 border-emerald-400/80 rounded-2xl p-3 shadow-md relative max-w-xs">
        {/* Pointer Triangle */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-white border-b-6 border-b-transparent" />
        
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 mb-0.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Kisan Mitra (உழவர் நண்பன்)</span>
        </div>
        <p className="text-xs text-slate-700 font-semibold leading-snug">
          {isSpeaking
            ? (currentLang === 'ta' ? '🔊 ஆடியோ வாசிக்கப்படுகிறது...' : currentLang === 'hi' ? '🔊 उत्तर सुनाया जा रहा है...' : '🔊 Speaking advice aloud...')
            : isListening
            ? (currentLang === 'ta' ? '🎙️ நான் கேட்கிறேன்... பேசுங்கள்!' : currentLang === 'hi' ? '🎙️ मैं सुन रहा हूँ... बोलिए!' : '🎙️ I am listening... speak now!')
            : getGreeting()}
        </p>
      </div>
    </div>
  );
}
