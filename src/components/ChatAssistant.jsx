import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, RefreshCw, Volume1, Radio, Settings, Sparkles, User, Bot, CornerDownLeft, ShieldAlert, TrendingUp, Sprout, Landmark } from 'lucide-react';
import FarmerAvatar from './FarmerAvatar';
import AiConfigModal from './AiConfigModal';
import { SUPPORTED_LANGUAGES, callExternalLLM, generateDynamicAgriResponse, playAgriAudio, stopCurrentAudio, AI_CONFIG } from '../services/aiService';

export default function ChatAssistant({ currentLang, setGlobalLang }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: getWelcomeMessage(currentLang),
      audioText: getWelcomeAudio(currentLang)
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningStatus, setListeningStatus] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [avatarType, setAvatarType] = useState('farmer'); // 'farmer' or 'scientist'
  const messagesEndRef = useRef(null);

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  function getWelcomeMessage(lang) {
    switch (lang) {
      case 'ta':
        return '🙏 வணக்கம் உழவர் தோழரே! நான் அக்ரி ஜிபிடி (AgriGPT).\n\nபயிர் சாகுபடி, வேலூர் & தமிழக மண்டி விலை நிலவரம், பயிர் நோய் தடுப்பு மருந்துகள், அல்லது அரசு திட்டங்கள் குறித்து என்னிடம் கேளுங்கள். நீங்கள் தமிழில் பேசலாம் அல்லது தட்டச்சு செய்யலாம்!';
      case 'hi':
        return '🙏 नमस्ते किसान भाई! मैं एग्री-जीपीटी (AgriGPT) हूँ।\n\nफसल बुवाई, मंडी भाव, कीट-रोग नियंत्रण या सरकारी योजनाओं के बारे में मुझसे अपनी भाषा में पूछें। आप माइक दबाकर सीधे हिन्दी में बोल भी सकते हैं!';
      case 'te':
        return '🙏 నమస్కారం రైతు సోదరా! నేను అగ్రి జిపిటి (AgriGPT).\n\nపంట సాగు, మార్కెట్ ధరలు, తెగుళ్ల నివారణ మరియు ప్రభుత్వ పథకాల గురించి నాతో తెలుగులో మాట్లాడండి లేదా టైప్ చేయండి!';
      case 'kn':
        return '🙏 ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೆ! ನಾನು ಅಗ್ರಿ ಜಿಪಿಟಿ (AgriGPT).\n\nಬೆಳೆ ನಿರ್ವಹಣೆ, ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣದ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ!';
      case 'ml':
        return '🙏 നമസ്കാരം കർഷക സുഹൃത്തേ! ഞാൻ അഗ്രി ജിപിടി (AgriGPT).\n\nവിള പരിപാലനം, വിപണി വില, കീടനിയന്ത്രണം എന്നിവയെക്കുറിച്ച് മലയാളത്തിൽ ചോദിക്കൂ!';
      case 'pa':
        return '🙏 ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਐਗਰੀ ਜੀਪੀਟੀ (AgriGPT) ਹਾਂ।\n\nਫ਼ਸਲ ਦੀ ਬਿਜਾਈ, ਮੰਡੀ ਭਾਅ ਅਤੇ ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ ਬਾਰੇ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛੋ!';
      case 'mr':
        return '🙏 नमस्कार शेतकरी मित्रांनो! मी अॅग्री जीपीटी (AgriGPT) आहे.\n\nपीक लागवड, बाजारभाव आणि कीड व्यवस्थापनाबद्दल मराठीत विचारा!';
      case 'bn':
        return '🙏 নমস্কার কৃষক ভাই! আমি অ্যাগ্রি জিপিটি (AgriGPT)।\n\nফসল চাষ, বাজার দর ও রোগ দমন সম্পর্কে বাংলায় প্রশ্ন করুন!';
      default:
        return '🙏 Welcome Farmer! I am AgriGPT.\n\nAsk me about optimal crop sowing, live APMC mandi prices, pest diagnosis, fertilizer dosage, or government subsidies. Tap the mic to speak in your native regional language!';
    }
  }

  function getWelcomeAudio(lang) {
    switch (lang) {
      case 'ta':
        return 'வணக்கம் உழவர் தோழரே, அக்ரி ஜிபிடி உங்களுக்கு உதவ தயாராக உள்ளது. என்னிடம் பயிர் அல்லது மண்டி விலை பற்றி தமிழில் பேசலாம்.';
      case 'hi':
        return 'नमस्ते किसान भाई, मैं एग्री जीपीटी हूँ। मुझसे फसल बुवाई, मंडी भाव और कीट प्रबंधन के बारे में पूछें।';
      default:
        return 'Welcome to AgriGPT. Tap the microphone to speak in your language or type your farming questions below.';
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When user switches language, update welcome text
  useEffect(() => {
    setMessages(prev => [
      {
        id: 'welcome',
        sender: 'bot',
        text: getWelcomeMessage(currentLang),
        audioText: getWelcomeAudio(currentLang)
      },
      ...prev.slice(1)
    ]);
  }, [currentLang]);

  // Speech Recognition (STT) for 9 Indian Languages
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is supported in Chrome, Edge, Safari, and Android browsers. Please use text input or 1-Tap prompts.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setListeningStatus('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = activeLangObj.speechTag || 'ta-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setListeningStatus(`🔴 ${activeLangObj.name} (${activeLangObj.englishName}) - Listening...`);
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
        setListeningStatus(`Mic (${event.error}). Please type below.`);
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

  // Guaranteed TTS Audio Readout
  const handlePlayAudio = (textToRead, messageId) => {
    if (isSpeaking && activeSpeechId === messageId) {
      stopCurrentAudio();
      setIsSpeaking(false);
      setActiveSpeechId(null);
      return;
    }

    setIsSpeaking(true);
    setActiveSpeechId(messageId);

    playAgriAudio(
      textToRead,
      activeLangObj.ttsCode,
      () => {
        setIsSpeaking(true);
        setActiveSpeechId(messageId);
      },
      () => {
        setIsSpeaking(false);
        setActiveSpeechId(null);
      },
      (err) => {
        console.warn('TTS playback issue', err);
        setIsSpeaking(false);
        setActiveSpeechId(null);
      }
    );
  };

  // Send Query (Evaluates Live LLM or Built-in Agronomic Engine)
  const handleSendQuery = async (queryText) => {
    const query = (queryText || inputText).trim();
    if (!query) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsGenerating(true);

    try {
      // 1. Try Live External LLM if user configured API Key (Groq / Gemini)
      let replyData = await callExternalLLM(query, currentLang, messages);

      // 2. Fallback to our deep multi-lingual agronomic reasoning engine
      if (!replyData) {
        replyData = generateDynamicAgriResponse(query, currentLang);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyData.text,
        audioText: replyData.audioText || replyData.text.replace(/[*#•]/g, ''),
        provider: replyData.provider || 'AgriGPT Grounded Engine'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsGenerating(false);

      // Auto-speak response if user initiated with voice
      if (isListening || activeSpeechId) {
        handlePlayAudio(botMessage.audioText, botMessage.id);
      }
    } catch (error) {
      console.error(error);
      const fallback = generateDynamicAgriResponse(query, currentLang);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: fallback.text,
          audioText: fallback.audioText
        }
      ]);
      setIsGenerating(false);
    }
  };

  // Quick Action Chips (Sowing, Pest, Mandi, Schemes)
  const handleQuickChip = (promptText) => {
    handleSendQuery(promptText);
  };

  const handleResetChat = () => {
    stopCurrentAudio();
    setIsSpeaking(false);
    setActiveSpeechId(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: getWelcomeMessage(currentLang),
        audioText: getWelcomeAudio(currentLang)
      }
    ]);
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-between p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Top Interactive Bar: Animated Villager Avatar & Language / AI Selector */}
      <div className="w-full bg-white/95 backdrop-blur-md border-2 border-emerald-400/90 rounded-3xl p-4 sm:p-5 shadow-xl mb-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Animated Villager Character */}
        <div className="flex items-center gap-3">
          <FarmerAvatar
            isSpeaking={isSpeaking}
            isListening={isListening}
            currentLang={currentLang}
            avatarType={avatarType}
          />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {avatarType === 'farmer' ? '👨‍🌾 Ramu Anna (Farmer Guide)' : '👩‍🌾 Dr. Priya (Agronomist)'}
              </span>
              <button
                onClick={() => setAvatarType(prev => prev === 'farmer' ? 'scientist' : 'farmer')}
                className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 underline cursor-pointer"
                title="Switch avatar character"
              >
                Switch Avatar
              </button>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Live Voice & Native Dialect Assistant
            </p>
          </div>
        </div>

        {/* AI Engine & Regional Language Controls */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Active Provider Pill */}
          <button
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-xs hover:shadow-md transition cursor-pointer"
            title="Configure Bhashini or LLM Engine"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-200" />
            <span className="capitalize">{AI_CONFIG.activeProvider} AI</span>
          </button>

          {/* 9 Language Selector Dropdown */}
          <div className="relative">
            <select
              value={currentLang}
              onChange={(e) => setGlobalLang(e.target.value)}
              className="bg-white border-2 border-emerald-400 text-emerald-950 font-black text-xs sm:text-sm rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.englishName})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetChat}
            className="text-xs text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
            title="Clear Chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Chat Stream Container (ChatGPT / Gemini Full Experience) */}
      <div className="w-full flex-1 bg-white/95 backdrop-blur-md border-2 border-emerald-400/90 rounded-3xl shadow-2xl flex flex-col h-[560px] sm:h-[620px] overflow-hidden">
        
        {/* Chat Stream Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-black text-sm text-emerald-200">
              AgriGPT • {activeLangObj.name} ({activeLangObj.englishName}) Mode
            </span>
          </div>

          {isSpeaking && (
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1 shadow-sm">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Speaking in {activeLangObj.name}...</span>
              </span>
              <button
                onClick={() => {
                  stopCurrentAudio();
                  setIsSpeaking(false);
                  setActiveSpeechId(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <VolumeX className="w-3 h-3" />
                <span>Stop</span>
              </button>
            </div>
          )}
        </div>

        {/* Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-50/50 via-white to-emerald-50/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-700 to-green-600 text-white flex items-center justify-center shrink-0 shadow-md mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed transition-all shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-tr-xs shadow-emerald-900/20'
                    : 'bg-white text-slate-800 border-2 border-emerald-100 rounded-tl-xs shadow-slate-200/60'
                }`}
              >
                <div className="whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {/* Bot Message Footer: Audio Playback & Grounding Tag */}
                {msg.sender === 'bot' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      {msg.provider || 'ICAR & Agmarknet Grounded'}
                    </span>

                    <button
                      onClick={() => handlePlayAudio(msg.audioText || msg.text, msg.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition shadow-xs cursor-pointer ${
                        activeSpeechId === msg.id && isSpeaking
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {activeSpeechId === msg.id && isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{currentLang === 'ta' ? '🔊 தமிழில் கேட்க' : currentLang === 'hi' ? '🔊 बोलकर सुनें' : '🔊 Listen Audio'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {/* Thinking / Generating Skeleton */}
          {isGenerating && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>{currentLang === 'ta' ? 'அக்ரி ஜிபிடி சிந்தித்து பதில் தயாரிக்கிறது...' : currentLang === 'hi' ? 'एग्री-जीपीटी उत्तर तैयार कर रहा है...' : 'AgriGPT is reasoning and preparing advice...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Capability Chips Bar (Sowing, Pest Doctor, Mandi Radar, Schemes) */}
        <div className="px-4 py-2 bg-emerald-50/60 border-t border-emerald-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider shrink-0">
            ⚡ Quick Modes:
          </span>

          <button
            onClick={() => handleQuickChip(currentLang === 'ta' ? 'இப்போது அக்டோபர் மாதத்தில் என்ன பயிரிடலாம்?' : currentLang === 'hi' ? 'अक्टूबर में कौन सी फसल बोएं?' : 'Which crop should I sow right now in October?')}
            className="flex items-center gap-1 text-xs font-extrabold bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-xl shrink-0 transition shadow-2xs cursor-pointer"
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLang === 'ta' ? '🌱 பயிர் தேர்வு' : currentLang === 'hi' ? '🌱 फसल बुवाई' : '🌱 Sowing Advisor'}</span>
          </button>

          <button
            onClick={() => handleQuickChip(currentLang === 'ta' ? 'வேலூர் மண்டியில் இன்றைய தக்காளி விலை என்ன?' : currentLang === 'hi' ? 'वेल्लोर में आज टमाटर का भाव क्या है?' : 'What is the current tomato mandi price in Vellore?')}
            className="flex items-center gap-1 text-xs font-extrabold bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-xl shrink-0 transition shadow-2xs cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentLang === 'ta' ? '📊 மண்டி விலை' : currentLang === 'hi' ? '📊 मंडी भाव' : '📊 Mandi Rates'}</span>
          </button>

          <button
            onClick={() => handleQuickChip(currentLang === 'ta' ? 'நெல் குலை நோய் மருந்து மற்றும் பூச்சி கட்டுப்பாடு' : currentLang === 'hi' ? 'धान में झुलसा रोग का उपचार व दवा' : 'Paddy blast disease symptoms and ICAR medicine dosage')}
            className="flex items-center gap-1 text-xs font-extrabold bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-xl shrink-0 transition shadow-2xs cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>{currentLang === 'ta' ? '🛡️ பூச்சி டாக்டர்' : currentLang === 'hi' ? '🛡️ कीट डॉक्टर' : '🛡️ Pest Doctor'}</span>
          </button>

          <button
            onClick={() => handleQuickChip(currentLang === 'ta' ? 'பிஎம் கிசான் ₹6,000 மற்றும் பயிர் காப்பீடு எப்படி பெறுவது?' : currentLang === 'hi' ? 'पीएम किसान ₹6000 और फसल बीमा कैसे पाएं?' : 'How to apply for PM-KISAN ₹6,000 and PMFBY crop insurance?')}
            className="flex items-center gap-1 text-xs font-extrabold bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-xl shrink-0 transition shadow-2xs cursor-pointer"
          >
            <Landmark className="w-3.5 h-3.5 text-teal-600" />
            <span>{currentLang === 'ta' ? '🏛️ அரசு உதவி' : currentLang === 'hi' ? '🏛️ सरकारी योजना' : '🏛️ Govt Schemes'}</span>
          </button>
        </div>

        {/* Input Dock with High-Impact Voice Mic */}
        <div className="p-3 sm:p-4 bg-white border-t border-emerald-200">
          {listeningStatus && (
            <div className="mb-2 text-xs font-black text-rose-700 animate-pulse bg-rose-50 border border-rose-200 rounded-xl p-2 flex items-center justify-between">
              <span>{listeningStatus}</span>
              <button onClick={() => setIsListening(false)} className="text-[10px] underline cursor-pointer">Cancel</button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2 sm:gap-3 bg-slate-50 border-2 border-emerald-400 focus-within:border-emerald-600 rounded-2xl p-1.5 shadow-md transition"
          >
            {/* Animated High-Visibility Microphone Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-white transition-all shadow-md shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 mic-recording-pulse ring-4 ring-rose-200'
                  : 'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 hover:scale-105 active:scale-95 shadow-emerald-700/30'
              }`}
              title={isListening ? 'Click to stop' : `Speak in ${activeLangObj.name} (${activeLangObj.englishName})`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 animate-pulse" />
              ) : (
                <Mic className="w-6 h-6 stroke-[2.5]" />
              )}
            </button>

            {/* Conversational Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? `${activeLangObj.name} - Listening...`
                  : currentLang === 'ta'
                  ? 'தமிழில் ஏதேனும் கேளுங்கள் (அல்லது மைக்கை அழுத்தி பேசுங்கள்)...'
                  : currentLang === 'hi'
                  ? 'हिन्दी में पूछें (या माइक दबाकर सीधे बोलें)...'
                  : `Ask any farming question in ${activeLangObj.englishName} or tap mic...`
              }
              className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base outline-none text-slate-900 placeholder:text-slate-400 font-medium"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-emerald-800 to-green-900 hover:from-emerald-900 hover:to-black disabled:opacity-30 text-white px-4 sm:px-6 py-3 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* AI Config / Bhashini Modal */}
      <AiConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

    </div>
  );
}
