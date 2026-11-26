import React from "react";
import { SlidersHorizontal, HelpCircle, BookOpen } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenGlossary: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenHelp, onOpenGlossary }) => {
  return (
    <header className="w-full bg-[#181818]/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 py-3 sm:px-6 transition-colors shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* HERMES geometric wing / signal SVG mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F36B35] to-[#FFB347] p-0.5 shadow-lg shadow-[#F36B35]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#141414] rounded-[10px] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#FFB347]"
              >
                {/* Geometric wing / herald signal crest */}
                <path
                  d="M3 13L12 4L11 11L21 8L12 20L13 13L3 13Z"
                  fill="url(#solar-gradient)"
                  stroke="#FFB347"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="solar-gradient" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F36B35" />
                    <stop offset="1" stopColor="#FFB347" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-[#F5F5F5] uppercase">
                HERMES
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F36B35]/15 text-[#FFB347] border border-[#F36B35]/30 tracking-widest uppercase">
                v2.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A0A0A0] font-medium">
              Making Every Lecture Visible. • ንግግርን በቀላሉ ተመልከት
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Physics & Science Glossary Button */}
          <button
            onClick={onOpenGlossary}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[#2E2E2E] bg-[#202020] hover:bg-[#282828] text-[#F5F5F5] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#F36B35] cursor-pointer"
            aria-label="Open Science Terminology Glossary"
            title="Physics & Science Terms (English ↔ አማርኛ)"
          >
            <BookOpen className="w-4 h-4 text-[#F36B35]" />
            <span className="hidden md:inline">Science Glossary</span>
          </button>

          {/* Help Modal Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[#2E2E2E] bg-[#202020] hover:bg-[#282828] text-[#F5F5F5] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#F36B35] cursor-pointer"
            aria-label="Open Help & Privacy Guide"
            title="Help & Guides"
          >
            <HelpCircle className="w-4 h-4 text-[#F36B35]" />
            <span className="hidden md:inline">Help</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[#2E2E2E] bg-[#202020] hover:bg-[#282828] text-[#F5F5F5] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#F36B35] cursor-pointer"
            aria-label="Open Settings"
            title="Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#F36B35]" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
