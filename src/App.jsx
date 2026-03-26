import React, { useState, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

// AQUÍ ESTÁN TODAS LAS FRASES NUEVAS
const FRASES_BASE = [
  // VIAJES
  { english: "Where is the nearest bathroom?", category: "viajes" },
  { english: "I am looking for the train station.", category: "viajes" },
  { english: "What time is my flight?", category: "viajes" },
  { english: "Can you help me with my bags?", category: "viajes" },
  
  // RESTAURANTE
  { english: "Can I have a glass of water, please?", category: "restaurante" },
  { english: "What do you recommend from the menu?", category: "restaurante" },
  { english: "The check, please.", category: "restaurante" },
  { english: "I have a reservation for tonight.", category: "restaurante" },
  
  // COMPRAS
  { english: "How much does this cost?", category: "compras" },
  { english: "Do you have this in a smaller size?", category: "compras" },
  { english: "Can I pay with credit card?", category: "compras" },
  
  // TRABAJO / SALUDOS
  { english: "Nice to meet you, what's your name?", category: "saludos" },
  { english: "How do you spell that?", category: "ayuda" },
  { english: "Could you speak more slowly, please?", category: "ayuda" },
  { english: "I don't understand, can you repeat?", category: "ayuda" },
  { english: "What do you do for a living?", category: "trabajo" },
  { english: "I am late for the meeting.", category: "trabajo" },
  
  // EMERGENCIAS
  { english: "I need help, call an ambulance.", category: "emergencia" },
  { english: "I lost my passport.", category: "emergencia" },
  { english: "I am allergic to peanuts.", category: "salud" }
];

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);

  const filteredPhrases = FRASES_BASE.filter(f => 
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Usa Chrome para que funcione el micrófono.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscribedText('Escuchando...');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscribedText(text);
      setIsListening(false);
      
      const cleanOriginal = currentPhrase.english.toLowerCase().replace(/[?.!,]/g, "");
      const cleanSpoken = text.toLowerCase().replace(/[?.!,]/g, "");

      if (cleanSpoken.includes(cleanOriginal) || cleanOriginal.includes(cleanSpoken)) {
        toast.success("¡Excelente pronunciación!", { icon: '👏' });
      } else {
        toast.error("Inténtalo de nuevo.");
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <Toaster position="top-center" />
      <h1 style={{ color: '#2c3e50' }}>English Coach AI 🎙️</h1>
      
      <div style={{ position: 'sticky', top: '0', background: 'white', padding: '10px 0', zIndex: '10' }}>
        <input 
          type="text" 
          placeholder="🔍 Busca: viajes, compras, ayuda..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '12px', width: '90%', borderRadius: '25px', border: '2px solid #3498db', fontSize: '16px', outline: 'none' }}
        />
      </div>

      <div style={{ background: '#ecf0f1', padding: '25px', borderRadius: '20px', margin: '20px 0', border: '1px solid #bdc3c7' }}>
        <span style={{ background: '#3498db', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', textTransform: 'uppercase' }}>
          {currentPhrase.category}
        </span>
        <h2 style={{ color: '#2c3e50', marginTop: '10px' }}>{currentPhrase.english}</h2>
        <div style={{ minHeight: '40px', color: '#7f8c8d', fontStyle: 'italic', fontSize: '18px' }}>
          {transcribedText ? `"${transcribedText}"` : "Pulsa el micro y repite la frase"}
        </div>
      </div>

      <button 
        onClick={startListening}
        style={{
          padding: '18px 40px', fontSize: '18px', borderRadius: '50px', border: 'none', cursor: 'pointer',
          backgroundColor: isListening ? '#e74c3c' : '#2ecc71', color: 'white', fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: '0.3s'
        }}
      >
        {isListening ? '🛑 ESCUCHANDO...' : '🎙️ PULSAR PARA HABLAR'}
      </button>

      <div style={{ textAlign: 'left', marginTop: '30px' }}>
        <p style={{ color: '#34495e', fontWeight: 'bold' }}>Frases encontradas ({filteredPhrases.length}):</p>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '10px' }}>
          {filteredPhrases.map((f, i) => (
            <div 
              key={i} 
              onClick={() => { setCurrentPhrase(f); setTranscribedText(''); }}
              style={{ padding: '12px', borderBottom: '1px solid #f1f1f1', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f7f9f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <span style={{ color: '#3498db' }}>{f.english}</span>
              <span style={{ fontSize: '11px', color: '#95a5a6', background: '#f0f0f0', padding: '2px 6px', borderRadius: '5px' }}>{f.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
