import React from "react";
import type { LanguageCode } from "../types/speech";
import { Globe, AlertCircle } from "lucide-react";

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div
        role="group"
        aria-label="Select Spoken Language"
        className="inline-flex items-center p-1 bg-[#141414] rounded-xl border border-[#2E2E2E]"
      >
        <div className="px-2.5 py-1 flex items-center gap-1.5 text-xs font-semibold text-[#A0A0A0]">
          <Globe className="w-3.5 h-3.5 text-[#FFB347]" />
          <span className="hidden sm:inline">Language:</span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onLanguageChange("en-US")}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
            currentLanguage === "en-US"
              ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-xs font-black"
              : "text-[#A0A0A0] hover:text-[#F5F5F5]"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          aria-pressed={currentLanguage === "en-US"}
        >
          English (US)
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onLanguageChange("am-ET")}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold font-ethiopic transition-all ${
            currentLanguage === "am-ET"
              ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-xs font-black"
              : "text-[#A0A0A0] hover:text-[#F5F5F5]"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          aria-pressed={currentLanguage === "am-ET"}
        >
          አማርኛ (Amharic)
        </button>
      </div>

      {currentLanguage === "am-ET" && (
        <span className="text-[11px] font-medium text-[#FFB347] bg-[#F36B35]/15 px-2 py-0.5 rounded-md border border-[#F36B35]/30 inline-flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0 text-[#FFB347]" />
          <span>Locked to 'am' • CPU base model</span>
        </span>
      )}
    </div>
  );
};
