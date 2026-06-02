// Text-to-Speech utility using browser Web Speech API
// Free, works offline, supports multiple voices/accents

export function speak(text: string, options?: {
  rate?: number;    // 0.5 - 2.0 (default 0.9 for IELTS pace)
  pitch?: number;   // 0 - 2
  lang?: string;    // 'en-GB' for British accent
  voice?: string;   // specific voice name
  onEnd?: () => void;
}): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate ?? 0.9;
  utterance.pitch = options?.pitch ?? 1;
  utterance.lang = options?.lang ?? "en-GB";

  // Try to find a British English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v =>
    v.lang === "en-GB" && (v.name.includes("Female") || v.name.includes("Google"))
  ) || voices.find(v => v.lang === "en-GB") || voices.find(v => v.lang.startsWith("en"));

  if (preferredVoice) utterance.voice = preferredVoice;
  if (options?.onEnd) utterance.onend = options.onEnd;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
}
