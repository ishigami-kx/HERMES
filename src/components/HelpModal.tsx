import React from "react";
import { X, ShieldCheck, Mic, Globe2, Cpu, Info } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-lg bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#2E2E2E] p-5 sm:p-6 text-[#F5F5F5] max-h-[88vh] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E] shrink-0">
            <h2 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FFB347]" />
              Help & Recognition Transparency
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A0A0A0] hover:bg-[#282828] hover:text-[#F5F5F5] cursor-pointer"
              aria-label="Close Help Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-sm text-[#A0A0A0] overflow-y-auto flex-1 pr-1">
            {/* Real-time Chunking Note */}
            <div className="p-3 rounded-xl bg-[#202020] border border-[#F36B35]/30 text-[#F5F5F5]">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-[#FFB347]">
                <Cpu className="w-4 h-4 text-[#F36B35]" />
                <span>On-Device Whisper: Near-Live Audio Chunking</span>
              </div>
              <p className="text-xs leading-relaxed text-[#A0A0A0]">
                Local Whisper operates on CPU in near-real-time using lightweight 2.8s audio windows. If speech is rapid, chunks are deduplicated and synchronized to prevent backlog lag.
              </p>
            </div>

            {/* Language Guide & Amharic Transparency */}
            <div>
              <h3 className="font-bold text-[#F5F5F5] flex items-center gap-1.5 mb-1 font-ethiopic">
                <Globe2 className="w-4 h-4 text-[#FFB347]" /> ቋንቋ መምረጫ እና የአማርኛ ትክክለኛነት (Language & Amharic Notes)
              </h3>
              <p className="font-ethiopic text-xs leading-relaxed text-[#A0A0A0]">
                • <strong>English:</strong> High accuracy using <code>base</code> or <code>tiny</code> models.
                <br />
                • <strong>አማርኛ (Amharic):</strong> The lightweight <code>base</code> model provides functional basic transcription while staying within PC RAM limits (~140MB). Complex vocabulary or noisy backgrounds may show phonetic approximations.
              </p>
            </div>

            {/* Microphone Permission */}
            <div>
              <h3 className="font-bold text-[#F5F5F5] flex items-center gap-1.5 mb-1">
                <Mic className="w-4 h-4 text-[#FFB347]" /> Microphone Access
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                Ensure your browser allows microphone permissions. Audio is processed directly by your local machine without sending data across external networks when using Local Whisper.
              </p>
            </div>

            {/* Honest Privacy Notice */}
            <div className="p-3 rounded-xl bg-[#202020] border border-[#2E2E2E]">
              <div className="flex items-center gap-1.5 font-bold text-[#F5F5F5] mb-1">
                <Info className="w-4 h-4 text-[#FFB347]" />
                <span>Privacy Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#A0A0A0]">
                • <strong>Local Whisper Engine:</strong> 100% on-device CPU execution. No audio recordings or transcripts are stored on or sent to any remote server.
                <br />
                • <strong>Web Speech API:</strong> Audio is routed to Google speech services by the browser.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2E2E2E] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-[#F36B35] to-[#FFB347] hover:brightness-110 text-black font-extrabold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
