import React, { useState, useRef } from 'react';

// --- FRASES ACTUALIZADAS (Más largas para que se vea el efecto) ---
const FRASES = [
  // NIVEL 1 - Básico (Ahora con frases más completas)
  { eng: "Hello, it is very nice to meet you!", cat: "GREETINGS", icon: "👋", color: "#a855f7", lvl: 1 },
  { eng: "Can I have the check, please?", cat: "RESTAURANT", icon: "🧾", color: "#64748b", lvl: 1 },
  { eng: "I would like a ticket to London.", cat: "TRAVEL", icon: "🎫", color: "#06b6d4", lvl: 1 },
  { eng: "Can I borrow your blue pen, please?", cat: "SCHOOL", icon: "✏️", color: "#f59e0b", lvl: 1 },
  
  // NIVEL 2
  { eng: "I need backup, please help me now!", cat: "GAMING", icon: "🎮", color: "#8b5cf6", lvl: 2 },
  { eng: "Where is the nearest bathroom in here?", cat: "TRAVEL", icon: "🚻", color: "#06b6d4", lvl: 2 },
  { eng: "I would like to eat a big burger.", cat: "RESTAURANT", icon: "🍔", color: "#64748b", lvl: 2 },
  { eng: "See you later, my friend the alligator!", cat: "GREETINGS", icon: "🐊", color: "#a855f7", lvl: 2 },

  // NIVEL 3
  { eng: "The lag is absolutely unbearable today.", cat: "GAMING", icon: "🌐", color: "#8b5cf6", lvl: 3 },
  { eng: "I do not understand this math exercise.", cat: "SCHOOL", icon: "📚", color: "#f59e0b", lvl: 3 },
  { eng: "I lost my passport, I need help!", cat: "EMERGENCY", icon: "📕", color: "#ef4444", lvl: 3 },

  // NIVEL 4
  { eng: "Could you tell me the departure gate, please?", cat: "TRAVEL", icon: "✈️", color: "#06b6d4", lvl: 4 },
  { eng: "Enemy spotted on the right flank of the map!", cat: "GAMING", icon: "🎯", color: "#8b5cf6", lvl: 4 },
  { eng: "Teacher, I have a very important question.", cat: "SCHOOL", icon: "🙋‍♂️", color: "#f59e0b", lvl: 4 },

  // NIVEL 5
  { eng: "Call an ambulance quickly, it is an emergency!", cat: "EMERGENCY", icon: "🚑", color: "#ef4444", lvl: 5 },
  { eng: "I would like to book a table for four people.", cat: "RESTAURANT", icon: "🍽️", color: "#64748b", lvl: 5 },
  { eng: "Good game, well played everyone, see you next time!", cat: "GAMING", icon: "🏆", color: "#8b5cf6", lvl: 5 }
];

export default function App() {
  const [level, setLevel] = useState(1);
  const [index, setIndex] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [userAudio, setUserAudio] = useState(null);
  const mediaRecorderRef = useRef(null);

  const frasesFiltradas = FRASES.filter(f => f.lvl === level);
  const current = frasesFiltradas[index] || frasesFiltradas[0];
  const words = current.eng.split(" ");

  const next = () => {
    setIndex((index + 1) % frasesFiltradas.length);
    setFeedback('');
    setUserAudio(null);
    setHighlightIndex(-1);
    window.speechSynthesis.cancel();
  };

  const speakKaraoke = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.eng);
    utterance.lang = 'en-US';
    // VELOCIDAD LENTA PARA VER EL AMARILLO
    utterance.rate = 0.6; 

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const textBefore = current.eng.substring(0, event.charIndex);
        const wordCount = textBefore.split(" ").filter(x => x.length > 0).length;
        setHighlightIndex(wordCount);
      }
    };

    utterance.onend = () => setHighlightIndex(-1);
    window.speechSynthesis.speak(utterance);
  };

  const playMyVoice = () => userAudio && new Audio(userAudio).play();

  const startListening = async () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Usa Google Chrome");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      let chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setUserAudio(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      const rec = new Speech();
      rec.lang = 'en-US';
      rec.onstart = () => { setListening(true); setFeedback('Escuchando...'); mediaRecorderRef.current.start(); };
      rec.onresult = (e) => {
        const res = e.results[0][0].transcript.toLowerCase();
        const orig = current.eng.toLowerCase().replace(/[.,!?]/g, "");
        setFeedback(res.includes(orig) || orig.includes(res) ? '¡Perfecto! ✅' : `Dijiste: "${res}" ❌`);
      };
      rec.onend = () => { setListening(false); if(mediaRecorderRef.current.state!=="inactive") mediaRecorderRef.current.stop(); };
      rec.start();
    } catch (err) { alert("Permite el micro"); }
  };

  return (
    <div style={{ backgroundColor: current.color, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px', transition: 'all 0.5s' }}>
      
      {/* BOTONES DE NIVEL */}
      <div style={{ position: 'absolute', top: '20px', display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => {setLevel(n); setIndex(0); setFeedback(''); setUserAudio(null);}} 
            style={{ backgroundColor: level === n ? 'white' : 'rgba(255,255,255,0.2)', color: level === n ? 'black' : 'white', border: 'none', width: '40px', height: '40px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            {n}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '80px', marginBottom: '10px' }}>{current.icon}</div>
      <h2 style={{ fontSize: '18px', opacity: 0.7, marginBottom: '10px' }}>NIVEL {level} • {current.cat}</h2>
      
      {/* TEXTO KARAOKE */}
      <div style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '30px', maxWidth: '800px', lineHeight: '1.4' }}>
        {words.map((word, i) => (
          <span key={i} style={{ 
            color: i === highlightIndex ? '#facc15' : 'white', 
            transition: 'color 0.2s',
            marginRight: '12px',
            display: 'inline-block',
            textShadow: i === highlightIndex ? '0 0 15px rgba(250,204,21,0.8)' : 'none'
          }}>
            {word}
          </span>
        ))}
      </div>
      
      <div style={{ height: '40px', marginBottom: '20px' }}>
        <p style={{ fontSize: '22px', fontWeight: 'bold' }}>{feedback}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
        <button onClick={speakKaraoke} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '12px 25px', fontSize: '16px', borderRadius: '50px', cursor: 'pointer' }}>
          Oír Nativo 🔊
        </button>

        <button onClick={startListening} disabled={listening} style={{ backgroundColor: listening ? '#ef4444' : 'white', color: listening ? 'white' : 'black', border: 'none', padding: '18px 35px', fontSize: '20px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          {listening ? '🔴 Grabando...' : 'Hablar 🎤'}
        </button>

        {userAudio && (
          <button onClick={playMyVoice} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '12px 25px', fontSize: '16px', borderRadius: '50px', cursor: 'pointer' }}>
            Oír mi voz 🔁
          </button>
        )}

        <button onClick={next} style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', padding: '18px 35px', fontSize: '20px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}>
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}
