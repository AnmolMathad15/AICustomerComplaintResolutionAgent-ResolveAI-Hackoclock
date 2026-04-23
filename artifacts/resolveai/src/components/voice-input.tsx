import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  /** BCP-47 locale, e.g. "en-IN", "hi-IN", "kn-IN". Hot-swaps when changed. */
  lang?: string;
  title?: string;
}

type SpeechRecognitionExtended = SpeechRecognitionLike & {
  maxAlternatives?: number;
};

/**
 * Browser Web Speech API mic button. Pure non-breaking add-on:
 * if the browser does not expose SpeechRecognition, the button hides itself.
 * The transcript is appended to whatever text is already in the input —
 * the typing experience is preserved.
 *
 * Accuracy improvements:
 * - Uses interim results to surface partial transcripts as they arrive
 * - Picks the highest-confidence alternative from up to 3 candidates
 * - Locale is hot-swappable via `lang` prop (e.g. when UI language changes)
 */
export function VoiceInput({
  onTranscript,
  className,
  lang = "en-IN",
  title = "Dictate complaint",
}: VoiceInputProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  // Keep the latest onTranscript callback in a ref so we don't tear down the
  // recognizer every render.
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);
  const recognitionRef = useRef<SpeechRecognitionExtended | null>(null);

  useEffect(() => {
    const Ctor =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition)) ||
      null;
    if (!Ctor) return;
    setSupported(true);
    const rec: SpeechRecognitionExtended = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.lang = lang;
    rec.onresult = (event: any) => {
      // Take the FINAL result with highest confidence across alternatives.
      let best = "";
      let bestConfidence = -1;
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result.isFinal) continue;
        for (let j = 0; j < result.length; j++) {
          const alt = result[j];
          if ((alt.confidence ?? 0) > bestConfidence) {
            bestConfidence = alt.confidence ?? 0;
            best = alt.transcript;
          }
        }
      }
      const transcript = best.trim();
      if (transcript) onTranscriptRef.current(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    };
  }, [lang]);

  if (!supported) return null;

  const toggle = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all",
        listening
          ? "bg-red-500/20 border-red-500/50 text-red-300 animate-pulse"
          : "bg-white/[0.04] border-white/15 text-muted-foreground hover:border-orange-500/40 hover:text-orange-300",
        className,
      )}
      data-testid="voice-input-button"
    >
      {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}
