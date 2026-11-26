import type { SpeechProvider, LanguageCode, SpeechProviderEvents, RecognitionStatus, TranscriptSegment } from "../types/speech";

export class SpeechRecognitionManager {
  private currentProvider: SpeechProvider;
  private status: RecognitionStatus = "ready";
  private activeLanguage: LanguageCode = "en-US";
  private eventHandlers: Partial<SpeechProviderEvents> = {};

  constructor(initialProvider: SpeechProvider) {
    this.currentProvider = initialProvider;
  }

  public setProvider(provider: SpeechProvider): void {
    if (this.status === "listening" || this.status === "processing") {
      this.stop();
    }
    this.currentProvider = provider;
  }

  public getProvider(): SpeechProvider {
    return this.currentProvider;
  }

  public getStatus(): RecognitionStatus {
    return this.status;
  }

  public getLanguage(): LanguageCode {
    return this.activeLanguage;
  }

  public setHandlers(handlers: Partial<SpeechProviderEvents>): void {
    this.eventHandlers = handlers;
  }

  public async start(language: LanguageCode = this.activeLanguage): Promise<void> {
    this.activeLanguage = language;
    if (!this.currentProvider.isSupported()) {
      this.updateStatus("error", `${this.currentProvider.name} is not supported in this browser.`);
      return;
    }

    const supportsLang = await this.currentProvider.checkLanguageSupport(language);
    if (!supportsLang) {
      this.updateStatus(
        "error",
        `Language '${language}' is not supported by ${this.currentProvider.name}.`
      );
    }

    const events: SpeechProviderEvents = {
      onStatusChange: (status, message) => this.updateStatus(status, message),
      onTranscript: (segment: TranscriptSegment) => {
        if (this.eventHandlers.onTranscript) {
          this.eventHandlers.onTranscript(segment);
        }
      },
      onError: (err: string) => {
        this.updateStatus("error", err);
        if (this.eventHandlers.onError) {
          this.eventHandlers.onError(err);
        }
      },
    };

    try {
      await this.currentProvider.start(language, events);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateStatus("error", msg);
    }
  }

  public stop(): void {
    this.currentProvider.stop();
    this.updateStatus("stopped");
  }

  public clear(): void {
    if (this.status === "listening") {
      this.stop();
    }
    this.updateStatus("ready");
  }

  private updateStatus(status: RecognitionStatus, message?: string): void {
    this.status = status;
    if (this.eventHandlers.onStatusChange) {
      this.eventHandlers.onStatusChange(status, message);
    }
  }
}
