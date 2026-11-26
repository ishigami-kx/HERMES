import React from "react";
import { X, Type, Cpu, Sparkles, CheckCircle } from "lucide-react";
import type { EngineType, WhisperModelSize } from "../types/speech";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  fontSize: "sm" | "md" | "lg" | "xl" | "2xl";
  onChangeFontSize: (size: "sm" | "md" | "lg" | "xl" | "2xl") => void;
  selectedEngine: EngineType;
  onChangeEngine: (engine: EngineType) => void;
  whisperModelSize: WhisperModelSize;
  onChangeWhisperModelSize: (size: WhisperModelSize) => void;
  backendOnline: boolean;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  fontSize,
  onChangeFontSize,
  selectedEngine,
  onChangeEngine,
  whisperModelSize,
  onChangeWhisperModelSize,
  backendOnline,
}) => {
  if (!isOpen) return null;

  const fontOptions: Array<{ size: "sm" | "md" | "lg" | "xl" | "2xl"; label: string }> = [
    { size: "sm", label: "Small (A)" },
    { size: "md", label: "Default (A+)" },
    { size: "lg", label: "Large (A++)" },
    { size: "xl", label: "Extra Large" },
    { size: "2xl", label: "Maximum" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1A1A1A] shadow-2xl border-l border-[#2E2E2E] p-6 flex flex-col justify-between overflow-y-auto text-[#F5F5F5]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#2E2E2E]">
              <h2 className="text-xl font-bold text-[#F5F5F5]">Settings & Speech Engine</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#A0A0A0] hover:bg-[#282828] hover:text-[#F5F5F5] cursor-pointer"
                aria-label="Close settings drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Speech Recognition Engine Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5F5]">
                    <Cpu className="w-4 h-4 text-[#F36B35]" />
                    <span>Active Speech Engine</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      backendOnline
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-[#F36B35]/20 text-[#FFB347] border border-[#F36B35]/40"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? "bg-emerald-400" : "bg-[#FFB347]"}`} />
                    {backendOnline ? "Backend Live" : "Backend Offline"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Browser Web Speech Option (Default) */}
                  <button
                    type="button"
                    onClick={() => onChangeEngine("browser")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedEngine === "browser"
                        ? "bg-[#252525] border-[#F36B35] ring-2 ring-[#F36B35]/30 text-[#F5F5F5]"
                        : "border-[#2E2E2E] text-[#A0A0A0] hover:bg-[#202020] hover:text-[#F5F5F5]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold flex items-center gap-1.5 text-[#F5F5F5]">
                        <Sparkles className="w-4 h-4 text-[#FFB347]" />
                        <span>Web Speech API (Default)</span>
                      </div>
                      {selectedEngine === "browser" && <CheckCircle className="w-4 h-4 text-[#FFB347]" />}
                    </div>
                    <p className="text-xs text-[#A0A0A0] mt-1">
                      Ultra-low latency browser-native engine with smooth live captioning for English and Amharic.
                    </p>
                  </button>

                  {/* Local Whisper Option */}
                  <button
                    type="button"
                    onClick={() => onChangeEngine("whisper")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedEngine === "whisper"
                        ? "bg-[#252525] border-[#F36B35] ring-2 ring-[#F36B35]/30 text-[#F5F5F5]"
                        : "border-[#2E2E2E] text-[#A0A0A0] hover:bg-[#202020] hover:text-[#F5F5F5]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#F5F5F5]">Local Whisper (Optional Fallback)</div>
                      {selectedEngine === "whisper" && <CheckCircle className="w-4 h-4 text-[#FFB347]" />}
                    </div>
                    <p className="text-xs text-[#A0A0A0] mt-1">
                      Runs locally via optional Whisper fallback for offline environments.
                    </p>
                  </button>
                </div>
              </div>

              {/* Whisper Model Size Selector (only shown when whisper engine selected) */}
              {selectedEngine === "whisper" && (
                <div className="p-3.5 rounded-xl bg-[#202020] border border-[#2E2E2E]">
                  <label className="text-xs font-bold text-[#F5F5F5] block mb-2 uppercase tracking-wide">
                    Whisper Model Size (RAM & Speed)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onChangeWhisperModelSize("base")}
                      className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        whisperModelSize === "base"
                          ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black border-transparent font-black"
                          : "border-[#2E2E2E] text-[#A0A0A0] hover:bg-[#282828] hover:text-[#F5F5F5]"
                      }`}
                    >
                      <div>base (Default)</div>
                      <div className="text-[10px] font-normal opacity-90 mt-0.5">Higher Accuracy (~140MB)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onChangeWhisperModelSize("tiny")}
                      className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        whisperModelSize === "tiny"
                          ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black border-transparent font-black"
                          : "border-[#2E2E2E] text-[#A0A0A0] hover:bg-[#282828] hover:text-[#F5F5F5]"
                      }`}
                    >
                      <div>tiny (Fastest)</div>
                      <div className="text-[10px] font-normal opacity-90 mt-0.5">Lower Latency (~75MB)</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Font Size Selector */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F5F5] mb-2">
                  <Type className="w-4 h-4 text-[#F36B35]" />
                  <span>Transcript Font Size</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {fontOptions.map((opt) => (
                    <button
                      key={opt.size}
                      type="button"
                      onClick={() => onChangeFontSize(opt.size)}
                      className={`px-3 py-2.5 rounded-lg border text-left text-sm font-medium transition-all cursor-pointer ${
                        fontSize === opt.size
                          ? "bg-[#252525] border-[#F36B35] text-[#FFB347] font-bold"
                          : "border-[#2E2E2E] text-[#A0A0A0] hover:bg-[#202020] hover:text-[#F5F5F5]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2E2E2E] text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-r from-[#F36B35] to-[#FFB347] hover:brightness-110 text-black rounded-xl font-extrabold cursor-pointer transition-all shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
