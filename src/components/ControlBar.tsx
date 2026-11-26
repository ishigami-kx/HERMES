import React, { useState, useRef, useEffect } from "react";
import type { RecognitionStatus, LanguageCode } from "../types/speech";
import { Mic, Square, Globe, Settings, ChevronDown, Check } from "lucide-react";

interface ControlBarProps {
  status: RecognitionStatus;
  onStart: () => void;
  onStop: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenSettings: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  status,
  onStart,
  onStop,
  currentLanguage,
  onLanguageChange,
  onOpenSettings,
}) => {
  const isListening = status === "listening" || status === "processing";
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      aria-label="Transcription Action Controls"
      className="w-full bg-[#181818]/90 backdrop-blur-md border border-[#282828] rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4"
    >
      {/* 1. Left: Language Selector matching Reference Image 2 */}
      <div className="relative w-full md:w-auto" ref={langMenuRef}>
        <button
          type="button"
          disabled={isListening}
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className={`w-full md:w-auto flex items-center justify-between md:justify-start gap-2.5 px-4 py-3 rounded-xl border border-[#2E2E2E] bg-[#141414] text-xs sm:text-sm font-semibold transition-all ${
            isListening
              ? "opacity-60 cursor-not-allowed text-[#777777]"
              : "hover:border-[#F36B35]/60 hover:bg-[#1E1E1E] text-[#F5F5F5] cursor-pointer"
          }`}
          aria-haspopup="listbox"
          aria-expanded={isLangMenuOpen}
          aria-label="Select Spoken Language"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FFB347]" />
            <span className="text-[#A0A0A0]">Language:</span>
            <span className="text-[#F5F5F5] font-bold font-ethiopic">
              {currentLanguage === "am-ET" ? "አማርኛ (Amharic)" : "English (US)"}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#A0A0A0] transition-transform duration-200 ${
              isLangMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Options */}
        {isLangMenuOpen && (
          <div className="absolute left-0 bottom-full mb-2 w-56 bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                onLanguageChange("en-US");
                setIsLangMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-left transition-colors cursor-pointer ${
                currentLanguage === "en-US"
                  ? "bg-[#252525] text-[#FFB347]"
                  : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#202020]"
              }`}
            >
              <span>English (US)</span>
              {currentLanguage === "en-US" && <Check className="w-4 h-4 text-[#FFB347]" />}
            </button>

            <button
              type="button"
              onClick={() => {
                onLanguageChange("am-ET");
                setIsLangMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-ethiopic text-left transition-colors cursor-pointer ${
                currentLanguage === "am-ET"
                  ? "bg-[#252525] text-[#FFB347]"
                  : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#202020]"
              }`}
            >
              <span>አማርኛ (Amharic)</span>
              {currentLanguage === "am-ET" && <Check className="w-4 h-4 text-[#FFB347]" />}
            </button>
          </div>
        )}
      </div>

      {/* 2. Center: Primary Start / Stop Listening Button */}
      <div className="flex items-center justify-center w-full md:w-auto">
        {!isListening ? (
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F36B35] to-[#FFB347] hover:brightness-110 text-black font-black text-base sm:text-lg shadow-xl shadow-[#F36B35]/25 transition-all duration-200 cursor-pointer focus:ring-4 focus:ring-[#F36B35]/40 active:scale-[0.98]"
            aria-label="Start Listening"
          >
            <Mic className="w-5 h-5 text-black fill-current animate-pulse" />
            <span className="tracking-wide">Start Listening</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStop}
            className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 text-white font-black text-base sm:text-lg shadow-xl shadow-rose-600/35 ring-4 ring-rose-500/30 transition-all duration-200 cursor-pointer focus:ring-4 focus:ring-rose-500/50 active:scale-[0.98] animate-pulse"
            aria-label="Stop Listening"
          >
            <Square className="w-5 h-5 fill-current" />
            <span className="tracking-wide">Stop Listening</span>
          </button>
        )}
      </div>

      {/* 3. Right: Advanced Settings matching Reference Image 2 */}
      <div className="w-full md:w-auto flex justify-end">
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full md:w-auto flex items-center justify-between md:justify-center gap-2 px-4 py-3 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:bg-[#1E1E1E] hover:border-[#F36B35]/50 text-xs sm:text-sm font-semibold text-[#F5F5F5] transition-all cursor-pointer shadow-xs"
          aria-label="Open Advanced Settings"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FFB347]" />
            <span>Advanced Settings</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#A0A0A0]" />
        </button>
      </div>
    </div>
  );
};
