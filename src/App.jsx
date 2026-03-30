import React, { useState, useEffect } from 'react';

const FRASES = [
  { eng: "I need backup, help me!", cat: "GAMING", icon: "🎮", color: "#8b5cf6" },
  { eng: "The lag is unbearable today.", cat: "GAMING", icon: "🌐", color: "#8b5cf6" },
  { eng: "Enemy spotted on the right!", cat: "GAMING", icon: "🎯", color: "#8b5cf6" },
  { eng: "Good game, well played everyone.", cat: "GAMING", icon: "🏆", color: "#8b5cf6" },
  { eng: "Can I borrow your pen, please?", cat: "SCHOOL", icon: "✏️", color: "#f59e0b" },
  { eng: "I don't understand this exercise.", cat: "SCHOOL", icon: "📚", color: "#f59e0b" },
  { eng: "Teacher, I have a question.", cat: "SCHOOL", icon: "🙋‍♂️", color: "#f59e0b" },
  { eng: "What time is my flight?", cat: "TRAVEL", icon: "✈️", color: "#06b6d4" },
  { eng: "Where is the nearest bathroom?", cat: "TRAVEL", icon: "🚻", color: "#06b6d4" },
  { eng: "The check, please.", cat: "RESTAURANT", icon: "🧾", color: "#64748b" },
  { eng: "I lost my passport.", cat: "EMERGENCY", icon: "📕", color: "#ef4444" },
  { eng: "Call an ambulance, please!", cat: "EMERGENCY", icon: "🚑", color: "#ef4444" },
  { eng: "Nice to meet you!", cat: "GREETINGS", icon: "👋", color: "#a855f7" },
  { eng: "See you later, alligator!", cat: "GREETINGS", icon: "🐊", color: "#a855f7" }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const current = FRASES[index];

  const next = () => {
    setIndex((index + 1) % FRASES.length);
    setFeedback('');
  };

  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  const listen = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Por favor, usa Google Chrome para esta función.");

    const recognition = new Speech();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setListening(true);
      setFeedback('Escuchando...');
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript.toLowerCase();
      const originalText = current.eng.toLowerCase().replace(/[.,!]/g, "");
      
      if (speechToText.includes(originalText) || originalText.includes(speechToText)) {
        setFeedback('¡Perfecto! ✅');
      } else {
        setFeedback(`Dijiste: "${speechToText}" ❌`);
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setFeedback('Error al escuchar.');
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <div style={{ backgroundColor: current.color, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px', transition: 'all 0.5s' }}>
      <div style={{ fontSize: '80px', marginBottom: '10px' }}>{current.icon}</div>
      <h2 style={{ fontSize: '20px', opacity: 0.8, marginBottom: '5px' }}>{current.cat}</h2>
      <h1 style={{ fontSize: '35px', fontWeight: 'bold', marginBottom: '10px' }}>{current.eng}</h1>
      
      <p style={{ fontSize: '24px', fontWeight: 'bold', height: '30px', marginBottom: '30px', color: feedback === '¡Perfecto! ✅' ? '#4ade80' : 'white' }}>
        {feedback}
      </p>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => speak(current.eng)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '12px 25px', fontSize: '16px', borderRadius: '50px', cursor: 'pointer' }}>
          Oír 🔊
        </button>

        <button onClick={listen} style={{ backgroundColor: listening ? '#ff4b4b' : 'white', color: listening ? 'white' : 'black', border: 'none', padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          {listening ? '🔴 Habla ahora...' : 'Hablar 🎤'}
        </button>
        
        <button onClick={next} style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}>
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}
