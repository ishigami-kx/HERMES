import React from "react";
import { HermesMessengerArt } from "./HermesMessengerArt";

interface HeroSectionProps {
  isListening?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isListening = false }) => {
  // Wave bar height configuration inspired by Reference Image 2
  const waveHeights = [18, 30, 48, 65, 88, 70, 95, 75, 60, 42, 28, 16];

  return (
    <section
      aria-label="HERMES Hero Banner"
      className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#141414] via-[#121212] to-[#0E0E0E] border border-[#242424] p-5 sm:p-7 md:p-8 shadow-xl"
    >
      {/* Background Solar Flare Ambient Gradients & Swirls */}
      <div className="absolute top-0 right-0 w-3/4 h-full bg-radial from-[#F36B35]/12 via-[#FFB347]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-1/2 h-1/2 bg-radial from-[#F36B35]/10 to-transparent blur-2xl pointer-events-none" />

      {/* Decorative Golden Solar Flare Light Ribbons */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        viewBox="0 0 1000 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120 C 300 40, 500 220, 800 110 C 900 70, 960 140, 1000 160"
          stroke="url(#hero-ribbon-grad-1)"
          strokeWidth="1.5"
        />
        <path
          d="M100 220 C 350 160, 600 280, 850 170 C 930 130, 970 200, 1000 220"
          stroke="url(#hero-ribbon-grad-2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <defs>
          <linearGradient id="hero-ribbon-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#101010" />
            <stop offset="40%" stopColor="#F36B35" />
            <stop offset="70%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#101010" />
          </linearGradient>
          <linearGradient id="hero-ribbon-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#101010" />
            <stop offset="50%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#101010" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Bar Status Indicator */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A]/90 border border-[#2E2E2E] text-xs font-semibold text-emerald-400 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Online</span>
        </div>
      </div>

      {/* Hero Content Grid: Hermes Artwork | Center Typography | Glowing Wave Graphic */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 pt-2">
        {/* Left: Hermes Classical Messenger Artwork */}
        <div className="shrink-0 flex items-center justify-center">
          <HermesMessengerArt className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52" />
        </div>

        {/* Center: Prominent Brand Typography */}
        <div className="flex-1 flex flex-col items-center md:items-center text-center">
          {/* Main HERMES Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.25em] text-[#F5F5F5] uppercase select-none leading-tight drop-shadow-sm font-sans">
            H<span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFB347] to-[#F36B35]">E</span>RMES
          </h1>

          {/* Subtitle with Horizontal Dividing Lines */}
          <div className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-sm my-2">
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FFB347]/50 to-[#FFB347]/80" />
            <span className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-[#E0E0E0] uppercase whitespace-nowrap">
              REAL-TIME TRANSCRIPTION
            </span>
            <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#FFB347]/50 to-[#FFB347]/80" />
          </div>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-serif italic tracking-wide text-[#FFB347] mt-1 drop-shadow-[0_2px_12px_rgba(243,107,53,0.3)]">
            Listen. Read. Learn.
          </p>
        </div>

        {/* Right: Glowing Audio-Wave Graphic */}
        <div className="hidden lg:flex items-center justify-center gap-1.5 h-28 px-4 py-2 rounded-2xl bg-[#161616]/40 border border-[#2A2A2A]/40 backdrop-blur-xs">
          {waveHeights.map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full bg-gradient-to-t from-[#F36B35] via-[#FFB347] to-[#FFEACC] transition-all duration-300 ${
                isListening ? "animate-pulse" : "opacity-75"
              }`}
              style={{
                height: `${h}%`,
                animationDelay: `${i * 90}ms`,
                boxShadow: isListening ? "0 0 8px rgba(255, 179, 71, 0.4)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
