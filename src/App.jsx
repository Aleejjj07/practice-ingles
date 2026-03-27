import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const FRASES_BASE = [
  { english: "Where is the nearest bathroom?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1581403664797-e751853d49f6?q=80&w=600" },
  { english: "I am looking for the train station.", category: "travel", imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=600" },
  { english: "What time is my flight?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600" },
  { english: "Can you help me with my bags?", category: "travel", imageUrl: "https://images.unsplash.com/photo-1627931446702-86ff54c6020c?q=80&w=600" },
  { english: "Can I have a glass of water, please?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1516248911578-f7efdf7a5f6e?q=80&w=600" },
  { english: "What do you recommend from the menu?", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1549419137-b499119565eb?q=80&w=600" },
  { english: "The check, please.", category: "restaurant", imageUrl: "https://images.unsplash.com/photo-1587820121703-a17f225330a5?q=80&w=600" },
  { english: "How much does this cost?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600" },
  { english: "Do you have this in a smaller size?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600" },
  { english: "Can I pay with credit card?", category: "shopping", imageUrl: "https://images.unsplash.com/photo-1563013544-824ae14f4026?q=80&w=600" },
  { english: "Nice to meet you, what's your name?", category: "greetings", imageUrl: "https://images.unsplash.com/photo-1520333781090-e29497e8081f?q=80&w=600" },
  { english: "Could you speak more slowly, please?", category: "help", imageUrl: "https://images.unsplash.com/photo-1594911768808-8e62d4e78f90?q=80&w=600" },
  { english: "I am late for the meeting.", category: "work", imageUrl: "https://images.unsplash.com/photo-1506784926709-22f1ec395907?q=80&w=600" },
  { english: "I need help, call an ambulance.", category: "emergency", imageUrl: "https://images.unsplash.com/photo-1587740896339-382a88e9988b?q=80&w=600" },
];

const THEME = {
  bg: '#121927', panel: '#1f2937', text: '#f3f4f6', primary: '#38bdf8', success: '#10b981', error: '#ef4444', border: '#374151', gold: '#fbbf24', secondary: '#8b5cf6'
};

export default function EnglishCoach() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(FRASES_BASE[0]);
  const [feedback, setFeedback] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  // Referencias para la grabación
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const speakNative = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const playMyVoice = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const comparePhrases = (original, spoken) => {
    const clean = (text) => text.toLowerCase().replace(/[?.!,]/g, "").trim().split(/\s+/);
    const origWords = clean(original);
    const spokWords = clean(spoken);
    let missingWords = origWords.filter(word => !spokWords.includes(word));

    if (missingWords.length === 0) {
      setFeedback(`✅ Perfect! +10 XP`);
      setXp(prev => prev + 10);
      toast.success("Perfect! You sound like a pro.");
    } else {
      setFeedback(`❌ Missed: ${missingWords.join(", ")} | +2 XP`);
      setXp(prev => prev + 2);
    }
  };

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Use Chrome/Edge.");

    // Iniciar Grabación de Audio Real
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
