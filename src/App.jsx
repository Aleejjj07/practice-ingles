import React, { useState, useRef } from 'react';

// --- LISTA DE FRASES CON NIVELES (1-5) ---
const FRASES = [
  // NIVEL 1: BÁSICO (Saludos y cortesía)
  { eng: "Nice to meet you!", cat: "GREETINGS", icon: "👋", color: "#a855f7", lvl: 1 },
  { eng: "The check, please.", cat: "RESTAURANT", icon: "🧾", color: "#64748b", lvl: 1 },
  { eng: "Can I borrow your pen?", cat: "SCHOOL", icon: "✏️", color: "#f59e0b", lvl: 1 },
  
  // NIVEL 2: INTERMEDIO BAJO (Necesidades comunes)
  { eng: "I need backup, help me!", cat: "GAMING", icon: "🎮", color: "#8b5cf6", lvl: 2 },
  { eng: "Where is the bathroom?", cat: "TRAVEL", icon: "🚻", color: "#06b6d4", lvl: 2 },
  { eng: "I would like a burger.", cat: "RESTAURANT", icon: "🍔", color: "#64748b", lvl: 2 },

  // NIVEL 3: INTERMEDIO (Frases completas)
  { eng: "The lag is unbearable today.", cat: "GAMING", icon: "🌐", color: "#8b5cf6", lvl: 3 },
  { eng: "I don't understand this exercise.", cat: "SCHOOL", icon: "📚", color: "#f59e0b", lvl: 3 },
  { eng: "I lost my passport, help!", cat: "EMERGENCY", icon: "📕", color: "#ef4444", lvl: 3 },

  // NIVEL 4: AVANZADO (Fluidez)
  { eng: "Could you tell me the departure gate?", cat: "TRAVEL", icon: "✈️", color: "#06b6d4", lvl: 4 },
  { eng: "Enemy spotted on the right flank!", cat: "GAMING", icon: "🎯", color: "#8b5cf6", lvl: 4 },
  { eng: "Have a wonderful day, see you later!", cat: "GREETINGS", icon: "☀️", color: "#a855f7", lvl: 4 },

  // NIVEL 5: EXPERTO (Complejidad alta)
  { eng: "Call an ambulance, it is an emergency!", cat: "EMERGENCY", icon: "🚑", color: "#ef4444", lvl: 5 },
  { eng: "I would like to book a table for four.", cat: "RESTAURANT", icon: "🍽️", color: "#64748b", lvl: 5 },
  { eng: "Teacher, may I go to the restroom, please?", cat: "SCHOOL", icon: "🙋‍♂️", color: "#f59e0b", lvl: 5 }
];

export default function App() {
  const [level, setLevel] = useState(1);
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [userAudio, setUserAudio] = useState(null);
  const mediaRecorderRef = useRef(null);

  // Filtrar frases según el nivel seleccionado
  const frasesFiltradas = FRASES.filter(f => f.lvl === level);
  const current = frasesFiltradas[index] || frasesFiltradas[0];

  const changeLevel = (newLvl) => {
    setLevel(newLvl);
    setIndex(0);
    setFeedback('');
    setUserAudio(null);
  };

  const next = () => {
    setIndex((index + 1) % frasesFiltradas.length);
    setFeedback('');
    setUserAudio(null);
  };

  const speakNative = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  const playMyVoice = () => userAudio && new Audio(userAudio).play();

  const startListeningAndRecording = async () => {
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
        stream.getTracks().forEach(track => track.stop());
      };

      const recognition = new Speech();
      recognition.lang = 'en-US';
      recognition.onstart = () => { setListening(true); setFeedback('Escuchando...'); mediaRecorderRef.current.start(); };
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        const cleanOriginal = current.eng.toLowerCase().replace(/[.,!?]/g, "");
        setFeedback(result.includes(cleanOriginal) || cleanOriginal.includes(result) ? '¡Perfecto! ✅' : `Dijiste: "${result}" ❌`);
      };
      recognition.onend = () => { setListening(false); if (mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop(); };
      recognition.start();
    } catch (err) { alert("Error al acceder al micro"); }
  };

  return (
    <div style={{ backgroundColor: current.color, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px', transition: 'all 0.5s' }}>
      
      {/* SELECTOR DE NIVELES */}
      <div style={{ position: 'absolute', top: '20px', display: 'flex', gap: '10px' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => changeLevel(n)} style={{ backgroundColor: level === n ? 'white' : 'rgba(255,255,255,0.2)', color: level === n ? 'black' : 'white', border: 'none', width: '40px', height: '40px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            {n}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '70px', marginBottom: '10px' }}>{current.icon}</div>
      <h2 style={{ fontSize: '18px', opacity: 0.8, marginBottom: '5px' }}>NIVEL {level} • {current.cat}</h2>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '10px' }}>{current.eng}</h1>
      
      <div style={{ height: '40px', marginBottom: '20px' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{feedback}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => speakNative(current.eng)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '10px 20px', fontSize: '14px', borderRadius: '50px', cursor: 'pointer' }}>
          Oír Nativo 🔊
        </button>

        <button onClick={startListeningAndRecording} disabled={listening} style={{ backgroundColor: listening ? '#ef4444' : 'white', color: listening ? 'white' : 'black', border: 'none', padding: '15px 25px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}>
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
