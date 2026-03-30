import React, { useState } from 'react';

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
  { eng: "A ticket to London, please.", cat: "TRAVEL", icon: "🎫", color: "#06b6d4" },
  { eng: "The check, please.", cat: "RESTAURANT", icon: "🧾", color: "#64748b" },
  { eng: "Can I have a glass of water?", cat: "RESTAURANT", icon: "🥛", color: "#64748b" },
  { eng: "I lost my passport.", cat: "EMERGENCY", icon: "📕", color: "#ef4444" },
  { eng: "Call an ambulance, please!", cat: "EMERGENCY", icon: "🚑", color: "#ef4444" },
  { eng: "Nice to meet you!", cat: "GREETINGS", icon: "👋", color: "#a855f7" },
  { eng: "See you later, alligator!", cat: "GREETINGS", icon: "🐊", color: "#a855f7" }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const current = FRASES[index];

  const next = () => setIndex((index + 1) % FRASES.length);

  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  return (
    <div style={{ backgroundColor: current.color, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px', transition: 'all 0.5s' }}>
      <div style={{ fontSize: '100px', marginBottom: '20px' }}>{current.icon}</div>
      <h2 style={{ fontSize: '24px', opacity: 0.8, marginBottom: '10px' }}>{current.cat}</h2>
      <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '20px' }}>{current.eng}</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => speak(current.eng)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '10px 20px', fontSize: '16px', borderRadius: '50px', cursor: 'pointer' }}>
          Escuchar 🔊
        </button>
        
        <button onClick={next} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          SIGUIENTE FRASE
        </button>
      </div>
    </div>
  );
}
