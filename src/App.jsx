import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const FRASES_BASE = [
  { english: "Where is the nearest bathroom?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1581403664797-e751853d49f6?q=80&w=600" },
  { english: "I am looking for the train station.", category: "travel", imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=600" },
  { english: "What time is my flight?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600" },
  { english: "Can you help me with my bags?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1627931446702-86ff54c6020c?q=80&w=600" },
  { english: "Can I have a glass of water, please?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1516248911578-f7efdf7a5f6e?q=80&w=600" },
  { english: "What do you recommend from the menu?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1549419137-b499119565eb?q=80&w=600" },
  { english: "The check, please.", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1587820121703-a17f225330a5?q=80&w=600" },
  { english: "How much does this cost?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600" },
  { english: "Do you have this in a smaller size?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600" },
  { english: "Can I pay with credit card?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1563013544-824ae14f4026?q=80&w=600" },
  { english: "Nice to meet you, what's your name?", category: "greetings", imageUrl: "https://images.unsplash.com/photo-1520333781090-e29497e8081f?q=80&w=600" }
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

  const speakNative = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const playMyVoice = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      toast("Graba primero para escucharte", { icon: '🎙️' });
    }
  };

  const comparePhrases = (original, spoken) => {
    const clean = (text) => text.toLowerCase().replace(/[?.!,]/g, "").trim().split(/\s+/);
    const origWords = clean(original);
    const spokWords = clean(spoken);
    let missingWords = origWords.filter(word => !spokWords.includes(word));

    if (missingWords.length === 0) {
      setFeedback(`✅ Perfect! +10 XP`);
      setXp(prev => prev + 10);
      toast.success("Perfect! +10 XP");
    } else {
      setFeedback(`❌ Missed: ${missingWords.join(", ")} | +2 XP`);
      setXp(prev => prev + 2);
    }
  };

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Usa Chrome o Edge.");

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
    } catch (err) { console.error("Mic error:", err); }

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
      
      {/* HUD DE PUNTOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', background: THEME.panel, padding: '15px', borderRadius: '15px', marginBottom: '15px', border: `1px solid ${THEME.border}` }}>
        <div>
          <div style={{fontSize: '10px', color: THEME.gold, fontWeight: 'bold'}}>LEVEL {Math.floor(xp / 50) + 1}</div>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>{xp} XP</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '10px', color: THEME.primary}}>CATEGORY</div>
          <div style={{fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase'}}>{currentPhrase.category}</div>
        </div>
      </div>

      {/* TARJETA DE ESTUDIO */}
      <div style={{ background: THEME.panel, borderRadius: '25px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: `1px solid ${THEME.border}`, marginBottom: '20px' }}>
        <img src={currentPhrase.imageUrl} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="Visual Context" />
        <div style={{ padding: '25px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '26px', margin: 0, fontWeight: '800' }}>{currentPhrase.english}</h2>
            <button onClick={() => speakNative(currentPhrase.english)} style={{ background: 'rgba(56, 189, 248, 0.1)', border: 'none', cursor: 'pointer', fontSize: '24px', borderRadius: '50%', padding: '10px', display: 'flex' }}>🔊</button>
          </div>
          <p style={{ color: feedback.includes('✅') ? THEME.success : THEME.error, marginTop: '20px', fontWeight: 'bold', fontSize: '18px' }}>{feedback}</p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN (SIEMPRE VISIBLES) */}
      <div style={{ display: 'grid', gap: '12px' }}>
        <button 
          onClick={startListening} 
          style={{ padding: '20px', borderRadius: '16px', border: 'none', backgroundColor: isListening ? THEME.error : THEME.success, color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', transition: '0.3s' }}
        >
          {isListening ? '🛑 LISTENING...' : '🎙️ TALK NOW'}
        </button>

        <button 
          onClick={playMyVoice} 
          style={{ 
            padding: '18px', 
            borderRadius: '16px', 
            border: 'none', 
            backgroundColor: audioUrl ? THEME.secondary : '#4b5563', 
            color: 'white', 
            fontWeight: 'bold', 
            cursor: audioUrl ? 'pointer' : 'not-allowed', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            opacity: audioUrl ? 1 : 0.6
          }}
        > 
          🎧 REPLAY MY VOICE
        </button>

        <button 
          onClick={() => { setCurrentPhrase(FRASES_BASE[(FRASES_BASE.findIndex(f => f.english === currentPhrase.english) + 1) % FRASES_BASE.length]); setFeedback(''); setAudioUrl(null); setTranscribedText(''); }} 
          style={{ padding: '15px', borderRadius: '16px', border: `2px solid ${THEME.border}`, backgroundColor: 'transparent', color: THEME.textMuted, fontWeight: 'bold', cursor: 'pointer' }}
        >
          NEXT PHRASE ➡️
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', minHeight: '30px' }}>
        {transcribedText && <p style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>You said: "{transcribedText}"</p>}
      </div>
    </div>
  );
}
