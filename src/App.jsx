import React, { useState, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const FRASES_BASE = [
  { english: "How much does this cost?", category: "compras" },
  { english: "Where is the nearest bathroom?", category: "viajes" },
  { english: "Can I have a glass of water, please?", category: "restaurante" },
  { english: "Nice to meet you, what's your name?", category: "saludos" },
  { english: "I am looking for the train station.", category: "viajes" },
  { english: "Could you speak more slowly, please?", category: "ayuda" },
  { english: "What do you recommend from the menu?", category: "restaurante" }
];

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);

  // Filtrar frases según la búsqueda
  const filteredPhrases = FRASES_BASE.filter(f => 
    f.category.includes(searchQuery.toLowerCase()) || 
    f.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Tu navegador no soporta voz. Usa Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscribedText(text);
      setIsListening(false);
      
      if (text.toLowerCase().includes(currentPhrase.english.toLowerCase().replace(/[?.!,]/g, ""))) {
        toast.success("¡Perfecto! Pronunciación excelente.");
      } else {
        toast.error("Casi... ¡Inténtalo de nuevo!");
      }
    };

    recognition.start();
  };

  return (
    <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: 'auto' }}>
      <Toaster />
      <h1 style={{ color: '#4A90E2' }}>English Coach AI 🎙️</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Busca un tema (viajes, restaurante...)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', width: '80%', borderRadius: '10px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Frase seleccionada:</p>
        <h2 style={{ color: '#333' }}>{currentPhrase.english}</h2>
        <p style={{ fontStyle: 'italic', color: '#888' }}>Tu voz: "{transcribedText}"</p>
      </div>

      <button 
        onClick={startListening}
        style={{
          padding: '15px 30px', fontSize: '18px', borderRadius: '50px', border: 'none', cursor: 'pointer',
          backgroundColor: isListening ? '#ff4b4b' : '#4CAF50', color: 'white', marginBottom: '20px'
        }}
      >
        {isListening ? 'Escuchando...' : '🎙️ Pulsar para practicar'}
      </button>

      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <p><strong>Resultados de búsqueda:</strong></p>
        {filteredPhrases.map((f, i) => (
          <div 
            key={i} 
            onClick={() => setCurrentPhrase(f)}
            style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', color: '#007AFF' }}
          >
            {f.english} <span style={{ fontSize: '10px', color: '#999' }}>({f.category})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
