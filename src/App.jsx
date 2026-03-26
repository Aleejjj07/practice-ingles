import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

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

  const filteredPhrases = FRASES_BASE.filter(f => 
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FUNCIÓN PARA PASAR A LA SIGUIENTE FRASE ---
  const nextPhrase = () => {
    const currentIndex = filteredPhrases.findIndex(f => f.english === currentPhrase.english);
    const nextIndex = (currentIndex + 1) % filteredPhrases.length;
    setCurrentPhrase(filteredPhrases[nextIndex]);
    setFeedback('');
    setTranscribedText('');
  };

  const comparePhrases = (original, spoken) => {
    const clean = (text) => text.toLowerCase().replace(/[?.!,]/g, "").trim().split(/\s+/);
    const origWords = clean(original);
    const spokWords = clean(spoken);
    let missingWords = origWords.filter(word => !spokWords.includes(word));

    if (missingWords.length === 0) {
      setFeedback("✅ ¡Pronunciación perfecta!");
      toast.success("¡Excelente!");
    } else {
      setFeedback(`❌ Te faltó o fallaste en: "${missingWords.join(", ")}"`);
      toast.error("Vuelve a intentarlo.");
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Usa Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setFeedback('Escuchando...'); };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscribedText(text);
      setIsListening(false);
      comparePhrases(currentPhrase.english, text);
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

      <div style={{ background: '#ecf0f1', padding: '25px', borderRadius: '20px', border: '1px solid #bdc3c7', marginBottom: '15px' }}>
        <span style={{ background: '#3498db', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '11px' }}>{currentPhrase.category.toUpperCase()}</span>
        <h2 style={{ color: '#2c3e50', margin: '15px 0' }}>{currentPhrase.english}</h2>
        
        <div style={{ padding: '10px', borderRadius: '10px', background: feedback.startsWith('✅') ? '#d4edda' : '#f8d7da', display: feedback ? 'block' : 'none', marginBottom: '10px' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: feedback.startsWith('✅') ? '#155724' : '#721c24' }}>{feedback}</p>
        </div>
        
        <p style={{ fontSize: '16px', color: '#7f8c8d' }}>{transcribedText ? `Dijiste: "${transcribedText}"` : "Pulsa el botón para practicar"}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          onClick={startListening}
          style={{
            padding: '15px 30px', fontSize: '16px', borderRadius: '50px', border: 'none', cursor: 'pointer',
            backgroundColor: isListening ? '#e74c3c' : '#2ecc71', color: 'white', fontWeight: 'bold', flex: 1
          }}
        >
          {isListening ? '🛑 ESCUCHANDO...' : '🎙️ HABLAR'}
        </button>

        <button 
          onClick={nextPhrase}
          style={{
            padding: '15px 25px', fontSize: '16px', borderRadius: '50px', border: 'none', cursor: 'pointer',
            backgroundColor: '#3498db', color: 'white', fontWeight: 'bold', flex: 1
          }}
        >
          SIGUIENTE ➡️
        </button>
      </div>

      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <p style={{ color: '#34495e', fontWeight: 'bold' }}>Frases disponibles ({filteredPhrases.length}):</p>
        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '10px' }}>
          {filteredPhrases.map((f, i) => (
            <div key={i} onClick={() => { setCurrentPhrase(f); setFeedback(''); setTranscribedText(''); }}
              style={{ padding: '10px', borderBottom: '1px solid #f1f1f1', cursor: 'pointer', background: currentPhrase.english === f.english ? '#e1f5fe' : 'white' }}>
              <span style={{ color: '#3498db', fontSize: '14px' }}>{f.english}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
