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

const THEME = {
  bg: '#121927',
  panel: '#1f2937',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  primary: '#38bdf8',
  success: '#10b981',
  error: '#ef4444',
  border: '#374151'
};

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);
  const [feedback, setFeedback] = useState('');

  // Lógica para agrupar frases por categoría
  const categories = [...new Set(FRASES_BASE.map(f => f.category))];
  
  const filteredPhrases = FRASES_BASE.filter(f => 
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

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
      toast.success("Excellent!");
    } else {
      setFeedback(`❌ Missed: ${missingWords.join(", ")}`);
      toast.error("Try again");
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if
