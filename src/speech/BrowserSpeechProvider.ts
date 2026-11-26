import type { SpeechProvider, LanguageCode, SpeechProviderEvents, TranscriptSegment } from "../types/speech";

interface IWindowSpeechRecognition extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class BrowserSpeechProvider implements SpeechProvider {
  public id = "browser";
  public name = "Web Speech API (Browser)";
  private recognition: any = null;
  private isListeningActive = false;
  private currentLanguage: LanguageCode = "en-US";
  private events: SpeechProviderEvents | null = null;
  private restartTimeout: any = null;

  public isSupported(): boolean {
    const win = window as unknown as IWindowSpeechRecognition;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public async checkLanguageSupport(lang: LanguageCode): Promise<boolean> {
    if (!this.isSupported()) return false;
    // Both en-US and am-ET are supported by Web Speech in Chromium
    return lang === "en-US" || lang === "am-ET";
  }

  public start(lang: LanguageCode, events: SpeechProviderEvents): void {
    const win = window as unknown as IWindowSpeechRecognition;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      const err = "Web Speech API is not supported in this browser. Please use Chrome/Edge or switch to Local Whisper.";
      events.onError(err);
      events.onStatusChange("error", err);
      return;
    }

    this.currentLanguage = lang;
    this.events = events;
    this.isListeningActive = true;
    this.initAndStartRecognition();
  }

  private initAndStartRecognition(): void {
    if (!this.isListeningActive || !this.events) return;

    const win = window as unknown as IWindowSpeechRecognition;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {
          // ignore
        }
        this.recognition = null;
      }

      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = this.currentLanguage;

      this.recognition.onstart = () => {
        this.events?.onStatusChange("listening", "Listening via Browser Web Speech API...");
      };

      this.recognition.onaudiostart = () => {
        this.events?.onStatusChange("listening", "Microphone audio signal active...");
      };

      this.recognition.onspeechstart = () => {
        this.events?.onStatusChange("processing", "Speech detected...");
      };

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (!res || !res[0]) continue;

          const text = (res[0].transcript || "").trim();
          if (!text) continue;

          const isFinal = Boolean(res.isFinal);

          const segment: TranscriptSegment = {
            id: `seg-browser-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
            text,
            isFinal,
            timestamp: Date.now(),
            language: this.currentLanguage,
          };
          this.events?.onTranscript(segment);
        }
      };

      this.recognition.onerror = (event: any) => {
        const rawCode = event.error || "unknown";
        console.warn("[BrowserSpeechProvider] SpeechRecognition error:", rawCode);

        // 'no-speech' is a normal transient silence event during continuous listening; don't terminate or report fatal error
        if (rawCode === "no-speech") {
          return;
        }

        // 'aborted' is fired when stop/abort is triggered manually; don't report as an application error
        if (rawCode === "aborted") {
          return;
        }

        let userFriendly = `Web Speech error code: [${rawCode}].`;
        switch (rawCode) {
          case "network":
            userFriendly = "Network error [network]: Browser speech service is unreachable or blocked. Local Whisper is available in Settings.";
            break;
          case "not-allowed":
            userFriendly = "Permission error [not-allowed]: Microphone access was denied or blocked in browser permissions.";
            this.isListeningActive = false;
            break;
          case "audio-capture":
            userFriendly = "Audio capture error: No microphone was found or microphone is in use by another app.";
            this.isListeningActive = false;
            break;
          case "language-not-supported":
            userFriendly = `Language '${this.currentLanguage}' is not supported by your browser's speech recognition engine.`;
            break;
          default:
            userFriendly = `Web Speech recognition error: [${rawCode}].`;
            break;
        }

        this.events?.onError(userFriendly);
        this.events?.onStatusChange("error", userFriendly);
      };

      this.recognition.onend = () => {
        if (this.isListeningActive) {
          // Continuous streaming restart without dropping speech
          if (this.restartTimeout) clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (this.isListeningActive) {
              try {
                this.recognition?.start();
              } catch (e) {
                // If restarting existing instance fails, reinitialize
                try {
                  this.initAndStartRecognition();
                } catch (reErr) {
                  console.warn("[BrowserSpeechProvider] Auto-restart failed:", reErr);
                }
              }
            }
          }, 50);
        } else {
          this.events?.onStatusChange("stopped", "Stopped.");
        }
      };

      this.recognition.start();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[BrowserSpeechProvider] start() exception:", e);
      this.events?.onError(`Failed to start Web Speech API: ${msg}`);
      this.events?.onStatusChange("error", msg);
    }
  }

  public stop(): void {
    this.isListeningActive = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }

  public abort(): void {
    this.isListeningActive = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
    }
  }
}
