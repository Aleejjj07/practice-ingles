import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti'; // Librería para la animación

const FRASES_BASE = [
  { english: "I need backup, help me!", category: "gaming", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600" },
  { english: "Don't forget to like and subscribe.", category: "social", imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600" },
  { english: "The lag is unbearable today.", category: "gaming", imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba326b?q=80&w=600" },
  { english: "Where is the nearest bathroom?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1581403664797-e751853d49f6?q=80&w=600" },
  { english: "I am looking for the train station.", category: "travel", imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=600" },
  { english: "What time is my flight?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=600" },
  { english: "Can you help me with my bags?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=600" },
  { english: "Can I have a glass of water, please?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=600" },
  { english: "What do you recommend from the menu?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1550966841-3ee7101157e7?q=80&w=600" },
  { english: "The check, please.", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1556742049-04ff43617161?q=80&w=600" },
  { english: "How much does this cost?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=600" },
  { english: "Do you have this in a smaller size?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600" },
  { english: "Can I pay with credit card?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1556742563-801685a7329b?q=80&w=600" },
  { english: "Nice to meet you, what's your name?", category: "greetings", imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600" },
  { english: "Could you speak more slowly, please?", category: "help", imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=600" },
  { english: "I need help, call an ambulance.", category: "emergency", imageUrl: "https://images.unsplash.com/photo-1587740896339-382a88e9988b?q=80&w=600" },
  { english: "I am late for the meeting.", category: "work", imageUrl: "https://images.unsplash.com/photo-1506784926709-22f1ec395907?q=80&w=600" },
  { english: "I lost my passport.", category: "emergency", imageUrl: "https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=600" },
  { english: "I am allergic to peanuts.", category: "health", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600" }
];

const THEME = {
  bg: '#121927', panel: '#1f2937', text: '#f3f4f6', primary: '#38bdf8', success: '#10b981', error: '#ef4444', border: '#374151', gold: '#fbbf24', secondary: '#8b5cf6'
};

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);
  const [feedback, setFeedback] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Lógica de Subida de Nivel con Animación
  useEffect(() => {
    const newLevel = Math.floor(xp / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      
      // LANZAR CONFETI 🎉
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [THEME.primary, THEME.gold, THEME.success]
      });

      // SONIDO DE VICTORIA (TTS como efecto)
      const msg = new SpeechSynthesisUtterance("Level Up!");
      msg.pitch = 1.5;
      window.speechSynthesis.speak(msg);

      toast.success(`LEVEL UP! Now you are Level ${newLevel}`, {
        icon: '🆙',
        duration: 4000,
        style: { background: THEME.gold, color: '#000', fontWeight: 'bold' }
      });
    }
  }, [xp, level]);

  const speakNative = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const playMyVoice = () => {
    if (audioUrl) new Audio(audioUrl).play();
    else toast("Record first!", { icon: '🎙️' });
  };

  const comparePhrases = (original, spoken) => {
    const clean = (text) => text.toLowerCase().replace(/[?.!,]/g, "").trim();
    if (clean(original) === clean(spoken)) {
      setFeedback(`✅ Perfect! +10 XP`);
      setXp(prev => prev + 10);
    } else {
      setFeedback(`❌ Try again! +2 XP`);
      setXp(prev => prev + 2);
    }
  };

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Use Chrome.");
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
    } catch (err) { console.error(err); }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setFeedback('Listening...'); setAudioUrl(null); };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscribedText(text);
      setIsListening(false);
      mediaRecorderRef.current.stop();
      comparePhrases(currentPhrase.english, text);
    };
    recognition.onerror = () => { setIsListening(false); mediaRecorderRef.current?.stop(); };
    recognition.start();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: THEME.bg, color: THEME.text, padding: '15px', fontFamily: 'sans-serif', maxWidth: '450px', margin: 'auto' }}>
      <Toaster position="top-center" />
      
      {/* HUD SUPERIOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', background: THEME.panel, padding: '15px', borderRadius: '15px', marginBottom: '15px', border: `1px solid ${THEME.border}` }}>
        <div>
          <div style={{fontSize: '10px', color: THEME.gold, fontWeight: 'bold'}}>LEVEL {level}</div>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>{xp} XP</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '10px', color: THEME.primary}}>CATEGORY</div>
          <div style={{fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase'}}>{currentPhrase.category}</div>
        </div>
      </div>

      <div style={{ background: THEME.panel, borderRadius: '25px', overflow: 'hidden', border: `1px solid ${THEME.border}`, marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <img src={currentPhrase.imageUrl} style={{ width: '100%', height: '220px', objectFit: 'cover' }} alt="Scene" />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', margin: 0 }}>{currentPhrase.english}</h2>
            <button onClick={() => speakNative(currentPhrase.english)} style={{ background: 'rgba(56, 189, 248, 0.1)', border: 'none', cursor: 'pointer', fontSize: '20px', borderRadius: '50%', padding: '8px' }}>🔊</button>
          </div>
          <p style={{ color: feedback.includes('✅') ? THEME.success : THEME.error, marginTop: '15px', fontWeight: 'bold' }}>{feedback}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <button onClick={startListening} style={{ padding: '18px', borderRadius: '15px', border: 'none', backgroundColor: isListening ? THEME.error : THEME.success, color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          {isListening ? '🛑 LISTENING...' : '🎙️ TALK NOW'}
        </button>

        <button 
          onClick={playMyVoice} 
          style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: audioUrl ? THEME.secondary : '#4b5563', color: 'white', fontWeight: 'bold', cursor: audioUrl ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: audioUrl ? 1 : 0.6 }}
        >
          🎧 REPLAY MY VOICE
        </button>

        <button 
          onClick={() => { setCurrentPhrase(FRASES_BASE[(FRASES_BASE.findIndex(f => f.english === currentPhrase.english) + 1) % FRASES_BASE.length]); setFeedback(''); setAudioUrl(null); setTranscribedText(''); }} 
          style={{ padding: '12px', borderRadius: '15px', border: `1px solid ${THEME.border}`, backgroundColor: 'transparent', color: '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}
        >
          NEXT PHRASE ➡️
        </button>
      </div>

      <div style={{ width: '100%', height: '6px', background: '#374151', borderRadius: '3px', marginTop: '20px', overflow: 'hidden' }}>
        <div style={{ width: `${(xp % 50) * 2}%`, height: '100%', background: THEME.primary, transition: 'width 0.4s' }}></div>
      </div>
    </div>
  );
}
