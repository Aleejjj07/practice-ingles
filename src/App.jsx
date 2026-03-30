import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const FRASES_BASE = [
  { english: "I need backup, help me!", category: "gaming", imageUrl: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "Don't forget to like and subscribe.", category: "social", imageUrl: "https://images.pexels.com/photos/5077067/pexels-photo-5077067.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "The lag is unbearable today.", category: "gaming", imageUrl: "https://images.pexels.com/photos/7862591/pexels-photo-7862591.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "Where is the nearest bathroom?", category: "travel", imageUrl: "https://images.pexels.com/photos/4239505/pexels-photo-4239505.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "I am looking for the train station.", category: "travel", imageUrl: "https://images.pexels.com/photos/258510/pexels-photo-258510.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "What time is my flight?", category: "travel", imageUrl: "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "Can you help me with my bags?", category: "travel", imageUrl: "https://images.pexels.com/photos/93488/pexels-photo-93488.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "Can I have a glass of water, please?", category: "restaurant", imageUrl: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "The check, please.", category: "restaurant", imageUrl: "https://images.pexels.com/photos/5849559/pexels-photo-5849559.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "How much does this cost?", category: "shopping", imageUrl: "https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "I lost my passport.", category: "emergency", imageUrl: "https://images.pexels.com/photos/2731564/pexels-photo-2731564.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { english: "I am allergic to peanuts.", category: "health", imageUrl: "https://images.pexels.com/photos/4667141/pexels-photo-4667141.jpeg?auto=compress&cs=tinysrgb&w=600" }
];

const THEME = {
  bg: '#0f172a', panel: '#1e293b', text: '#f1f5f9', primary: '#38bdf8', success: '#10b981', error: '#f43f5e', border: '#334155', gold: '#f59e0b', secondary: '#8b5cf6'
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

  // Subida de nivel
  useEffect(() => {
    const newLevel = Math.floor(xp / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      toast.success(`LEVEL UP! LVL ${newLevel}`, { style: { background: THEME.gold, color: '#000' } });
    }
  }, [xp, level]);

  const speakNative = () => {
    const utterance = new SpeechSynthesisUtterance(currentPhrase.english);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const playMyVoice = () => {
    if (audioUrl) new Audio(audioUrl).play();
    else toast.error("Graba tu voz primero");
  };

  const nextPhrase = () => {
    const idx = FRASES_BASE.findIndex(f => f.english === currentPhrase.english);
    setCurrentPhrase(FRASES_BASE[(idx + 1) % FRASES_BASE.length]);
    setFeedback('');
    setAudioUrl(null);
  };

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Usa Chrome/Edge");

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
    } catch (err) { toast.error("Permite el micro"); }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setFeedback('Listening...'); };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase().replace(/[?.!,]/g, "");
      const original = currentPhrase.english.toLowerCase().replace(/[?.!,]/g, "");
      setIsListening(false);
      mediaRecorderRef.current.stop();

      if (text === original) {
        setFeedback('✅ PERFECT!');
        setXp(prev => prev + 10);
      } else {
        setFeedback('❌ TRY AGAIN');
        setXp(prev => prev + 2);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: THEME.bg, color: THEME.text, padding: '20px', fontFamily: 'system-ui', maxWidth: '450px', margin: 'auto' }}>
      <Toaster />
      
      {/* HEADER NIVEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', background: THEME.panel, borderRadius: '15px', border: `1px solid ${THEME.border}` }}>
        <div><small style={{color: THEME.gold}}>LEVEL {level}</small><div style={{fontWeight: 'bold'}}>{xp} XP</div></div>
        <div style={{textAlign: 'right'}}><small style={{color: THEME.primary}}>CATEGORY</small><div style={{fontWeight: 'bold'}}>{currentPhrase.category.toUpperCase()}</div></div>
      </div>

      {/* TARJETA PRINCIPAL */}
      <div style={{ background: THEME.panel, borderRadius: '24px', overflow: 'hidden', border: `1px solid ${THEME.border}`, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
        <img key={currentPhrase.imageUrl} src={currentPhrase.imageUrl} style={{ width: '100%', height: '220px', objectFit: 'cover' }} alt="Scene" />
        <div style={{ padding: '25px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '24px', margin: 0 }}>{currentPhrase.english}</h2>
            <button onClick={speakNative} style={{ background: THEME.primary, border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'white' }}>🔊</button>
          </div>
          <div style={{ fontWeight: 'bold', height: '24px', color: feedback.includes('✅') ? THEME.success : THEME.error }}>{feedback}</div>
        </div>
      </div>

      {/* BOTONES ACCIÓN */}
      <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={startListening} style={{ padding: '20px', borderRadius: '16px', border: 'none', backgroundColor: isListening ? THEME.error : THEME.success, color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
          {isListening ? '🛑 LISTENING...' : '🎙️ TALK NOW'}
        </button>

        <button onClick={playMyVoice} style={{ padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: audioUrl ? THEME.secondary : '#475569', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: audioUrl ? 1 : 0.5 }}>
          🎧 REPLAY MY VOICE
        </button>

        <button onClick={nextPhrase} style={{ padding: '14px', borderRadius: '16px', border: `1px solid ${THEME.border}`, background: 'transparent', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}>
          NEXT PHRASE ➡️
        </button>
      </div>

      {/* BARRA PROGRESO */}
      <div style={{ marginTop: '30px', height: '8px', background: THEME.panel, borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${(xp % 50) * 2}%`, height: '100%', background: THEME.primary, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}
