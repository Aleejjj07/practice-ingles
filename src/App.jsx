import React, { useState, useRef } from 'react';

const FRASES = [
  { eng: "I need backup, help me!", cat: "GAMING", icon: "🎮", color: "#8b5cf6" },
  { eng: "What time is my flight?", cat: "TRAVEL", icon: "✈️", color: "#06b6d4" },
  { eng: "The check, please.", cat: "RESTAURANT", icon: "🧾", color: "#64748b" },
  { eng: "I lost my passport.", cat: "EMERGENCY", icon: "📕", color: "#ef4444" }
];

export default function App() {
  const [idx, setIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const item = FRASES[idx];

  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  const startListen = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Usa Chrome");
    const rec = new Speech();
    rec.lang = 'en-US';
    rec.onstart = () => { setIsListening(true); setFeedback('Listening...'); };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase().trim();
      setIsListening(false);
      if (text.includes(item.eng.toLowerCase().replace(/[?!.,]/g, ""))) {
        setFeedback('✅ PERFECT!');
      } else {
        setFeedback('❌ TRY AGAIN');
      }
    };
    rec.onerror = () => setIsListening(false);
    rec.start();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', background: '#1e293b', padding: '15px', borderRadius: '15px' }}>
        <span>Nivel 1</span>
        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{item.cat}</span>
      </div>

      {/* Tarjeta con Icono (Sustituye a la imagen que fallaba) */}
      <div style={{ width: '100%', maxWidth: '400px', background: '#1e293b', borderRadius: '25px', overflow: 'hidden', textAlign: 'center', border: '1px solid #334155' }}>
        <div style={{ height: '150px', background: item.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
          {item.icon}
        </div>
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '22px' }}>{item.eng}</h2>
          <button onClick={() => speak(item.eng)} style={{ background: 'none', border: '1px solid #38bdf8', color: '#38bdf8', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>🔊 Escuchar</button>
          <p style={{ fontWeight: 'bold', marginTop: '15px', color: feedback.includes('✅') ? '#10b981' : '#f43f5e' }}>{feedback}</p>
        </div>
      </div>

      {/* Botones */}
      <div style={{ width: '100%', maxWidth: '400px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={startListen} style={{ padding: '20px', borderRadius: '15px', border: 'none', background: isListening ? '#f43f5e' : '#10b981', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
          {isListening ? '🛑 ESCUCHANDO...' : '🎙️ HABLAR AHORA'}
        </button>
        <button onClick={() => {setIdx((idx + 1) % FRASES.length); setFeedback('');}} style={{ padding: '12px', borderRadius: '15px', background: 'none', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer' }}>
          SIGUIENTE FRASE ➡️
        </button>
      </div>

    </div>
  );
}
