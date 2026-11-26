import type { SpeechProvider, LanguageCode, SpeechProviderEvents, TranscriptSegment, WhisperModelSize } from "../types/speech";

export class WhisperSpeechProvider implements SpeechProvider {
  public id = "whisper";
  public name = "Local Whisper (On-Device)";
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private isListeningActive = false;
  private isRequestInFlight = false;
  private currentLanguage: LanguageCode = "en-US";
  private eventHandlers: SpeechProviderEvents | null = null;
  private activeModelSize: WhisperModelSize = "base";
  private recentPhrases: string[] = []; // rolling history to filter duplicate loops
  private backendUrl = "http://127.0.0.1:8000";
  private timerHandle: any = null;

  constructor(modelSize: WhisperModelSize = "base", backendUrl: string = "http://127.0.0.1:8000") {
    this.activeModelSize = modelSize;
    this.backendUrl = backendUrl;
  }

  public setModelSize(size: WhisperModelSize) {
    this.activeModelSize = size;
  }

  public getModelSize(): WhisperModelSize {
    return this.activeModelSize;
  }

  public isSupported(): boolean {
    return Boolean(
      typeof window !== "undefined" &&
      navigator.mediaDevices &&
      "getUserMedia" in navigator.mediaDevices &&
      typeof window.MediaRecorder !== "undefined"
    );
  }

  public checkLanguageSupport(_lang: LanguageCode): boolean {
    return true;
  }

  public async checkBackendHealth(): Promise<{ healthy: boolean; details?: any }> {
    try {
      const res = await fetch(`${this.backendUrl}/health`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        return { healthy: true, details: data };
      }
      return { healthy: false };
    } catch {
      return { healthy: false };
    }
  }

  public async start(lang: LanguageCode, events: SpeechProviderEvents): Promise<void> {
    this.currentLanguage = lang;
    this.eventHandlers = events;
    this.recentPhrases = [];
    this.isRequestInFlight = false;

    if (!this.isSupported()) {
      const err = "MediaRecorder is not supported in this browser. Please use Chrome, Edge, or Firefox.";
      events.onError(err);
      events.onStatusChange("error", err);
      return;
    }

    const health = await this.checkBackendHealth();
    if (!health.healthy) {
      const err = "Cannot connect to Local Whisper backend at http://127.0.0.1:8000. Please ensure the backend is running.";
      events.onError(err);
      events.onStatusChange("error", err);
      return;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.isListeningActive = true;
      const langLabel = this.currentLanguage === "am-ET" ? "አማርኛ" : "English";
      events.onStatusChange("listening", `Listening [${langLabel}] via Local Whisper (${this.activeModelSize}, CPU)...`);

      this.recordNextChunk();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      let friendlyMsg = `Microphone error: ${msg}`;
      if (msg.includes("Permission denied") || msg.includes("NotAllowedError")) {
        friendlyMsg = "Microphone access denied [not-allowed]. Please enable microphone permissions in your browser.";
      }
      events.onError(friendlyMsg);
      events.onStatusChange("error", friendlyMsg);
    }
  }

  private recordNextChunk() {
    if (!this.mediaStream || !this.isListeningActive) return;

    let mimeType = "audio/webm;codecs=opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
    }

    const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
    const recordedChunks: Blob[] = [];

    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        if (!this.isListeningActive) return;

        // Anti-snowball logic:
        // If the CPU backend is still processing the previous chunk, drop the current chunk
        // rather than queueing a snowballing backlog.
        if (this.isRequestInFlight) {
          console.log("[Whisper] Prior chunk still processing on CPU; skipping chunk to maintain real-time sync.");
        } else if (recordedChunks.length > 0) {
          const blob = new Blob(recordedChunks, { type: recordedChunks[0]?.type || "audio/webm" });
          if (blob.size >= 2048) {
            // Process chunk asynchronously without blocking recorder cycle
            this.sendChunkToWhisper(blob);
          }
        }

        // Loop continuous recording
        if (this.isListeningActive && this.mediaStream?.active) {
          this.recordNextChunk();
        }
      };

      // 2.8-second chunk interval: balanced for responsive turns and low CPU lag
      this.mediaRecorder.start();
      this.timerHandle = setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          try {
            this.mediaRecorder.stop();
          } catch {
            // ignore
          }
        }
      }, 2800);

    } catch (e: unknown) {
      console.error("[WhisperSpeechProvider] Recorder error:", e);
      if (this.isListeningActive) {
        setTimeout(() => this.recordNextChunk(), 1000);
      }
    }
  }

  private async sendChunkToWhisper(audioBlob: Blob): Promise<void> {
    this.isRequestInFlight = true;

    try {
      const langLabel = this.currentLanguage === "am-ET" ? "አማርኛ" : "English";
      this.eventHandlers?.onStatusChange("processing", `Transcribing [${langLabel}] chunk (${this.activeModelSize})...`);

      const formData = new FormData();
      formData.append("file", audioBlob, "chunk.webm");
      formData.append("language", this.currentLanguage === "am-ET" ? "am" : "en");
      formData.append("model_size", this.activeModelSize);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout to prevent hanging

      const response = await fetch(`${this.backendUrl}/transcribe`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Whisper server responded with HTTP ${response.status}`);
      }

      const result = await response.json();
      const rawText = (result.text || "").trim();

      if (rawText) {
        const cleaned = this.deduplicatePhrase(rawText);
        if (cleaned) {
          const segment: TranscriptSegment = {
            id: `seg-whisper-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            text: cleaned,
            isFinal: true,
            timestamp: Date.now(),
            language: this.currentLanguage,
          };
          this.eventHandlers?.onTranscript(segment);
        }
      }

      if (this.isListeningActive) {
        this.eventHandlers?.onStatusChange(
          "listening",
          `Listening [${langLabel}] via Local Whisper (${this.activeModelSize}, CPU)...`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[WhisperSpeechProvider] Transcribe request error:", msg);
      if (this.isListeningActive) {
        this.eventHandlers?.onStatusChange("listening", `Listening via Local Whisper (ready)...`);
      }
    } finally {
      this.isRequestInFlight = false;
    }
  }

  // Deduplication filter: eliminates repeat hallucinations and consecutive identical echoes
  private deduplicatePhrase(phrase: string): string | null {
    const normalized = phrase.toLowerCase().replace(/[.,!?;: ]+/g, " ").trim();
    if (!normalized || normalized.length < 2) return null;

    // Check against last 3 emitted phrases
    for (const recent of this.recentPhrases.slice(-3)) {
      if (recent === normalized) return null;
      // Also catch if the chunk is an exact sub-slice or echo
      if (recent.endsWith(normalized) || normalized.endsWith(recent)) {
        if (Math.abs(recent.length - normalized.length) < 3) return null;
      }
    }

    this.recentPhrases.push(normalized);
    if (this.recentPhrases.length > 20) {
      this.recentPhrases.shift();
    }
    return phrase;
  }

  public stop(): void {
    this.isListeningActive = false;
    this.isRequestInFlight = false;
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
  }

  public abort(): void {
    this.stop();
  }
}
