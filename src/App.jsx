import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const FRASES_BASE = [
  { english: "I need backup, help me!", category: "gaming", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { english: "Don't forget to like and subscribe.", category: "social", imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80" },
  { english: "The lag is unbearable today.", category: "gaming", imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba326b?auto=format&fit=crop&w=600&q=80" },
  { english: "Where is the nearest bathroom?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1581403664797-e751853d49f6?auto=format&fit=crop&w=600&q=80" },
  { english: "I am looking for the train station.", category: "travel", imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80" },
  { english: "What time is my flight?", category: "travel", imageUrl: "https://plus.unsplash.com/premium_photo-1679758630041-63d2ff6a0518?auto=format&fit=crop&w=600&q=80" },
  { english: "Can you help me with my bags?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1627931446702-86ff54c6020c?auto=format&fit=crop&w=600&q=80" },
  { english: "Can I have a glass of water, please?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1516248911578-f7efdf7a5f6e?auto=format&fit=crop&w=600&q=80" },
  { english: "What do you recommend from the menu?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80" },
  { english: "The check, please.", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80" },
  { english: "How much does this cost?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80" },
  { english: "Do you have this in a smaller size?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" },
  { english: "Can I pay with credit card?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1563013544-824ae14f4026?auto=format&fit=crop&w=600&q=80" },
  { english: "Nice to meet you, what's your name?", category: "greetings", imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80" },
  { english: "Could you speak more slowly, please?", category: "help", imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=600&q=80" },
  { english: "I need help, call an ambulance.", category: "emergency", imageUrl: "https://images.unsplash.com/photo-1587740896339-382a88e9988b?auto=format&fit=crop&w=600&q=80" },
  { english: "I am late for the meeting.", category: "work", imageUrl: "https://images.unsplash.com/photo-1506784926709-22f1ec395907?auto=format&fit=crop&w=600&q=80" },
  { english: "I lost my passport.", category: "emergency", imageUrl: "https://images.unsplash.com/photo-1544033527-b192daee1f5b?auto=format&fit=crop&w=600&q=80" },
  { english: "I am allergic to peanuts.", category: "health", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80" }
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
  const [imgError, setImgError] = useState(false); // Nuevo: control de error de imagen

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const newLevel = Math.floor(xp / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      const msg = new SpeechSynthesisUtterance("Level Up!");
      window.speechSynthesis.speak(msg);
      toast.success(`LEVEL UP! Now Level ${newLevel}`, { icon: '🆙' });
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

  const nextPhrase = () => {
    const currentIndex = FRASES_BASE.findIndex(f => f.english === currentPhrase.english);
    const nextIndex = (currentIndex + 1) % FRASES_BASE.length;
    setCurrentPhrase(FRASES_BASE[nextIndex]);
    setImgError(false); // Resetear error al cambiar
    setFeedback('');
    setAudioUrl(null);
    setTranscribedText('');
  };

  const comparePhrases = (original, spoken) => {
    const clean = (text) => text.toLowerCase().replace(/[?.!,]/g, "").trim();
    if (clean(original) === clean(spoken)) {
      setFeedback(`✅ Perfect! +10 XP`);
      setXp(prev => prev + 10);
    } else {
      setFeedback(`❌ Keep practicing! +2 XP`);
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
        <div style={{ width: '100%', height: '220px', backgroundColor: '#2d3748', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!imgError ? (
                <img 
                    src={currentPhrase.imageUrl} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt="Context" 
                    onError={() => setImgError(true)}
                    key={currentPhrase.imageUrl} 
                />
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <span style={{ fontSize: '50px' }}>
                        {currentPhrase.category === 'travel' ? '✈️' : 
                         currentPhrase.category === 'gaming' ? '🎮' : 
                         currentPhrase.category === 'restaurant' ? '🍕' : '📱'}
                    </span>
                    <p style={{ color: '#718096', fontSize: '12px', marginTop: '10px' }}>Visualizing {currentPhrase.category}...</p>
                </div>
            )}
        </div>
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
          onClick={nextPhrase} 
          style={{ padding: '12px', borderRadius: '15px', border: `1px solid ${THEME.border}`, backgroundColor: 'transparent', color: '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}
        >
          NEXT PHRASE ➡️
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <div style={{ width: '100%', height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${(xp % 50) * 2}%`, height: '100%', background: THEME.primary, transition: 'width 0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
