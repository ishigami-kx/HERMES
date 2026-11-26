import React from "react";
import type { LanguageCode, RecognitionStatus, EngineType, WhisperModelSize } from "../types/speech";
import { BookOpen, HelpCircle, SlidersHorizontal, Globe } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface SecondaryToolbarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  status: RecognitionStatus;
  statusMessage?: string;
  selectedEngine: EngineType;
  whisperModelSize: WhisperModelSize;
  backendOnline: boolean;
  onOpenGlossary: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

export const SecondaryToolbar: React.FC<SecondaryToolbarProps> = ({
  currentLanguage,
  onLanguageChange,
  status,
  statusMessage,
  selectedEngine,
  whisperModelSize,
  backendOnline,
  onOpenGlossary,
  onOpenHelp,
  onOpenSettings,
}) => {
  const isListening = status === "listening" || status === "processing";

  return (
    <div
      aria-label="Application Toolbar"
      className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-[#181818]/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#282828] shadow-sm"
    >
      {/* Left: Language Selector & Engine/Status Badges */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Quick Language Toggle Pill */}
        <div
          role="group"
          aria-label="Select Spoken Language"
          className="inline-flex items-center p-1 bg-[#121212] rounded-xl border border-[#2A2A2A]"
        >
          <div className="px-2.5 py-1 flex items-center gap-1.5 text-xs font-semibold text-[#A0A0A0]">
            <Globe className="w-3.5 h-3.5 text-[#FFB347]" />
            <span className="hidden sm:inline">Language:</span>
          </div>

          <button
            type="button"
            disabled={isListening}
            onClick={() => onLanguageChange("en-US")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentLanguage === "en-US"
                ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-xs font-black"
                : "text-[#A0A0A0] hover:text-[#F5F5F5]"
            } ${isListening ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            aria-pressed={currentLanguage === "en-US"}
          >
            English (US)
          </button>

          <button
            type="button"
            disabled={isListening}
            onClick={() => onLanguageChange("am-ET")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-ethiopic transition-all ${
              currentLanguage === "am-ET"
                ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-xs font-black"
                : "text-[#A0A0A0] hover:text-[#F5F5F5]"
            } ${isListening ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            aria-pressed={currentLanguage === "am-ET"}
          >
            አማርኛ (Amharic)
          </button>
        </div>

        {/* Engine Status Indicator Pill */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2E2E2E] bg-[#121212] text-xs font-semibold text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#F36B35]/50 cursor-pointer transition-all shadow-xs"
          title="Click to configure speech recognition engine"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              selectedEngine === "browser"
                ? "bg-emerald-400"
                : backendOnline
                ? "bg-emerald-400"
                : "bg-[#FFB347]"
            }`}
          />
          <span>
            {selectedEngine === "whisper"
              ? `Local Whisper (${whisperModelSize})`
              : "Browser Web Speech"}
          </span>
        </button>

        {/* Detailed Status Badge */}
        <StatusBadge status={status} message={statusMessage} />
      </div>

      {/* Right: Science Glossary, Help, and Settings */}
      <div className="flex items-center gap-2">
        {/* Science Glossary */}
        <button
          type="button"
          onClick={onOpenGlossary}
          className="px-3 py-2 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:bg-[#1E1E1E] text-[#F5F5F5] text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#F36B35] cursor-pointer hover:border-[#F36B35]/50 shadow-xs"
          aria-label="Open Science Terminology Glossary"
          title="Physics & Science Terms (English ↔ አማርኛ)"
        >
          <BookOpen className="w-4 h-4 text-[#FFB347]" />
          <span>Science Glossary</span>
        </button>

        {/* Help */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="px-3 py-2 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:bg-[#1E1E1E] text-[#F5F5F5] text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#F36B35] cursor-pointer hover:border-[#F36B35]/50 shadow-xs"
          aria-label="Open Help & Privacy Guide"
          title="Help & Guides"
        >
          <HelpCircle className="w-4 h-4 text-[#FFB347]" />
          <span>Help</span>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="px-3 py-2 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:bg-[#1E1E1E] text-[#F5F5F5] text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#F36B35] cursor-pointer hover:border-[#F36B35]/50 shadow-xs"
          aria-label="Open Settings"
          title="Settings"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#F36B35]" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
