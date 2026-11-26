import React, { useEffect, useRef, useState, useMemo } from "react";
import type { TranscriptSegment } from "../types/speech";
import { MessageSquareText, FileText, Subtitles, Copy, Download, Trash2, Check, Radio } from "lucide-react";

interface TranscriptPanelProps {
  finalSegments: TranscriptSegment[];
  interimText: string;
  fontSize: "sm" | "md" | "lg" | "xl" | "2xl";
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  isCopied: boolean;
  isListening: boolean;
  activeLanguage: string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  finalSegments,
  interimText,
  fontSize,
  onClear,
  onCopy,
  onDownload,
  isCopied,
  isListening,
  activeLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<"caption" | "log">("caption");
  const logScrollRef = useRef<HTMLDivElement>(null);

  // Filter out any blank/whitespace-only segments
  const validSegments = useMemo(() => {
    return finalSegments.filter((seg) => seg && seg.text && seg.text.trim().length > 0);
  }, [finalSegments]);

  // Rolling live window: last 3-4 segments + interim text for movie-style captions
  const recentSegments = useMemo(() => {
    return validSegments.slice(-4);
  }, [validSegments]);

  // Font sizing map for Movie Captions
  const captionFontSizeClasses: Record<string, string> = {
    sm: "text-xl sm:text-2xl leading-relaxed",
    md: "text-2xl sm:text-3xl leading-relaxed font-semibold",
    lg: "text-3xl sm:text-4xl leading-relaxed font-bold tracking-tight",
    xl: "text-4xl sm:text-5xl leading-tight font-extrabold tracking-tight",
    "2xl": "text-5xl sm:text-6xl leading-tight font-black tracking-tight",
  };

