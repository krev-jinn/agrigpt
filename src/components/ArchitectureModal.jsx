import React, { useState } from 'react';
import { X, Layers, Cpu, Database, CheckCircle, ArrowRight, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('diagram');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">
                  AgriGPT System Architecture & Blueprint
                </h3>
                <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500">
                  VIT Vellore × Samunnati
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                End-to-End Multilingual AI Copilot for Farmers, Mandi Rates & Credit Linkage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'diagram'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            1. System Architecture Layers
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'sources'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            2. Data Grounding (Agmarknet & ICAR)
          </button>
          <button
            onClick={() => setActiveTab('samunnati')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'samunnati'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            3. Samunnati Value Proposition
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {activeTab === 'diagram' && (
            <div className="space-y-5">
              {/* Architecture Layer 1: Client Layer */}
              <div className="border-2 border-emerald-100 bg-emerald-50/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    Layer 1: Multilingual Farmer Experience
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Web / PWA / WhatsApp Bot</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <strong className="block text-slate-900 mb-1">🎙️ Voice In (STT)</strong>
                    <p className="text-slate-600">AI4Bharat Bhashini / Whisper speech-to-text supporting Tamil, Hindi, and Indian English dialects.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <strong className="block text-slate-900 mb-1">🔊 Voice Out (TTS)</strong>
                    <p className="text-slate-600">Vernacular speech synthesis allowing uneducated farmers to listen to answers without reading.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <strong className="block text-slate-900 mb-1">📱 Farmer-First UI</strong>
                    <p className="text-slate-600">High-contrast, large touch chips, visual crop icons, simple cards for yield and profit/acre.</p>
                  </div>
                </div>
              </div>

              {/* Architecture Layer 2: API Gateway & Context Engine */}
              <div className="border-2 border-teal-100 bg-teal-50/40 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-md">
                    Layer 2: Gateway & Context Engine
                  </span>
                  <span className="text-xs font-semibold text-slate-500">FastAPI / Node Engine</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 mb-1">📍 Farmer Spatial Context</strong>
                    <p className="text-slate-600">Geo-locates nearest APMC mandis (Vellore, Ambur, etc.), regional soil type (Red loam, Clay), and local rainfall zone.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 mb-1">🎯 Agri Intent Router</strong>
                    <p className="text-slate-600">Routes farmer prompt to (A) Sowing Advisor, (B) Mandi Price Radar, (C) Pest RAG, or (D) Govt Scheme verification.</p>
                  </div>
                </div>
              </div>

              {/* Architecture Layer 3: AI Agent & RAG Pipeline */}
              <div className="border-2 border-amber-100 bg-amber-50/40 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                    Layer 3: AgriGPT Agent & Vector Knowledge
                  </span>
                  <span className="text-xs font-semibold text-slate-500">LangChain / FAISS / Gemini</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 mb-1">🤖 Fine-Tuned LLM</strong>
                    <p className="text-slate-600">Trained on Indian agricultural taxonomy, regional crop names (e.g. Sambha Nel, Manilapayir), and fertilizer dosages.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 mb-1">📚 Vector DB (FAISS)</strong>
                    <p className="text-slate-600">Indexed ICAR Krishi repository & KVK manuals preventing hallucinations with exact chemical and organic remedies.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 mb-1">⚡ Cache & Mandi Stream</strong>
                    <p className="text-slate-600">Redis cache for high-frequency Agmarknet daily price quotes and IMD weather radar forecasts.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <h4 className="font-bold text-slate-900">
                      Agmarknet Portal Integration (http://agmarknet.gov.in/)
                    </h4>
                  </div>
                  <a
                    href="http://agmarknet.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Visit Agmarknet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Agmarknet tracks commodity arrivals and modal prices across 3,000+ APMC mandis in India. AgriGPT ingests daily quotes for Vellore, Ambur, Tiruvannamalai, and Koyambedu to calculate price trends, nearby price arbitrage, and selling advisories.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌾</span>
                    <h4 className="font-bold text-slate-900">
                      ICAR Krishi Repository (http://krishi.icar.gov.in/)
                    </h4>
                  </div>
                  <a
                    href="http://krishi.icar.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Visit ICAR Krishi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Indian Council of Agricultural Research (ICAR) verified database of Package of Practices (PoP). AgriGPT pulls verified crop varieties (e.g. ADT-53 paddy, TMV-13 groundnut), sowing depths, organic fungicides (*Trichoderma viride*), and pest control schedules.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏛️</span>
                  <h4 className="font-bold text-slate-900">
                    Government Welfare & Weather Connectors
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Direct API bridges to PM-KISAN DBT status, PMFBY crop insurance claim guidelines, Soil Health Card parameters (N-P-K & micronutrients), and IMD rainfall warnings.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'samunnati' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-900 font-bold mb-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span>How AgriGPT Solves Samunnati Finance's Core Mission</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Samunnati is an open agri-commerce and finance enterprise dedicated to unlocking the trillion-dollar potential of Indian agriculture. AgriGPT directly serves Samunnati's 3 strategic pillars:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <strong className="block text-slate-900 mb-1">1. FPO Aggregation</strong>
                    <p className="text-slate-600">Connects individual farmers with local Farmer Producer Organizations (FPOs) for bulk seed purchase and collective bargaining.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <strong className="block text-slate-900 mb-1">2. Credit & Working Capital</strong>
                    <p className="text-slate-600">By tracking farmer crop selection and harvest timelines, Samunnati can offer pre-approved working capital loans without collateral.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <strong className="block text-slate-900 mb-1">3. Direct Market Linkage</strong>
                    <p className="text-slate-600">Bypasses predatory commission agents by directly linking harvest-ready farmers with Samunnati verified institutional buyers.</p>
                  </div>
                </div>
              </div>

              {/* Next review roadmap */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-xs">
                <h5 className="font-bold text-slate-800 mb-2">Roadmap for Forthcoming Reviews:</h5>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong>Phase 1 (Current Demo):</strong> Foundation prototype with multilingual voice gateway, Agmarknet price radar, ICAR sowing advisor.</li>
                  <li>• <strong>Phase 2:</strong> Ingest full 3-year Agmarknet historical dataset for predictive price forecasting and mandi price spike alerts.</li>
                  <li>• <strong>Phase 3:</strong> WhatsApp conversational bot integration for ultra-low bandwidth village connectivity.</li>
                  <li>• <strong>Phase 4:</strong> Samunnati Loan & Working Capital automated pre-qualification engine based on farm yield analytics.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500">
            Prepared for <strong>Samunnati Finance × VIT Vellore Evaluation</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
          >
            Close & Back to Demo
          </button>
        </div>
      </div>
    </div>
  );
}
