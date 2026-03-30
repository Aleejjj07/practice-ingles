import React, { useState } from 'react';

const FRASES = [
  // --- TUS FRASES DE ANTES (CON EMOJIS) ---
  { eng: "I need backup, help me!", cat: "GAMING", icon: "🎮", color: "#8b5cf6" },
  { eng: "What time is my flight?", cat: "TRAVEL", icon: "✈️", color: "#06b6d4" },
  { eng: "The check, please.", cat: "RESTAURANT", icon: "🧾", color: "#64748b" },
  { eng: "I lost my passport.", cat: "EMERGENCY", icon: "📕", color: "#ef4444" },

  // --- NUEVAS FRASES RELACIONADAS ---
  { eng: "The lag is unbearable today.", cat: "GAMING", icon: "🌐", color: "#8b5cf6" },
  { eng: "Enemy spotted on the right!", cat: "GAMING", icon: "🎯", color: "#8b5cf6" },
  { eng: "Can I borrow your pen, please?", cat: "SCHOOL", icon: "✏️", color: "#f59e0b" },
  { eng: "I don't understand this exercise.", cat: "SCHOOL", icon: "📚", color: "#f59e0b" },
  { eng: "Where is the nearest bathroom?", cat: "TRAVEL", icon: "🚻", color: "#06b6d4" },
  { eng: "Can I have a glass of water?", cat: "RESTAURANT", icon: "🥛", color: "#64748b" },
  { eng: "How much does this cost?", cat: "SHOPPING", icon: "💰", color: "#fbbf24" },
  { eng: "Call an ambulance, please!", cat: "EMERGENCY", icon: "🚑", color: "#ef4444" },
  { eng: "Nice to meet you, what's your name?", cat: "GREETINGS", icon: "👋", color: "#a855f7" },
  { eng: "See you later, alligator!", cat: "GREETINGS", icon: "🐊", color: "#a855f7" }
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