  // Font sizing for Full Lecture Log
  const logFontSizeClasses: Record<string, string> = {
    sm: "text-sm sm:text-base leading-relaxed",
    md: "text-base sm:text-lg leading-relaxed",
    lg: "text-lg sm:text-xl leading-relaxed font-medium",
    xl: "text-xl sm:text-2xl leading-relaxed font-semibold",
    "2xl": "text-2xl sm:text-3xl leading-relaxed font-bold",
  };

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [validSegments, interimText, activeTab]);

  const hasContent = validSegments.length > 0 || Boolean(interimText.trim());

  // Fixed pattern array for the bottom audio-wave visualizer bars (48 bars)
  const visualizerBars = useMemo(() => {
    const pattern = [
      12, 18, 26, 38, 55, 72, 85, 96, 78, 62, 45, 32, 
      20, 35, 58, 80, 100, 88, 70, 50, 36, 24, 16, 28,
      44, 68, 86, 92, 74, 56, 40, 26, 18, 30, 52, 76,
      94, 82, 64, 46, 32, 22, 14, 20, 34, 48, 30, 16
    ];
    return pattern;
  }, []);

  return (
    <div
      aria-label="Live Transcription Workspace"
      className="flex-1 w-full flex flex-col bg-[#141414] rounded-2xl border border-[#282828] shadow-2xl overflow-hidden transition-all duration-300 min-h-[460px] relative"
    >
      {/* View Switcher & Action Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#1C1C1C] border-b border-[#2A2A2A]">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101010] rounded-xl border border-[#242424]">
          <button
            type="button"
            onClick={() => setActiveTab("caption")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "caption"
                ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-xs font-black"
                : "text-[#A0A0A0] hover:text-[#F5F5F5]"
            }`}
          >
            <Subtitles className={`w-4 h-4 ${activeTab === "caption" ? "text-black" : "text-[#FFB347]"}`} />
            <span>Movie-Style Live Captions</span>
            {isListening && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("log")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "log"
                ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-xs font-black"
                : "text-[#A0A0A0] hover:text-[#F5F5F5]"
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === "log" ? "text-black" : "text-[#FFB347]"}`} />
            <span>Saved Lecture Log ({validSegments.length})</span>
          </button>
        </div>

        {/* Action Controls: Copy, Save .txt, Clear */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onCopy}
            disabled={!hasContent}
            className={`px-3 py-1.5 rounded-lg border border-[#2E2E2E] bg-[#161616] text-xs font-semibold flex items-center gap-1.5 transition-all ${
              hasContent
                ? "hover:bg-[#222222] text-[#F5F5F5] hover:border-[#F36B35]/40 cursor-pointer"
                : "opacity-40 cursor-not-allowed text-[#666666]"
            }`}
            title="Copy all transcript text"
            aria-label="Copy transcript"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#FFB347]" />}
            <span>{isCopied ? "Copied" : "Copy"}</span>
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={!hasContent}
            className={`px-3 py-1.5 rounded-lg border border-[#2E2E2E] bg-[#161616] text-xs font-semibold flex items-center gap-1.5 transition-all ${
              hasContent
                ? "hover:bg-[#222222] text-[#F5F5F5] hover:border-[#F36B35]/40 cursor-pointer"
                : "opacity-40 cursor-not-allowed text-[#666666]"
            }`}
            title="Save transcript as .txt"
            aria-label="Save transcript as .txt"
          >
            <Download className="w-3.5 h-3.5 text-[#FFB347]" />
            <span>Save .txt</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!hasContent}
            className={`px-3 py-1.5 rounded-lg border border-[#2E2E2E] bg-[#161616] text-xs font-semibold flex items-center gap-1.5 transition-all ${
              hasContent
                ? "hover:bg-rose-950/40 hover:border-rose-800/60 hover:text-rose-400 text-[#F5F5F5] cursor-pointer"
                : "opacity-40 cursor-not-allowed text-[#666666]"
            }`}
            title="Clear all saved transcript text"
            aria-label="Clear transcript"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "caption" ? (
        /* Movie-Style High-Contrast Cinema Caption Surface */
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-[#0D0D0D] text-[#F5F5F5] select-text relative">
          {/* Subtitle Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-[#F36B35]/15 text-[#FFB347] border border-[#F36B35]/30 text-[11px] font-extrabold uppercase tracking-wider">
                LIVE CAPTION BAR
              </span>
              <span className="text-xs text-[#A0A0A0] font-medium">
                {activeLanguage === "am-ET" ? "ቋንቋ: አማርኛ (Amharic)" : "Language: English (US)"}
              </span>
            </div>

            {isListening && (
              <div className="flex items-center gap-2 text-[#FFB347] text-xs font-bold animate-pulse">
                <Radio className="w-4 h-4 text-[#F36B35]" />
                <span className="tracking-wide">MIC LIVE</span>
              </div>
            )}
          </div>

          {/* Central Captions Surface */}
          <div className="flex-1 flex flex-col justify-center my-8 min-h-[220px]">
            {!hasContent ? (
              /* Empty State matching Reference Image 2 */
              <div className="flex flex-col items-center justify-center text-center py-8">
                {/* Custom Subtitle Lines Emblem */}
                <div className="w-16 h-12 rounded-xl border-2 border-[#FFB347]/50 bg-[#1A1A1A] p-2 flex flex-col justify-center gap-1.5 mb-4 shadow-lg shadow-[#F36B35]/10">
                  <div className="w-3/4 h-1.5 bg-[#FFB347] rounded-full mx-auto" />
                  <div className="w-1/2 h-1.5 bg-[#F36B35] rounded-full mx-auto" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#F5F5F5] tracking-tight mb-2">
                  Your captions will appear here.
                </h3>
                <p className="text-sm font-ethiopic text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                  Click <strong>Start Listening</strong> to begin real-time transcription.
                </p>
              </div>
            ) : (
              /* Live Streaming High-Contrast Captions */
              <div className={`space-y-4 font-ethiopic ${captionFontSizeClasses[fontSize]} text-center sm:text-left`}>
                {/* Earlier phrases in muted contrast */}
                {recentSegments.slice(0, -1).map((seg) => (
                  <p key={seg.id} className="text-[#A0A0A0] transition-opacity duration-300">
                    {seg.text}
                  </p>
                ))}

                {/* Most recent finalized segment in luminous amber */}
                {recentSegments.length > 0 && (
                  <p className="text-[#FFB347] font-semibold drop-shadow-md transition-all duration-200">
                    {recentSegments[recentSegments.length - 1].text}
                  </p>
                )}

                {/* Live Interim Streaming speech */}
                {interimText.trim() && (
                  <p className="text-[#F36B35] italic underline decoration-[#F36B35]/50 underline-offset-4 animate-pulse">
                    {interimText}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Subtitle Footer Switch & Integrated Audio-Wave Equalizer */}
          <div className="pt-3 border-t border-[#222222] flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-[#A0A0A0]">
              <span className="font-mono text-[11px] tracking-wider uppercase text-[#888888]">
                Rolling high-contrast subtitles
              </span>
              <button
                onClick={() => setActiveTab("log")}
                className="hover:text-[#FFB347] underline underline-offset-2 cursor-pointer transition-colors font-medium"
              >
                Switch to Full Transcript Log →
              </button>
            </div>

            {/* Bottom Audio Wave Visualizer matching Reference Image 2 */}
            <div
              aria-hidden="true"
              className="w-full h-8 flex items-end justify-center gap-1 sm:gap-1.5 px-2 overflow-hidden select-none"
            >
              {visualizerBars.map((baseH, idx) => {
                // When listening, bars animate dynamically between 15% and baseH%
                // When stopped, bars sit calmly at low resting height
                const barHeight = isListening ? `${Math.max(15, baseH * 0.75)}%` : "12%";
                return (
                  <div
                    key={idx}
                    className={`w-1 sm:w-1.5 rounded-full transition-all ${
                      isListening
                        ? "bg-gradient-to-t from-[#F36B35] to-[#FFB347] animate-pulse"
                        : "bg-[#282828]"
                    }`}
                    style={{
                      height: barHeight,
                      animationDuration: isListening ? `${400 + ((idx * 37) % 600)}ms` : "0ms",
                      animationDelay: isListening ? `${(idx * 25) % 300}ms` : "0ms",
                      boxShadow: isListening ? "0 0 4px rgba(243, 107, 53, 0.4)" : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Saved Lecture Session Transcript Log - Continuous Document View */
        <div
          ref={logScrollRef}
          className="flex-1 p-5 sm:p-7 overflow-y-auto max-h-[60vh] font-ethiopic bg-[#0D0D0D] select-text"
        >
          {validSegments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#A0A0A0]">
              <MessageSquareText className="w-12 h-12 mb-3 stroke-1 text-[#444444]" />
              <h4 className="text-lg font-bold text-[#F5F5F5] mb-1">
                No Lecture History Recorded
              </h4>
              <p className="text-xs text-[#A0A0A0] max-w-sm leading-relaxed">
                Every sentence spoken during this session is saved here automatically as a continuous lecture document.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-2">
              <div className="mb-4 pb-3 border-b border-[#222222] flex items-center justify-between text-xs text-[#A0A0A0] font-sans">
                <span className="font-semibold text-[#FFB347] uppercase tracking-wider text-[11px]">
                  Continuous Lecture Transcript ({validSegments.length} segments)
                </span>
                <span>
                  Started {new Date(validSegments[0].timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className={`${logFontSizeClasses[fontSize]} text-[#F5F5F5] leading-relaxed space-y-3`}>
                <p className="whitespace-normal break-words leading-loose tracking-wide">
                  {validSegments.map((seg) => (
                    <span key={seg.id} className="inline">
                      {seg.text.trim()}{" "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
