import React, { useState, useEffect } from 'react';

export default function Mascot({ emotion }: { emotion: string }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const getMouth = () => {
    switch (emotion) {
      case 'excited': 
        return <path d="M 35 60 Q 50 85 65 60 Z" fill="#ec4899" />;
      case 'sad': 
        return <path d="M 35 68 Q 50 55 65 68" fill="none" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />;
      case 'happy': 
      default: 
        return <path d="M 35 60 Q 50 75 65 60" fill="none" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />;
    }
  };

  const getEyes = () => {
    if (blink) {
      return (
        <>
          <line x1="30" y1="45" x2="40" y2="45" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="45" x2="70" y2="45" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    }
    if (emotion === 'excited') {
      return (
        <>
          <path d="M 28 46 L 35 38 L 42 46" fill="none" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 58 46 L 65 38 L 72 46" fill="none" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    }
    return (
      <>
        <circle cx="35" cy="45" r="4.5" fill="#4b5563" />
        <circle cx="65" cy="45" r="4.5" fill="#4b5563" />
      </>
    );
  };

  const getEyebrows = () => {
    if (emotion === 'sad') {
      return (
        <>
          <line x1="28" y1="35" x2="40" y2="30" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="30" x2="72" y2="35" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    }
    return null;
  };

  let message = "I'm here to help!";
  if (emotion === 'excited') message = "That's wonderful! 💖";
  if (emotion === 'sad') message = "Oh no, we will try to improve! 📝";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end drop-shadow-2xl animate-fade-in">
       <div className="relative group">
          
          <div className="absolute bottom-full right-8 mb-2 w-48 bg-white text-gray-700 text-sm font-semibold p-4 rounded-3xl rounded-br-none shadow-xl border border-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform origin-bottom-right">
            {message}
          </div>
          
          <div className="w-24 h-24 bg-gradient-to-tr from-pink-100 to-rose-50 rounded-full border-4 border-white shadow-[0_15px_35px_rgba(236,72,153,0.3)] flex items-center justify-center overflow-hidden cursor-pointer transform hover:scale-110 hover:-rotate-3 transition-all duration-300 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full pt-4 relative z-10 drop-shadow-sm">
              <circle cx="50" cy="50" r="34" fill="#1f2937" />
              <circle cx="50" cy="52" r="28" fill="#fef08a" className="fill-amber-100" />
              <circle cx="50" cy="35" r="3" fill="#ef4444" />
              {getEyebrows()}
              {getEyes()}
              {getMouth()}
              <path d="M 10 50 Q 50 5 90 50 Q 80 18 50 18 Q 20 18 10 50 Z" fill="#1f2937" />
              {emotion === 'excited' && (
                <>
                  <ellipse cx="23" cy="55" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
                  <ellipse cx="77" cy="55" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
                </>
              )}
            </svg>
          </div>
       </div>
    </div>
  );
}
