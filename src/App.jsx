import React, { useState } from 'react';

const FRASES = [
  // --- GAMING ---
  { eng: "I need backup, help me!", cat: "GAMING", icon: "🎮", color: "#8b5cf6" },
  { eng: "The lag is unbearable today.", cat: "GAMING", icon: "🌐", color: "#8b5cf6" },
  { eng: "Enemy spotted on the right!", cat: "GAMING", icon: "🎯", color: "#8b5cf6" },
  { eng: "Good game, well played everyone.", cat: "GAMING", icon: "🏆", color: "#8b5cf6" },
  
  // --- COLEGIO ---
  { eng: "Can I borrow your pen, please?", cat: "SCHOOL", icon: "✏️", color: "#f59e0b" },
  { eng: "I don't understand this exercise.", cat: "SCHOOL", icon: "📚", color: "#f59e0b" },
  { eng: "Teacher, I have a question.", cat: "SCHOOL", icon: "🙋‍♂️", color: "#f59e0b" },

  // --- VIAJES ---
  { eng: "What time is my flight?", cat: "TRAVEL", icon: "✈️", color: "#06b6d4" },
  { eng: "Where is the nearest bathroom?", cat: "TRAVEL", icon: "🚻", color: "#06b6d4" },
  { eng: "A ticket to London, please.", cat: "TRAVEL", icon: "🎫", color: "#06b6d4" },

  // --- RESTAURANTE ---
  { eng: "The check, please.", cat: "RESTAURANT", icon: "🧾", color: "#64748b" },
  { eng: "Can I have a glass of water?", cat: "RESTAURANT", icon: "🥛", color: "#64748b" },
  { eng: "I would like a burger.", cat: "RESTAURANT", icon: "🍔", color: "#64748b" },

  // --- EMERGENCIAS ---
  { eng: "I lost my passport.", cat: "EMERGENCY", icon: "📕", color: "#ef4444" },
  { eng: "Call an ambulance, please!", cat: "EMERGENCY", icon: "🚑", color: "#ef4444" },

  // --- SALUDOS ---
  { eng: "Nice to meet you!", cat: "GREETINGS", icon: "👋", color: "#a855f7" },
  { eng: "See you later, alligator!", cat: "GREETINGS", icon: "🐊", color: "#a855f7" },
  { eng: "Have a wonderful day!", cat: "GREETINGS", icon: "☀️", color: "#a855f7" }
];

export default function App() {
  const [idx, setIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const item = FRASES[idx];

  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  const startListen = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Usa Chrome");
    const rec = new Speech();
    rec.lang = 'en-US';
    rec.onstart
