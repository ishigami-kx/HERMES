import React from "react";
import { HermesLogo } from "./HermesLogo";
import { Home, Activity, Settings, Info } from "lucide-react";

export type NavTab = "home" | "transcription";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onOpenAbout,
}) => {
  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside
        className="hidden md:flex flex-col justify-between w-60 lg:w-64 shrink-0 bg-[#0E0E0E] border-r border-[#242424] min-h-screen p-5 sticky top-0 h-screen z-30 select-none"
        aria-label="Main Navigation Sidebar"
      >
        <div className="flex flex-col gap-8">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center gap-2 pt-2">
            <div className="relative group cursor-pointer" onClick={() => onSelectTab("home")}>
              <HermesLogo size={52} className="w-13 h-13 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute -inset-1 rounded-full bg-[#F36B35]/20 blur-md -z-10 group-hover:bg-[#F36B35]/35 transition-colors" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-widest text-[#F5F5F5] uppercase leading-none font-sans">
                HERMES
              </h1>
              <p className="text-xs font-semibold text-[#FFB347] tracking-wider mt-1 opacity-90">
                DeafAssist
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2" aria-label="Desktop Navigation Links">
            {/* Home */}
            <button
              type="button"
              onClick={() => onSelectTab("home")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                currentTab === "home"
                  ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-lg shadow-[#F36B35]/20 font-black"
                  : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#181818]"
              }`}
              aria-current={currentTab === "home" ? "page" : undefined}
            >
              <Home className={`w-5 h-5 ${currentTab === "home" ? "text-black stroke-[2.5]" : "text-[#A0A0A0]"}`} />
              <span>Home</span>
            </button>

            {/* Transcription */}
            <button
              type="button"
              onClick={() => onSelectTab("transcription")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                currentTab === "transcription"
                  ? "bg-gradient-to-r from-[#F36B35] to-[#FFB347] text-black shadow-lg shadow-[#F36B35]/20 font-black"
                  : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#181818]"
              }`}
              aria-current={currentTab === "transcription" ? "page" : undefined}
            >
              <Activity
                className={`w-5 h-5 ${currentTab === "transcription" ? "text-black stroke-[2.5]" : "text-[#A0A0A0]"}`}
              />
              <span>Transcription</span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#181818] transition-all duration-200 cursor-pointer"
            >
              <Settings className="w-5 h-5 text-[#A0A0A0]" />
              <span>Settings</span>
            </button>

            {/* About */}
            <button
              type="button"
              onClick={onOpenAbout}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#181818] transition-all duration-200 cursor-pointer"
            >
              <Info className="w-5 h-5 text-[#A0A0A0]" />
              <span>About</span>
            </button>
          </nav>
        </div>

        {/* Brand Mission Statement */}
        <div className="pt-6 border-t border-[#222222] px-2 text-left">
          <p className="text-xs italic font-serif leading-relaxed text-[#FFB347]/80">
            &ldquo;Bridging voices, breaking barriers.&rdquo;
          </p>
          <div className="mt-2 text-[10px] text-[#666666] font-mono tracking-wider">
            v2.0 • SOLAR FLARE
          </div>
        </div>
      </aside>

      {/* Mobile Top App Bar with Navigation Pills */}
      <div className="md:hidden w-full bg-[#0E0E0E] border-b border-[#242424] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <HermesLogo size={32} className="w-8 h-8" />
          <div>
            <span className="text-base font-black tracking-wider text-[#F5F5F5] uppercase">
              HERMES
            </span>
            <span className="ml-1.5 text-[10px] text-[#FFB347] font-bold">
              DeafAssist
            </span>
          </div>
        </div>

        {/* Mobile Action Links */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectTab("home")}
            className={`p-2 rounded-lg text-xs font-bold ${
              currentTab === "home" ? "bg-[#F36B35] text-black" : "text-[#A0A0A0]"
            }`}
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("transcription")}
            className={`p-2 rounded-lg text-xs font-bold ${
              currentTab === "transcription" ? "bg-[#F36B35] text-black" : "text-[#A0A0A0]"
            }`}
            title="Transcription"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-xs font-bold text-[#A0A0A0]"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenAbout}
            className="p-2 rounded-lg text-xs font-bold text-[#A0A0A0]"
            title="About"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
