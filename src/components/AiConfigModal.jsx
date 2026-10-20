import React, { useState } from 'react';
import { X, Cpu, Key, ShieldCheck, Check, Sparkles, Globe2, Radio, Server } from 'lucide-react';
import { AI_CONFIG, saveAiConfig } from '../services/aiService';

export default function AiConfigModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState(AI_CONFIG.activeProvider);
  const [bhashiniUserId, setBhashiniUserId] = useState(AI_CONFIG.bhashiniUserId);
  const [bhashiniApiKey, setBhashiniApiKey] = useState(AI_CONFIG.bhashiniApiKey);
  const [bhashiniPipelineId, setBhashiniPipelineId] = useState(AI_CONFIG.bhashiniPipelineId);
  const [geminiApiKey, setGeminiApiKey] = useState(AI_CONFIG.geminiApiKey);
  const [groqApiKey, setGroqApiKey] = useState(AI_CONFIG.groqApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveAiConfig({
      activeProvider: provider,
      bhashiniUserId,
      bhashiniApiKey,
      bhashiniPipelineId,
      geminiApiKey,
      groqApiKey
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border-2 border-emerald-400 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                AI Engine & Bhashini Settings
              </h3>
              <p className="text-xs text-emerald-200">
                Choose between Built-In Agronomic Engine, Bhashini (NLTM), or Open LLMs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Provider Selection Cards */}
          <div>
            <label className="font-extrabold text-slate-900 block mb-2 text-xs uppercase tracking-wider">
              Select AI Intelligence Provider:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: Built-In Dynamic Agronomic Engine (Default, Zero Config) */}
              <div
                onClick={() => setProvider('built-in')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  provider === 'built-in'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    🧠 Built-in Agri Engine
                  </span>
                  {provider === 'built-in' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Real-time dynamic reasoning across 9 Indian languages. Grounded on ICAR & Agmarknet. No API keys needed.
                </p>
              </div>

              {/* Option 2: Bhashini NLTM (Government of India) */}
              <div
                onClick={() => setProvider('bhashini')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  provider === 'bhashini'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    🇮🇳 Bhashini (MeitY)
                  </span>
                  {provider === 'bhashini' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  National Language Translation Mission by AI4Bharat & Govt. of India for Indian regional languages.
                </p>
              </div>

              {/* Option 3: Groq Cloud (Free LLaMA 3.3 70B) */}
              <div
                onClick={() => setProvider('groq')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  provider === 'groq'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    ⚡ Groq (LLaMA 3.3 70B)
                  </span>
                  {provider === 'groq' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ultra-fast open-source LLM running at 300 tokens/sec. Free API keys available from console.groq.com.
                </p>
              </div>

              {/* Option 4: Google Gemini */}
              <div
                onClick={() => setProvider('gemini')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  provider === 'gemini'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    ✨ Google Gemini 1.5 Flash
                  </span>
                  {provider === 'gemini' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Google’s multilingual multimodal model with high-speed Indic language comprehension.
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Credential Inputs */}
          {provider === 'bhashini' && (
            <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 space-y-3">
              <span className="font-extrabold text-emerald-950 block text-xs">
                Enter your Bhashini ULCA Credentials:
              </span>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">User ID</label>
                <input
                  type="text"
                  value={bhashiniUserId}
                  onChange={(e) => setBhashiniUserId(e.target.value)}
                  placeholder="e.g. your_bhashini_user_id"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">ULCA API Key</label>
                <input
                  type="password"
                  value={bhashiniApiKey}
                  onChange={(e) => setBhashiniApiKey(e.target.value)}
                  placeholder="e.g. bhashini_api_key_xxx"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Pipeline ID (Optional)</label>
                <input
                  type="text"
                  value={bhashiniPipelineId}
                  onChange={(e) => setBhashiniPipelineId(e.target.value)}
                  placeholder="Default: Standard Indic Translation"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {provider === 'groq' && (
            <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 space-y-2">
              <label className="font-extrabold text-amber-950 block text-xs">
                Enter Groq API Key (gsk_...):
              </label>
              <input
                type="password"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-600"
              />
              <p className="text-[10px] text-slate-500">
                Get a free key in 30 seconds at <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">console.groq.com</a>.
              </p>
            </div>
          )}

          {provider === 'gemini' && (
            <div className="bg-blue-50/80 border border-blue-300 rounded-2xl p-4 space-y-2">
              <label className="font-extrabold text-blue-950 block text-xs">
                Enter Google Gemini API Key:
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSyxxxxxxxxxxxxxxxxx"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-600"
              />
              <p className="text-[10px] text-slate-500">
                Get a free key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">Google AI Studio</a>.
              </p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-semibold">
              {savedSuccess ? '✅ Settings saved successfully!' : 'Default is zero-config built-in engine'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
