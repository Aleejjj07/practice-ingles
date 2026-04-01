import React, { useState, useRef } from 'react';

const FRASES = [
  { eng: "Nice to meet you!", cat: "GREETINGS", icon: "👋", color: "#a855f7", lvl: 1 },
  { eng: "The check, please.", cat: "RESTAURANT", icon: "🧾", color: "#64748b", lvl: 1 },
  { eng: "I need backup, help me!", cat: "GAMING", icon: "🎮", color: "#8b5cf6", lvl: 2 },
  { eng: "Where is the nearest bathroom?", cat: "TRAVEL", icon: "🚻", color: "#06b6d4", lvl: 2 },
  { eng: "The lag is unbearable today.", cat: "GAMING", icon: "🌐", color: "#8b5cf6", lvl: 3 },
  { eng: "I lost my passport, help!", cat: "EMERGENCY", icon: "📕", color: "#ef4444", lvl: 3 },
  { eng: "Could you tell me the departure gate?", cat: "TRAVEL", icon: "✈️", color: "#06b6d4", lvl: 4 },
  { eng: "Call an ambulance, it is an emergency!", cat: "EMERGENCY", icon: "🚑", color: "#ef4444", lvl: 5 }
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
  };

  // --- FUNCIÓN KARAOKE ---
  const speakKaraoke = () => {
    window.speechSynthesis.cancel(); // Parar si ya estaba hablando
    const utterance = new SpeechSynthesisUtterance(current.eng);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Un pelín más lento para que se note

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Calculamos qué palabra toca iluminar
        const textBefore = current.eng.substring(0, event.charIndex);
        const wordCount = textBefore.split(" ").filter(x => x.length > 0).length;
        setHighlightIndex(wordCount);
      }
    };

    utterance.onend = () => setHighlightIndex(-1);
    window.speechSynthesis.speak(utterance);
  };

  // --- RESTO DE FUNCIONES (MICRO Y GRABACIÓN) ---
  const playMyVoice = () => userAudio && new Audio(userAudio).play();

  const startListening = async () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Usa Chrome");
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
    } catch (err) { alert("Error micro"); }
  };

  return (
    <div style={{ backgroundColor: current.color, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px', transition: 'all 0.5s' }}>
      
      {/* NIVELES */}
      <div style={{ position: 'absolute', top: '20px', display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => {setLevel(n); setIndex(0); setFeedback(''); setUserAudio(null);}} style={{ backgroundColor: level === n ? 'white' : 'rgba(255,255,255,0.2)', color: level === n ? 'black' : 'white', border: 'none', width: '35px', height: '35px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{n}</button>
        ))}
      </div>

      <div style={{ fontSize: '60px', marginBottom: '10px' }}>{current.icon}</div>
      <h2 style={{ fontSize: '16px', opacity: 0.7, marginBottom: '10px' }}>NIVEL {level} • {current.cat}</h2>
      
      {/* TEXTO MODO KARAOKE */}
      <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '30px', lineHeight: '1.4' }}>
        {words.map((word, i) => (
          <span key={i} style={{ 
            color: i === highlightIndex ? '#facc15' : 'white', // Amarillo si es la palabra actual
            transition: 'color 0.1s',
            marginRight: '8px',
            textShadow: i === highlightIndex ? '0 0 10px rgba(250,204,21,0.5)' : 'none'
          }}>
            {word}
          </span>
        ))}
      </div>
      
      <div style={{ height: '30px', marginBottom: '20px' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{feedback}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        <button onClick={speakKaraoke} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '10px 20px', fontSize: '14px', borderRadius: '50px', cursor: 'pointer' }}>
          Oír Nativo 🔊
        </button>

        <button onClick={startListening} disabled={listening} style={{ backgroundColor: listening ? '#ef4444' : 'white', color: listening ? 'white' : 'black', border: 'none', padding: '15px 25px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}>
          {listening ? '🔴 Grabando...' : 'Hablar 🎤'}
        </button>

        {userAudio && (
          <button onClick={playMyVoice} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 20px', fontSize: '14px', borderRadius: '50px', cursor: 'pointer' }}>
            Oír mi voz 🔁
          </button>
        )}

        <button onClick={next} style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', padding: '15px 25px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}>
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}
