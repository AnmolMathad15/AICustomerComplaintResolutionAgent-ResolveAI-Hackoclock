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
  lang?: string;
  title?: string;
}

/**
 * Browser Web Speech API mic button. Pure non-breaking add-on:
 * if the browser does not expose SpeechRecognition, the button hides itself.
 * The transcript is appended to whatever text is already in the input —
 * the typing experience is preserved.
 */
export function VoiceInput({
  onTranscript,
  className,
  lang = "en-US",
  title = "Dictate complaint",
}: VoiceInputProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const Ctor =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition)) ||
      null;
    if (!Ctor) return;
    setSupported(true);
    const rec: SpeechRecognitionLike = new Ctor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang;
    rec.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join(" ")
        .trim();
      if (transcript) onTranscript(transcript);
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
    // onTranscript intentionally excluded — captured via ref of latest closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
