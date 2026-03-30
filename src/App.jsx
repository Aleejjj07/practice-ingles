import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';

// Base de datos con Iconos Visuales (SVG) en lugar de fotos externas que fallan
const FRASES_BASE = [
  { english: "I need backup, help me!", category: "gaming", icon: "🎮", color: "#8b5cf6" },
  { english: "Don't forget to like and subscribe.", category: "social", icon: "📱", color: "#ef4444" },
  { english: "The lag is unbearable today.", category: "gaming", icon: "🌐", color: "#3b82f6" },
  { english: "Where is the nearest bathroom?", category: "travel", icon: "🚻", color: "#10b981" },
  { english: "I am looking for the train station.", category: "travel", icon: "🚂", color: "#f59e0b" },
  { english: "What time is my flight?", category: "travel", icon: "✈️", color: "#06b6d4" },
  { english: "Can I have a glass of water, please?", category: "restaurant", icon: "🥛", color: "#38bdf8" },
  { english: "The check, please.", category: "restaurant", icon: "🧾", color: "#64748b" },
  { english: "How much does this cost?", category: "shopping", icon: "💰", color: "#fbbf24" },
  { english: "I lost my passport.", category: "emergency", icon: "📕", color: "#b91c1c" },
  { english: "I am allergic to peanuts.", category: "health", icon: "🥜", color: "#d97706" }
];

const THEME = {
  bg: '#0f172a', panel: '#1e293b', text: '#f1f5f9', primary: '#38bdf8', success: '#10b981', error: '#f43f5e', border: '#334155', gold: '#f59e0b'
};

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);
  const [feedback, setFeedback] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const newLevel = Math.floor(xp / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      toast.success(`¡NIVEL ${newLevel}!`, { icon: '🆙' });
    }
  }, [xp, level]);

  const speakNative = () => {
    const utterance = new SpeechSynthesisUtterance(currentPhrase.english);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const playMyVoice = () => {
    if (audioUrl) new Audio(audioUrl).play();
    else toast.error("Graba primero");
  };

  const nextPhrase = () => {
    const idx = FRASES_BASE.findIndex(f => f.english === currentPhrase.english);
    setCurrentPhrase(FRASES_BASE[(idx + 1) % FRASES_BASE.length]);
    setFeedback('');
    setAudioUrl(null);
  };

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Usa Chrome");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };
      mediaRecorderRef.current.start();

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => { setIsListening(true); setFeedback('Listening...'); };
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase().replace(/[?.!,]/g, "");
        const original = currentPhrase.english.toLowerCase().replace(/[?.!,]/g, "");
        setIsListening(false);
        mediaRecorderRef.current.stop();

        if (text === original) {
          setFeedback('✅ EXCELLENT!');
          setXp(prev => prev + 10);
        } else {
          setFeedback('❌ TRY AGAIN');
          setXp(prev => prev + 2);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } catch (err) { toast.error("Activa el micro"); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: THEME.bg, color: THEME.text, padding: '20px', fontFamily: 'sans-serif', maxWidth: '450px', margin: 'auto' }}>
      <Toaster />
      
      {/* HUD DE NIVEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', background: THEME.panel, borderRadius: '15px', borderBottom: `4px solid ${THEME.border}` }}>
        <div><small style={{color: THEME.gold, fontWeight: 'bold'}}>LVL {level}</small><div style={{fontSize: '20px', fontWeight: 'bold'}}>{xp} XP</div></div>
        <div style={{textAlign: 'right'}}><small style={{color: THEME.primary}}>TOPIC</small><div style={{fontWeight: 'bold'}}>{currentPhrase.category.toUpperCase()}</div></div>
      </div>

      {/* TARJETA VISUAL (SIN IMAGENES QUE FALLAN) */}
      <div style={{ background: THEME.panel, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${THEME.border}`, position: 'relative' }}>
        <div style={{ width: '100%', height: '180px', background: `linear-gradient(135deg, ${currentPhrase.color}44, ${currentPhrase.color}11)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
          {currentPhrase.icon}
        </div>
        
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', margin: '0 0 10px 0' }}>{currentPhrase.english}</h2>
          <button onClick={speakNative} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', marginBottom: '15px' }}>🔊 Listen Native</button>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: feedback.includes('✅') ? THEME.success : THEME.error }}>{feedback}</div>
        </div>
      </div>

      {/* ACCIONES */}
      <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={startListening} style={{ padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: isListening ? THEME.error : THEME.success, color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}>
          {isListening ? '🛑 LISTENING...' : '🎙️ PRESS & SPEAK'}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button onClick={playMyVoice} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: audioUrl ? '#8b5cf6' : '#475569', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: audioUrl ? 1 : 0.5 }}>
            🎧 REPLAY ME
          </button>
          <button onClick={nextPhrase} style={{ padding: '15px', borderRadius: '15px', border: `1px solid ${THEME.border}`, background: 'transparent', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}>
            NEXT ➡️
          </button>
        </div>
      </div>

      {/* BARRA DE PROGRESO */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ width: '100%', height: '10px', background: THEME.panel, borderRadius: '5px' }}>
          <div style={{ width: `${(xp % 50) * 2}%`, height: '100%', background: THEME.primary, borderRadius: '5px', transition: 'width 0.3s' }} />
        </div>
      </div>
    </div>
  );
}
