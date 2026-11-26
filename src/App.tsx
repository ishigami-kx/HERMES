import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { LanguageCode, RecognitionStatus, TranscriptSegment, EngineType, WhisperModelSize } from "./types/speech";
import { BrowserSpeechProvider } from "./speech/BrowserSpeechProvider";
import { WhisperSpeechProvider } from "./speech/WhisperSpeechProvider";
import { SpeechRecognitionManager } from "./speech/SpeechRecognitionManager";
import { Sidebar, type NavTab } from "./components/Sidebar";
import { HeroSection } from "./components/HeroSection";
import { SecondaryToolbar } from "./components/SecondaryToolbar";
import { TranscriptPanel } from "./components/TranscriptPanel";
import { ControlBar } from "./components/ControlBar";
import { FeatureStrip } from "./components/FeatureStrip";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { HelpModal } from "./components/HelpModal";
import { ScienceGlossaryModal } from "./components/ScienceGlossaryModal";
import { AboutModal } from "./components/AboutModal";

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en-US");
  const [status, setStatus] = useState<RecognitionStatus>("ready");
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [finalSegments, setFinalSegments] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState<string>("");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl" | "2xl">("lg");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Engine configuration: default to Browser Web Speech API on startup
  const [selectedEngine, setSelectedEngine] = useState<EngineType>("browser");
  const [whisperModelSize, setWhisperModelSize] = useState<WhisperModelSize>("base");
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  const browserProvider = useMemo(() => new BrowserSpeechProvider(), []);
  const whisperProvider = useMemo(() => new WhisperSpeechProvider(whisperModelSize), [whisperModelSize]);

  const activeProvider = useMemo(() => {
    return selectedEngine === "whisper" ? whisperProvider : browserProvider;
  }, [selectedEngine, whisperProvider, browserProvider]);

  const managerRef = useRef<SpeechRecognitionManager | null>(null);

  // Check backend health periodically
  const checkHealth = useCallback(async () => {
    const res = await whisperProvider.checkBackendHealth();
    setBackendOnline(res.healthy);
  }, [whisperProvider]);

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, 10000);
    return () => clearInterval(timer);
  }, [checkHealth]);

  const lastCommittedTextRef = useRef<string>("");

  // Sync manager when active provider changes
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setProvider(activeProvider);
    } else {
      managerRef.current = new SpeechRecognitionManager(activeProvider);
    }

    managerRef.current.setHandlers({
      onStatusChange: (newStatus, msg) => {
        setStatus(newStatus);
        setStatusMessage(msg);
      },
      onTranscript: (segment) => {
        const trimmed = (segment.text || "").trim();
        // Enforce strict non-empty check: never store blank or whitespace-only items
        if (!trimmed) return;

        if (segment.isFinal) {
          // Prevent exact duplicate back-to-back commits from engine restart cycles while preserving genuine repetitions across speech
          if (trimmed !== lastCommittedTextRef.current) {
            lastCommittedTextRef.current = trimmed;
            setFinalSegments((prev) => [...prev, { ...segment, text: trimmed }]);
          }
          setInterimText("");
        } else {
          setInterimText(trimmed);
        }
      },
      onError: (err) => {
        setStatus("error");
        setStatusMessage(err);
      },
    });

    return () => {
      managerRef.current?.stop();
    };
  }, [activeProvider]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleStart = async () => {
    if (managerRef.current) {
      await managerRef.current.start(currentLanguage);
    }
  };

  const handleStop = () => {
    if (managerRef.current) {
      managerRef.current.stop();
      setInterimText("");
    }
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    if (status === "listening" || status === "processing") {
      handleStop();
    }
  };

  const handleChangeEngine = (engine: EngineType) => {
    if (status === "listening" || status === "processing") {
      handleStop();
    }
    setSelectedEngine(engine);
  };

  const handleChangeWhisperModelSize = async (size: WhisperModelSize) => {
    setWhisperModelSize(size);
    whisperProvider.setModelSize(size);
    try {
      await fetch("http://127.0.0.1:8000/switch-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_size: size }),
      });
    } catch {
      // ignore if backend offline
    }
  };

  const handleClear = () => {
    setFinalSegments([]);
    setInterimText("");
  };

  const fullTranscriptText = useMemo(() => {
    return finalSegments
      .filter((s) => s.text && s.text.trim().length > 0)
      .map((s) => s.text.trim())
      .join(" ");
  }, [finalSegments]);

  const handleCopy = async () => {
    if (!fullTranscriptText) return;
    try {
      await navigator.clipboard.writeText(fullTranscriptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!fullTranscriptText) return;
    const blob = new Blob([fullTranscriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deafassist-lecture-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isListening = status === "listening" || status === "processing";

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (tab === "transcription") {
      const el = document.getElementById("hermes-workspace-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#101010] text-[#F5F5F5] font-ethiopic antialiased relative selection:bg-[#F36B35]/30 selection:text-white">
      {/* Classical Mountain Temple Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-cover bg-top bg-no-repeat opacity-35"
        style={{ backgroundImage: "url('/hermes-temple-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Smooth Dark Scrim ensuring temple & clouds are noticeably visible while reading contrast remains crisp */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-radial from-transparent via-[#101010]/55 to-[#101010]/90"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#101010]/40 to-[#101010]/85"
        aria-hidden="true"
      />

      {/* Subtle atmospheric wave glow background */}
      <div className="solar-ambient-glow" aria-hidden="true" />

      {/* A. Left Permanent Vertical Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-4 sm:gap-5">
          {/* B. Main Hero / Branding Section */}
          <div id="hermes-hero-section">
            <HeroSection isListening={isListening} />
          </div>

          {/* Secondary Header / Utility & Status Toolbar */}
          <SecondaryToolbar
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            status={status}
            statusMessage={statusMessage}
            selectedEngine={selectedEngine}
            whisperModelSize={whisperModelSize}
            backendOnline={backendOnline}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* C. Main Live Transcription Workspace */}
          <div id="hermes-workspace-section">
            <TranscriptPanel
              finalSegments={finalSegments}
              interimText={interimText}
              fontSize={fontSize}
              onClear={handleClear}
              onCopy={handleCopy}
              onDownload={handleDownload}
              isCopied={isCopied}
              isListening={isListening}
              activeLanguage={currentLanguage}
            />
          </div>

          {/* D. Transcription Controls */}
          <ControlBar
            status={status}
            onStart={handleStart}
            onStop={handleStop}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* E. Feature Strip */}
          <FeatureStrip />
        </main>
      </div>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        selectedEngine={selectedEngine}
        onChangeEngine={handleChangeEngine}
        whisperModelSize={whisperModelSize}
        onChangeWhisperModelSize={handleChangeWhisperModelSize}
        backendOnline={backendOnline}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Science & Physics Glossary Reference Modal */}
      <ScienceGlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
