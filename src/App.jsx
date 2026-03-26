import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

// 1. AQUÍ ESTÁN TODAS TUS FRASES (He guardado las 20 que tenías)
const FRASES_BASE = [
  { english: "Where is the nearest bathroom?", category: "viajes" },
  { english: "I am looking for the train station.", category: "viajes" },
  { english: "What time is my flight?", category: "viajes" },
  { english: "Can you help me with my bags?", category: "viajes" },
  { english: "Can I have a glass of water, please?", category: "restaurante" },
  { english: "What do you recommend from the menu?", category: "restaurante" },
  { english: "The check, please.", category: "restaurante" },
  { english: "I have a reservation for tonight.", category: "restaurante" },
  { english: "How much does this cost?", category: "compras" },
  { english: "Do you have this in a smaller size?", category: "compras" },
  { english: "Can I pay with credit card?", category: "compras" },
  { english: "Nice to meet you, what's your name?", category: "saludos" },
  { english: "How do you spell that?", category: "ayuda" },
  { english: "Could you speak more slowly, please?", category: "ayuda" },
  { english: "I don't understand, can you repeat?", category: "ayuda" },
  { english: "What do you do for a living?", category: "trabajo" },
  { english: "I am late for the meeting.", category: "trabajo" },
  { english: "I need help, call an ambulance.", category: "emergencia" },
  { english: "I lost my passport.", category: "emergencia" },
  { english: "I am allergic to peanuts.", category: "salud" }
];

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);
  const [feedback, setFeedback] = useState('');

  // Filtrar frases para el buscador
  const filteredPhrases = FRASES_BASE.filter(f => 
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. NUEVA FUNCIÓN DE CORRECCIÓN PASO A PASO
  const comparePhrases = (original, spoken) => {
    const clean = (text) => text.toLowerCase().replace(/[?.!,]/g, "").trim().split(/\s+/);
    const origWords = clean(original);
    const spokWords = clean(spoken);
    
    // Busca qué palabras de la frase original NO están en lo que dijiste
    let missingWords = origWords.filter(word => !spokWords.includes(word));

    if (missingWords.length === 0) {
      setFeedback("✅ ¡Pronunciación perfecta! Lo has dicho todo muy bien.");
      toast.success("¡Increíble!", { icon: '👏' });
    } else {
      setFeedback(`❌ Te ha faltado o has fallado en: "${missingWords.join(", ")}"`);
      toast.error("Casi... vuelve a intentarlo.");
    }
  };

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
      setFeedback('Escuchando...');
      setTranscribedText('');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscribedText(text);
      setIsListening(false);
      comparePhrases(currentPhrase.english, text); // Llama a la corrección
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Segoe UI, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <Toaster position="top-center" />
      <h1 style={{ color: '#2c3e50' }}>English Coach AI 🎙️</h1>
      
      <input 
        type="text" 
        placeholder="🔍 Busca un tema o palabra..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '12px', width: '90%', borderRadius: '25px', border: '2px solid #3498db', fontSize: '16px', marginBottom: '20px' }}
      />

      <div style={{ background: '#ecf0f1', padding: '25px', borderRadius: '20px', border: '1px solid #bdc3c7', marginBottom: '20px' }}>
        <span style={{ background: '#3498db', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '11px' }}>{currentPhrase.category.toUpperCase()}</span>
        <h2 style={{ color: '#2c3e50', margin: '15px 0' }}>{currentPhrase.english}</h2>
        
        {/* Aquí se muestra la corrección */}
        <div style={{ padding: '10px', borderRadius: '10px', background: feedback.startsWith('✅') ? '#d4edda' : '#f8d7da', display: feedback ? 'block' : 'none', marginBottom: '10px' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: feedback.startsWith('✅') ? '#155724' : '#721c24' }}>{feedback}</p>
        </div>
        
        <p style={{ fontSize: '16px', color: '#7f8c8d', fontStyle: 'italic' }}>
          {transcribedText ? `Dijiste: "${transcribedText}"` : "Pulsa el botón y repite la frase"}
        </p>
      </div>

      <button 
        onClick={startListening}
        style={{
          padding: '18px 40px', fontSize: '18px', borderRadius: '50px', border: 'none', cursor: 'pointer',
          backgroundColor: isListening ? '#e74c3c' : '#2ecc71', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}
      >
        {isListening ? '🛑 ESCUCHANDO...' : '🎙️ HABLAR AHORA'}
      </button>

      <div style={{ textAlign: 'left', marginTop: '30px' }}>
        <p style={{ color: '#34495e', fontWeight: 'bold' }}>Elige una frase para practicar:</p>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '10px' }}>
          {filteredPhrases.map((f, i) => (
            <div key={i} onClick={() => { setCurrentPhrase(f); setFeedback(''); setTranscribedText(''); }}
              style={{ padding: '12px', borderBottom: '1px solid #f1f1f1', cursor: 'pointer', background: currentPhrase.english === f.english ? '#e1f5fe' : 'white' }}>
              <span style={{ color: '#3498db' }}>{f.english}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
