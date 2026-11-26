import React from "react";
import { X, Heart, Globe2, ShieldCheck, Cpu } from "lucide-react";
import { HermesLogo } from "./HermesLogo";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#181818] rounded-2xl shadow-2xl border border-[#2E2E2E] p-6 text-[#F5F5F5]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2E2E2E]">
            <div className="flex items-center gap-3">
              <HermesLogo size={38} className="w-9 h-9" />
              <div>
                <h2 className="text-xl font-black text-[#F5F5F5] tracking-wide flex items-center gap-2">
                  <span>HERMES</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F36B35]/20 text-[#FFB347] font-semibold border border-[#F36B35]/30">
                    Solar Flare v2.0
                  </span>
                </h2>
                <p className="text-xs text-[#A0A0A0]">DeafAssist Classroom & Lecture Accessibility</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A0A0A0] hover:bg-[#282828] hover:text-[#F5F5F5] cursor-pointer"
              aria-label="Close About Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-4 space-y-4 text-sm text-[#A0A0A0]">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#202020] to-[#161616] border border-[#F36B35]/30">
              <p className="text-[#FFB347] font-serif italic text-base mb-1">
                &ldquo;Bridging voices, breaking barriers.&rdquo;
              </p>
              <p className="text-xs text-[#D4D4D4] leading-relaxed">
                Inspired by Hermes, the ancient Greek messenger who carried words across realms, HERMES DeafAssist translates spoken lectures into clear, readable typography in real time for deaf and hard-of-hearing students.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs">
                <Globe2 className="w-4 h-4 text-[#FFB347] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F5F5]">Bilingual Recognition:</strong> First-class support for English (US) and Amharic (አማርኛ), making higher education accessible across linguistic boundaries.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <Cpu className="w-4 h-4 text-[#FFB347] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F5F5]">Dual-Engine Architecture:</strong> Native Web Speech API for zero-latency in-browser recognition, paired with an optional local on-device Whisper model.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#FFB347] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F5F5]">Student Privacy:</strong> High contrast, distraction-free movie-style cinema captions designed for academic focus.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <Heart className="w-4 h-4 text-[#F36B35] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F5F5]">Inclusive Learning:</strong> Includes a built-in bilingual Science & Physics Glossary to assist STEM learners.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2E2E2E] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-[#F36B35] to-[#FFB347] hover:brightness-110 text-black font-extrabold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
