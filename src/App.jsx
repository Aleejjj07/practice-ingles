import React, { useState, useRef } from 'react';

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
  const [userAudio, setUserAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const current = FRASES[index];

  const next = () => {
    setIndex((index + 1) % FRASES.length);
    setFeedback('');
    setUserAudio(null);
  };

  const speakNative = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  const playMyVoice = () => {
    if (userAudio) {
      const audio = new Audio(userAudio);
      audio.play();
    }
  };

  const startListeningAndRecording = async () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Usa Chrome para esta función.");

    // Configurar grabación de audio real
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

      // Configurar reconocimiento de voz (texto)
      const recognition = new Speech();
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setListening(true);
        setFeedback('Escuchando...');
        mediaRecorderRef.current.start();
      };

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        const cleanOriginal = current.eng.toLowerCase().replace(/[.,!?]/g, "");
        if (result.includes(cleanOriginal) || cleanOriginal.includes(result)) {
          setFeedback('¡Perfecto! ✅');
        } else {
          setFeedback(`Dijiste: "${result}" ❌`);
        }
      };

      recognition.onend = () => {
        setListening(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      };

      recognition.start();
    } catch (err) {
      alert("Error al acceder al micro: " + err);
    }
  };

  return (
    <div style={{ backgroundColor: current.color, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px', transition: 'all 0.5s' }}>
      <div style={{ fontSize: '80px', marginBottom: '10px' }}>{current.icon}</div>
      <h2 style={{ fontSize: '20px', opacity: 0.8, marginBottom: '5px' }}>{current.cat}</h2>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>{current.eng}</h1>
      
      <div style={{ height: '40px', marginBottom: '20px' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: feedback === '¡Perfecto! ✅' ? '#4ade80' : 'white' }}>
          {feedback}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
        {/* BOTÓN VOZ NATIVA */}
        <button onClick={() => speakNative(current.eng)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '12px 20px', fontSize: '16px', borderRadius: '50px', cursor: 'pointer' }}>
          Oír Nativo 🔊
        </button>

        {/* BOTÓN HABLAR (GRABA Y RECONOCE) */}
        <button onClick={startListeningAndRecording} disabled={listening} style={{ backgroundColor: listening ? '#ef4444' : 'white', color: listening ? 'white' : 'black', border: 'none', padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', transform: listening ? 'scale(1.1)' : 'scale(1)', transition: '0.2s' }}>
          {listening ? '🔴 Grabando...' : 'Hablar 🎤'}
        </button>

        {/* BOTÓN ESCUCHAR MI PROPIA GRABACIÓN */}
        {userAudio && (
          <button onClick={playMyVoice} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '12px 20px', fontSize: '16px', borderRadius: '50px', cursor: 'pointer', animation: 'bounce 0.5s infinite alternate' }}>
            Oír mi voz 🔁
          </button>
        )}

        {/* BOTÓN SIGUIENTE */}
        <button onClick={next} style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}>
          Siguiente ➡️
        </button>
      </div>

      <style>{`
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }
      `}</style>
    </div>
  );
}
