import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, RefreshCw, Volume1, Radio, MessageSquare, Sparkles } from 'lucide-react';
import { UI_TEXT, AUDIO_QUESTIONS, getFarmerResponse, LANGUAGES } from '../data/agriData';

export default function ChatAssistant({ currentLang, setGlobalLang }) {
  const t = UI_TEXT[currentLang] || UI_TEXT.en;
  
  const [voiceLang, setVoiceLang] = useState(currentLang);
  const currentAudioRef = useRef(null);

  useEffect(() => {
    setVoiceLang(currentLang);
  }, [currentLang]);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: currentLang === 'ta'
        ? '🙏 வணக்கம் உழவர் தோழரே! நான் அக்ரி ஜிபிடி (AgriGPT).\n\nஇப்போது என்ன பயிர் பயிரிடலாம், இன்றைய வேலூர் மண்டி விலை, அல்லது பூச்சி மருந்துகள் பற்றி கீழேயுள்ள மைக்கை அழுத்தி தமிழில் பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்.'
        : currentLang === 'hi'
        ? '🙏 नमस्ते किसान भाई! मैं एग्री-जीपीटी (AgriGPT) हूँ।\n\nइस समय कौन सी फसल बोएं, आज का वेल्लोर मंडी भाव, या कीट नियंत्रण के बारे में नीचे माइक दबाकर सीधे अपनी भाषा में बोलें या लिखें।'
        : '🙏 Welcome! I am AgriGPT.\n\nAsk me what crop to cultivate right now, today’s mandi prices in Vellore, or remedies for crop diseases. Tap the mic to speak in Tamil, Hindi, or English, or type below.',
      audioText: currentLang === 'ta'
        ? 'வணக்கம் உழவர் தோழரே, அக்ரி ஜிபிடி உங்களுக்கு உதவ தயாராக உள்ளது. இப்போது என்ன பயிர் பயிரிடலாம் அல்லது மண்டி விலை பற்றி மைக்கை அழுத்தி தமிழில் பேசலாம்.'
        : currentLang === 'hi'
        ? 'नमस्ते किसान भाई, मैं एग्री जीपीटी हूँ। मुझसे फसल बुवाई, मंडी भाव और कीट प्रबंधन के बारे में माइक दबाकर सीधे बोलकर पूछें।'
        : 'Welcome to AgriGPT. Tap the microphone to speak in your language or type your question below.'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningStatus, setListeningStatus] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle external query triggers
  useEffect(() => {
    const handleQuickQueryEvent = (e) => {
      if (e.detail) {
        handleSendQuery(e.detail);
      }
    };
    window.addEventListener('agrigpt-quick-query', handleQuickQueryEvent);
    return () => {
      window.removeEventListener('agrigpt-quick-query', handleQuickQueryEvent);
    };
  }, [currentLang]);

  // Robust Speech-to-Text (Tamil, Hindi, English)
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is supported in Chrome, Edge, and Android browsers. You can also tap the 1-Tap Audio Questions!');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setListeningStatus('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const selectedLangTag = LANGUAGES[voiceLang]?.speechLang || (currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      recognition.lang = selectedLangTag;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setListeningStatus(
          voiceLang === 'ta'
            ? '🔴 தமிழில் கேட்கிறது... பேசுங்கள்...'
            : voiceLang === 'hi'
            ? '🔴 सुन रहे हैं... बोलिए...'
            : `🔴 Listening in English... Speak now...`
        );
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setListeningStatus('');
        setInputText(transcript);
        handleSendQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setListeningStatus(`Mic (${event.error}). Try 1-Tap Audio buttons.`);
      };

      recognition.onend = () => {
        setIsListening(false);
        setListeningStatus('');
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      setListeningStatus('');
    }
  };

  // STOP ANY ACTIVE AUDIO
  const stopAllAudio = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    setIsSpeaking(false);
    setActiveSpeechId(null);
  };

  // GUARANTEED TAMIL / HINDI / ENGLISH AUDIO TTS ENGINE
  const handleSpeak = (rawText, messageId) => {
    if (isSpeaking && activeSpeechId === messageId) {
      stopAllAudio();
      return;
    }

    stopAllAudio();

    // Clean text for speech
    const clean = rawText
      ? rawText.replace(/[*#•_`~[\]()]/g, ' ').replace(/\s+/g, ' ').trim()
      : 'விவசாய ஆலோசனை';

    // Limit text length for TTS playback
    const speechSnippet = clean.length > 180 ? clean.slice(0, 175) + '...' : clean;
    const langCode = currentLang === 'ta' ? 'ta' : currentLang === 'hi' ? 'hi' : 'en';

    setIsSpeaking(true);
    setActiveSpeechId(messageId);

    // Primary: Google Cloud TTS stream (Generates native, crystal clear Tamil / Hindi / English voice)
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(speechSnippet)}&tl=${langCode}&client=tw-ob`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        setActiveSpeechId(null);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        // Fallback to Web Speech Synthesis if network audio fails
        fallbackWebSpeech(speechSnippet, langCode, messageId);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play error, falling back to WebSpeech', err);
          fallbackWebSpeech(speechSnippet, langCode, messageId);
        });
      }
    } catch (err) {
      fallbackWebSpeech(speechSnippet, langCode, messageId);
    }
  };

  // Secondary Fallback
  const fallbackWebSpeech = (text, langCode, messageId) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setActiveSpeechId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'ta' ? 'ta-IN' : langCode === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;

      // Try matching native voice
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.startsWith(langCode) || v.name.toLowerCase().includes(langCode === 'ta' ? 'tamil' : 'hindi'));
      if (match) utterance.voice = match;

      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveSpeechId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setActiveSpeechId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    }
  };

  // Send query
  const handleSendQuery = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const response = getFarmerResponse(query, currentLang);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.text,
        audioText: response.audioText || response.text.replace(/[*#•]/g, '')
      };
      setMessages((prev) => [...prev, botMessage]);

      // Automatically speak the response in farmer's language if voice query was used
      if (isListening || activeSpeechId) {
        handleSpeak(botMessage.audioText, botMessage.id);
      }
    }, 350);
  };

  // 1-Tap Audio for non-literate farmers
  const handleOneTapAudio = (qItem) => {
    const questionText =
      currentLang === 'ta' ? qItem.queryTa : currentLang === 'hi' ? qItem.queryHi : qItem.queryEn;
    handleSendQuery(questionText);
  };

  const handleResetChat = () => {
    stopAllAudio();
    setMessages([messages[0]]);
  };

  return (
    <section id="chat" className="pt-6 pb-12 w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      {/* FULL WIDTH DASHBOARD CONTAINER */}
      <div className="w-full">
        {/* Section Headline */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/60 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-black shadow-md mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI Voice & Multilingual Assistant • தமிழ் • हिन्दी • English</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {t.navVoice}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 max-w-3xl mx-auto font-medium drop-shadow-sm">
            {t.subtagline}
          </p>
        </div>

        {/* 2-COLUMN FULL-WIDTH LAYOUT ON LAPTOP / STACK ON MOBILE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          
          {/* LEFT COLUMN: ILLITERATE FARMER AUDIO TILES & VOICE CONTROLS (4 Cols on laptop) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1-Tap Audio Question Card Deck */}
            <div className="bg-white/95 backdrop-blur-md border-2 border-emerald-400/80 rounded-3xl p-5 shadow-xl shadow-emerald-950/20">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                    <Volume1 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      {currentLang === 'ta' ? 'குரல் மூலம் கேட்க' : currentLang === 'hi' ? 'बोलकर पूछें' : '1-Tap Spoken Audio'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      {currentLang === 'ta' ? 'எழுத தெரியாதவர்களுக்கான நேரடி ஆடியோ' : currentLang === 'hi' ? 'सीधे बटन दबाकर सुनें' : 'Tap to ask & hear answer'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
                  🔊 Instant Voice
                </span>
              </div>

              <div className="space-y-2.5">
                {AUDIO_QUESTIONS.map((q) => {
                  const label =
                    currentLang === 'ta' ? q.labelTa : currentLang === 'hi' ? q.labelHi : q.labelEn;

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleOneTapAudio(q)}
                      className="w-full bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white hover:from-emerald-100 hover:to-teal-100 border border-emerald-300/80 rounded-2xl p-3 text-left transition-all duration-200 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                          {q.icon}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-950 leading-snug">
                          {label}
                        </span>
                      </div>

                      <span className="shrink-0 bg-emerald-700 group-hover:bg-emerald-800 text-white text-[11px] font-black px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{currentLang === 'ta' ? 'கேட்க' : currentLang === 'hi' ? 'सुनें' : 'Ask'}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-slate-600 bg-emerald-50/70 p-2.5 rounded-xl">
                📢 <strong>{currentLang === 'ta' ? 'குறிப்பு:' : currentLang === 'hi' ? 'सूचना:' : 'Tip:'}</strong> {currentLang === 'ta' ? 'பதில்கள் உடனே தமிழிலேயே வாசிக்கப்படும்.' : currentLang === 'hi' ? 'उत्तर तुरंत हिन्दी में सुनाया जाएगा।' : 'Answers are spoken back aloud in your language.'}
              </div>
            </div>

            {/* Quick Sowing Badge Card */}
            <div className="bg-gradient-to-br from-emerald-950/90 to-green-950/90 backdrop-blur-md border-2 border-emerald-500/50 rounded-3xl p-5 text-white shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>October 2026 Season Alert</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                {currentLang === 'ta' ? 'சம்பா நெல் & தக்காளி சீசன்' : currentLang === 'hi' ? 'संबा धान व टमाटर सीजन' : 'Samba Paddy & Tomato Season'}
              </h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {currentLang === 'ta'
                  ? 'வேலூர் சந்தையில் தக்காளி விலை 12% உயர்ந்துள்ளது. விளைச்சல் தயார் என்றால் உடனே விற்கலாம்.'
                  : currentLang === 'hi'
                  ? 'वेल्लोर में टमाटर के भाव 12% चढ़े हैं। फसल बेचने का यह सबसे सही समय है।'
                  : 'Vellore market tomato prices are up 12%. Excellent realization for ready harvest.'}
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: FULL-WIDTH CHAT STREAM & VOICE INPUT (8 Cols on laptop) */}
          <div className="lg:col-span-8 bg-white/95 backdrop-blur-md border-2 border-emerald-400/90 rounded-3xl shadow-2xl flex flex-col h-[580px] overflow-hidden">
            
            {/* Header with status */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-black text-sm sm:text-base text-emerald-100">
                  AgriGPT Voice Assistant ({LANGUAGES[currentLang]?.name})
                </span>
                {isSpeaking && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    <span>Speaking in {LANGUAGES[currentLang]?.name}...</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <button
                    onClick={stopAllAudio}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-3 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Voice</span>
                  </button>
                )}

                <button
                  onClick={handleResetChat}
                  className="text-xs text-emerald-200 hover:text-white flex items-center gap-1 font-semibold transition bg-emerald-800/90 hover:bg-emerald-700 px-3 py-1 rounded-lg cursor-pointer"
                  title="Clear conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-50/70 to-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[94%] sm:max-w-[88%] rounded-3xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed shadow-sm transition-all ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-br-xs shadow-md shadow-emerald-800/20'
                        : 'bg-white text-slate-800 border-2 border-emerald-100 rounded-bl-xs shadow-md shadow-slate-200/60'
                    }`}
                  >
                    <div className="whitespace-pre-line font-normal">
                      {msg.text}
                    </div>

                    {/* Audio Speaker Button for every bot reply */}
                    {msg.sender === 'bot' && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-end">
                        <button
                          onClick={() => handleSpeak(msg.audioText || msg.text, msg.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer ${
                            activeSpeechId === msg.id && isSpeaking
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse ring-2 ring-amber-300'
                              : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-emerald-700/20'
                          }`}
                        >
                          {activeSpeechId === msg.id && isSpeaking ? (
                            <>
                              <VolumeX className="w-4 h-4" />
                              <span>{currentLang === 'ta' ? 'ஆடியோ நிறுத்து' : currentLang === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4" />
                              <span>{currentLang === 'ta' ? '🔊 தமிழில் ஆடியோ கேட்க' : currentLang === 'hi' ? '🔊 हिन्दी में उत्तर सुनें' : '🔊 Listen in English'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Prominent Microphone Deck */}
            <div className="p-3 sm:p-4 bg-gradient-to-b from-white to-emerald-50/60 border-t border-emerald-200">
              {/* Spoken Language row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-700">🎙️ Spoken Language:</span>
                  {Object.values(LANGUAGES).map((lang) => {
                    const isSel = voiceLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setVoiceLang(lang.code);
                          if (setGlobalLang) setGlobalLang(lang.code);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all shadow-2xs cursor-pointer ${
                          isSel
                            ? 'bg-gradient-to-r from-emerald-700 to-green-700 text-white ring-2 ring-emerald-400'
                            : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                        }`}
                      >
                        {lang.name}
                      </button>
                    );
                  })}
                </div>

                {listeningStatus && (
                  <span className="text-xs font-black text-rose-700 animate-pulse bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    {listeningStatus}
                  </span>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="flex items-center gap-2.5 bg-white border-2 border-emerald-400/90 focus-within:border-emerald-600 rounded-2xl p-1.5 shadow-md transition-all"
              >
                {/* 3D Microphone */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-white transition-all shadow-md shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 mic-recording-pulse ring-4 ring-rose-200'
                      : 'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 hover:scale-105 active:scale-95 shadow-emerald-600/30'
                  }`}
                  title={isListening ? 'Click to stop' : `Tap to speak in ${LANGUAGES[voiceLang]?.name}`}
                >
                  {isListening ? (
                    <MicOff className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Mic className="w-6 h-6 stroke-[2.5]" />
                  )}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? t.micListening : t.typePlaceholder}
                  className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-gradient-to-r from-emerald-800 to-green-900 hover:from-emerald-900 hover:to-black disabled:opacity-30 disabled:hover:from-emerald-800 text-white px-5 py-3 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <span>{t.askBtn}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
