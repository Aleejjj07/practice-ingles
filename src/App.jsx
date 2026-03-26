import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const FRASES_BASE = [
  { english: "Where is the nearest bathroom?", category: "travel" },
  { english: "I am looking for the train station.", category: "travel" },
  { english: "What time is my flight?", category: "travel" },
  { english: "Can you help me with my bags?", category: "travel" },
  { english: "Can I have a glass of water, please?", category: "restaurant" },
  { english: "What do you recommend from the menu?", category: "restaurant" },
  { english: "The check, please.", category: "restaurant" },
  { english: "I have a reservation for tonight.", category: "restaurant" },
  { english: "How much does this cost?", category: "shopping" },
  { english: "Do you have this in a smaller size?", category: "shopping" },
  { english: "Can I pay with credit card?", category: "shopping" },
  { english: "Nice to meet you, what's your name?", category: "greetings" },
  { english: "How do you spell that?", category: "help" },
  { english: "Could you speak more slowly, please?", category: "help" },
  { english: "I don't understand, can you repeat?", category: "help" },
  { english: "What do you do for a living?", category: "work" },
  { english: "I am late for the meeting.", category: "work" },
  { english: "I need help, call an ambulance.", category: "emergency" },
  { english: "I lost my passport.", category: "emergency" },
  { english: "I am allergic to peanuts.", category: "health" }
];

// Paleta de colores "Modo Oscuro Premium"
const THEME = {
  bg: '#121927',            // Fondo muy oscuro (azul-negro)
  panel: '#1f2937',         // Fondo de los recuadros
  text: '#f3f4f6',          // Texto principal claro
  textMuted: '#9ca3af',     // Texto secundario
  primary: '#38bdf8',       // Azul eléctrico para acentos
  success: '#10b981',       // Verde lima vibrante para aciertos
  error: '#ef4444',         // Rojo para errores
  border: '#374151'         // Color de bordes sutiles
};

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
      setFeedback(`✅ Perfect! "${original}"`);
      toast.success("Excellent pronunciation!", { icon: '👏', style: {background: THEME.panel, color: THEME.success} });
    } else {
      setFeedback(`❌ Missed words: ${missingWords.join(", ")}`);
      toast.error("Keep practicing!", { style: {background: THEME.panel, color: THEME.error} });
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Usa Chrome o Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setFeedback('Listening...'); };
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
    // Sugerencia 1: Degradado sutil en el fondo oscuro
    <div style={{ 
      minHeight: '100vh',
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      maxWidth: '800px', 
      margin: 'auto',
      backgroundColor: THEME.bg,
      color: THEME.text,
      backgroundImage: `linear-gradient(135deg, ${THEME.bg} 0%, #1a2536 100%)`
    }}>
      <Toaster position="top-center" />
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>AI English Coach 🎙️</h1>
      </header>
      
      <div style={{ position: 'sticky', top: '10px', background: THEME.bg, zIndex: 10, padding: '10px 0' }}>
        <input 
          type="text" 
          placeholder="🔍 Search topic or word..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            padding: '15px 20px', 
            width: '90%', 
            borderRadius: '12px', 
            border: `2px solid ${THEME.border}`, 
            backgroundColor: THEME.panel,
            color: THEME.text,
            fontSize: '18px', 
            outline: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'border-color 0.3s'
          }}
        />
      </div>

      <div style={{ 
        background: THEME.panel, 
        padding: '30px', 
        borderRadius: '20px', 
        border: `1px solid ${THEME.border}`, 
        marginBottom: '30px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px'}}>
          <span style={{ 
            background: THEME.primary, 
            color: '#fff', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '13px', 
            textTransform: 'uppercase', 
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>
            {currentPhrase.category}
          </span>
        </div>
        
        <h2 style={{ color: THEME.text, fontSize: '2.2rem', margin: '20px 0', fontWeight: 600 }}>{currentPhrase.english}</h2>
        
        <div style={{ 
          padding: '15px', 
          borderRadius: '12px', 
          background: THEME.bg, 
          display: feedback ? 'block' : 'none', 
          marginBottom: '20px',
          border: feedback.startsWith('✅') ? `1px solid ${THEME.success}40` : `1px solid ${THEME.error}40`,
        }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', color: feedback.startsWith('✅') ? THEME.success : THEME.error }}>
            {feedback}
          </p>
        </div>
        
        <p style={{ fontSize: '18px', color: THEME.textMuted, fontStyle: 'italic', minHeight: '30px' }}>
          {transcribedText ? `You said: "${transcribedText}"` : "Press the button and repeat the phrase..."}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px auto' }}>
        <button 
          onClick={startListening}
          style={{
            padding: '18px 30px', 
            fontSize: '18px', 
            borderRadius: '12px', 
            border: 'none', 
            cursor: 'pointer',
            backgroundColor: isListening ? THEME.error : THEME.success, 
            color: 'white', 
            fontWeight: 'bold', 
            flex: 2,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'background-color 0.2s, transform 0.1s'
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          {isListening ? '🛑 LISTENING...' : '🎙️ TALK NOW'}
        </button>

        <button 
          onClick={nextPhrase}
          style={{
            padding: '18px 20px', 
            fontSize: '18px', 
            borderRadius: '12px', 
            border: 'none', 
            cursor: 'pointer',
            backgroundColor: THEME.panel, 
            color: THEME.text, 
            fontWeight: 600, 
            flex: 1,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2d3748'}
          onMouseOut={(e) => e.target.style.backgroundColor = THEME.panel}
        >
          NEXT ➡️
        </button>
      </div>

      <div style={{ textAlign: 'left', marginTop: '40px', borderTop: `1px solid ${THEME.border}`, paddingTop: '20px' }}>
        <p style={{ color: THEME.textMuted, fontWeight: 600, marginBottom: '15px' }}>
          Select a phrase to practice ({filteredPhrases.length} available):
        </p>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: `1px solid ${THEME.border}`, 
          borderRadius: '12px',
          backgroundColor: THEME.panel,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {filteredPhrases.map((f, i) => (
            <div key={i} onClick={() => { setCurrentPhrase(f); setFeedback(''); setTranscribedText(''); }}
              style={{ 
                padding: '15px 20px', 
                borderBottom: `1px solid ${THEME.border}`, 
                cursor: 'pointer', 
                transition: 'background-color 0.2s',
                backgroundColor: currentPhrase.english === f.english ? `${THEME.primary}15` : 'transparent',
                color: currentPhrase.english === f.english ? THEME.primary : THEME.text
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${THEME.border}50`}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentPhrase.english === f.english ? `${THEME.primary}15` : 'transparent'}
            >
              <span style={{ fontSize: '16px', fontWeight: currentPhrase.english === f.english ? 600 : 400 }}>
                {f.english}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <footer style={{ marginTop: '50px', padding: '20px', color: THEME.textMuted, fontSize: '14px', borderTop: `1px solid ${THEME.border}`}}>
        Developed with ❤️ by Aleeffj07 & AI Coach. Start speaking now!
      </footer>
    </div>
  );
}
