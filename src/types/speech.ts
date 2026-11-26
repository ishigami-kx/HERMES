export type LanguageCode = "en-US" | "am-ET";

export type RecognitionStatus = "ready" | "listening" | "processing" | "stopped" | "error";

export type EngineType = "whisper" | "browser";
export type WhisperModelSize = "tiny" | "base";

export interface TranscriptSegment {
  id: string;
  text: string;
  isFinal: boolean;
  timestamp: number;
  language: LanguageCode;
}

export interface SpeechProviderEvents {
  onStatusChange: (status: RecognitionStatus, message?: string) => void;
  onTranscript: (segment: TranscriptSegment) => void;
  onError: (error: string) => void;
}

export interface SpeechProvider {
  id: string;
  name: string;
  isSupported(): boolean;
  checkLanguageSupport(lang: LanguageCode): Promise<boolean> | boolean;
  start(lang: LanguageCode, events: SpeechProviderEvents): Promise<void> | void;
  stop(): void;
  abort(): void;
}
