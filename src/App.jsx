import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const FRASES_BASE = [
  { english: "Where is the nearest bathroom?", category: "travel" },
  { english: "I am looking for the train station.", category: "travel" },
  { english: "What time is my flight?", category: "travel" },
  { english: "Can you help me with my bags?", category: "travel" },
  { english: "Can I have a glass of water, please?", category: "restaurant" },
  { english: "What do you recommend from the menu?", category: "restaurant" },
  { english: "The check, please.", category: "restaurant" },
  { english: "I have a reservation for tonight.", category: "restaurant" },
  { english: "How much does this cost?", category: "shopping" },
  { english: "Do you have this in a smaller size?", category: "shopping" },
  { english: "Can I pay with credit card?", category: "shopping" },
  { english: "Nice to meet you, what's your name?", category: "greetings" },
  { english: "How do you spell that?", category: "help" },
  { english: "Could you speak more slowly, please?", category: "help" },
  { english: "I don't understand, can you repeat?", category: "help" },
  { english: "What do you do for a living?", category: "work" },
  { english: "I am late for the meeting.", category: "work" },
  { english: "I need help, call an ambulance.", category: "emergency" },
  { english: "I lost my passport.", category: "emergency" },
  { english: "I am allergic to peanuts.", category: "health" }
];

const THEME = {
  bg: '#121927',
  panel: '#1f2937',
  text: '#f3f4f6',
  primary: '#38bdf8',
  success: '#10b981',
  error: '#ef4444',
  border: '#374151',
  gold: '#fbbf24'
};

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);
  const [feedback, setFeedback] = useState('');
  
  // --- SISTEMA DE GAMIFICACIÓN ---
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  // Calcular rango según el nivel
  const getRank = () => {
    if (level < 5) return "🌱 NOOB";
    if (level < 10) return "⚡ RECLUTA";
    if (level < 20) return "😎 INFLUENCER";
    return "🐐 THE G.O.A.T."; // (Greatest Of All Time)
  };
  

  // Subir de nivel cada 50 XP
  useEffect(() => {
    const newLevel = Math.floor(xp / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`LEVEL UP! Now you are Level ${newLevel}`, {
        icon: '🆙',
        style: { background: THEME.gold, color: '#000', fontWeight: 'bold' }
      });
    }
  }, [xp]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const nextPhrase = () => {
    const filtered = FRASES_BASE.filter(f => f.english.toLowerCase().includes(searchQuery.toLowerCase()) || f.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const currentIndex = filtered.findIndex(f => f.english === currentPhrase.english);
    const nextIndex = (currentIndex + 1) % filtered.length;
    setCurrentPhrase(filtered[nextIndex]);
    setFeedback('');
    setTranscribedText('');
  };

  const comparePhrases = (original, spoken) => {
    const clean = (text) => text.toLowerCase().replace(/[?.!,]/g, "").trim().split(/\s+/);
    const origWords = clean(original);
    const spokWords = clean(spoken);
    let missingWords = origWords.filter(word => !spokWords.includes(word));

    if (missingWords.length === 0) {
      setFeedback(`✅ PERFECT! +10 XP`);
      setXp(prev => prev + 10);
      toast.success("Perfect Pronunciation! +10 XP");
    } else {
      setFeedback(`❌ MISSED: ${missingWords.join(", ")} | +2 XP for trying`);
      setXp(prev => prev + 2);
      toast.error("Keep trying! +2 XP");
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Use Chrome");
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setFeedback('Listening...'); };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscribedText(text);
      setIsListening(false);
      comparePhrases(currentPhrase.english, text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: THEME.bg, color: THEME.text, padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <Toaster position="top-center" />
      
      {/* HEADER CON XP Y NIVEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: THEME.panel, padding: '15px', borderRadius: '15px', border: `1px solid ${THEME.border}` }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '12px', color: THEME.gold, fontWeight: 'bold' }}>{getRank()}</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Level {level}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: THEME.primary }}>TOTAL EXPERIENCE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: THEME.primary }}>{xp} XP</div>
        </div>
      </div>

      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>AI English Coach 🎙️</h1>

      <div style={{ background: THEME.panel, padding: '30px', borderRadius: '25px', marginBottom: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
        <span style={{ background: THEME.primary, padding: '4px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
          {currentPhrase.category.toUpperCase()}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
          <h2 style={{ fontSize: '28px', margin: 0 }}>{currentPhrase.english}</h2>
          <button onClick={() => speak(currentPhrase.english)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>🔊</button>
        </div>

        <div style={{ minHeight: '40px', color: feedback.includes('✅') ? THEME.success : THEME.error, fontWeight: 'bold', fontSize: '18px' }}>
          {feedback}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <button onClick={startListening} style={{ flex: 2, padding: '20px', borderRadius: '15px', border: 'none', backgroundColor: isListening ? THEME.error : THEME.success, color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 0 #065f46' }}>
          {isListening ? '🛑 LISTENING...' : '🎙️ TALK NOW'}
        </button>
        <button onClick={nextPhrase} style={{ flex: 1, padding: '20px', borderRadius: '15px', border: 'none', backgroundColor: THEME.panel, color: 'white', fontWeight: 'bold', cursor: 'pointer', border: `1px solid ${THEME.border}` }}>
          NEXT ➡️
        </button>
      </div>

      <p style={{ color: '#6b7280' }}>Progress to next level: {xp % 50} / 50 XP</p>
      <div style={{ width: '100%', height: '10px', background: '#374151', borderRadius: '5px', overflow: 'hidden', marginBottom: '40px' }}>
        <div style={{ width: `${(xp % 50) * 2}%`, height: '100%', background: THEME.primary, transition: 'width 0.3s' }}></div>
      </div>
    </div>
  );
}
