import React from "react";

export default function Mascot({ emotion }: { emotion: string }) {
  let message = "I'm here to help!";
  let containerClasses = "bg-gradient-to-tr from-pink-100 to-rose-50 shadow-[0_15px_35px_rgba(236,72,153,0.3)] scale-100 animate-pulse-slow";
  let petalColor = "fill-pink-400";
  let centerColor = "fill-rose-300";

  if (emotion === "excited") {
    message = "That's wonderful! 🌸";
    containerClasses = "bg-gradient-to-tr from-pink-200 to-fuchsia-100 shadow-[0_15px_50px_rgba(236,72,153,0.6)] scale-110 animate-bounce";
    petalColor = "fill-pink-500";
    centerColor = "fill-rose-400";
  } else if (emotion === "sad") {
    message = "We will try to improve! 🌱";
    containerClasses = "bg-gradient-to-tr from-gray-100 to-slate-50 shadow-[0_10px_20px_rgba(100,116,139,0.2)] scale-95 opacity-80";
    petalColor = "fill-slate-400";
    centerColor = "fill-gray-300";
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end animate-fade-in">
       <div className="relative group">
          
          <div className="absolute bottom-full right-8 mb-2 w-48 bg-white/95 backdrop-blur-sm text-gray-700 text-sm font-semibold p-4 rounded-3xl rounded-br-none shadow-xl border border-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform origin-bottom-right">
            {message}
          </div>
          
          <div className={\w-20 h-20 rounded-full border-4 border-white flex items-center justify-center cursor-pointer transition-all duration-500 ease-out relative \\}>
            {/* Beautiful Lotus SVG */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 relative z-10 drop-shadow-md transition-all duration-500">
              {/* Outer Petals */}
              <path d="M 50 90 C 20 90 10 60 10 50 C 30 50 40 70 50 90 Z" className={\\ transition-colors duration-500\} />
              <path d="M 50 90 C 80 90 90 60 90 50 C 70 50 60 70 50 90 Z" className={\\ transition-colors duration-500\} />
              
              {/* Middle Petals */}
              <path d="M 50 90 C 25 80 20 40 30 30 C 40 45 45 70 50 90 Z" className={\\ transition-colors duration-500\} />
              <path d="M 50 90 C 75 80 80 40 70 30 C 60 45 55 70 50 90 Z" className={\\ transition-colors duration-500\} />
              
              {/* Center Petal */}
              <path d="M 50 90 C 40 70 40 30 50 15 C 60 30 60 70 50 90 Z" className="fill-white opacity-90" />
            </svg>
            
            {/* Glowing aura when excited */}
            {emotion === "excited" && (
              <div className="absolute inset-0 rounded-full bg-pink-400 opacity-20 animate-ping"></div>
            )}
          </div>

       </div>
    </div>
  );
}
