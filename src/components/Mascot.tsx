import React from 'react';

export default function Mascot({ emotion }: { emotion: string }) {
  // Tooltip message dynamically changes based on emotion state
  let message = "I'm here to help!";
  if (emotion === 'excited') message = "That's wonderful! 💖";
  if (emotion === 'sad') message = "Oh no, we will try to improve! 📝";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end drop-shadow-2xl animate-fade-in">
       <div className="relative group">
          
          {/* Tooltip speech bubble */}
          <div className="absolute bottom-full right-8 mb-2 w-48 bg-white text-gray-700 text-sm font-semibold p-4 rounded-3xl rounded-br-none shadow-xl border border-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform origin-bottom-right">
            {message}
          </div>
          
          {/* Mascot Photo Bubble */}
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-[0_15px_35px_rgba(236,72,153,0.3)] flex items-center justify-center overflow-hidden cursor-pointer transform hover:scale-110 hover:-rotate-3 transition-all duration-300 relative">
            <img 
              src="/lady_emoji.jpg" 
              alt="Mascot Avatar" 
              className="w-full h-full object-cover object-top scale-[1.3]"
            />
          </div>

       </div>
    </div>
  );
}
