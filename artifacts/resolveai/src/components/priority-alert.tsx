import { useEffect, useRef, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "resolveai.priorityAlert.enabled";

/**
 * Plays a short two-tone alert via the Web Audio API. No asset files —
 * generates the sound at runtime so it works offline / out-of-the-box.
 */
function playAlertTone() {
  try {
    const Ctx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();
    const now = ctx.currentTime;

    const beep = (start: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    beep(now, 880, 0.18);
    beep(now + 0.22, 1320, 0.22);

    setTimeout(() => ctx.close().catch(() => {}), 900);
  } catch {
    /* silent no-op */
  }
}

interface PriorityAlertProps {
  /** Latest list of complaints from the polling query. */
  complaints: Array<{
    ticketId: string;
    sentiment: string;
    severity: string;
    createdAt: string;
  }>;
}

/**
 * Watches the polled complaint stream and chimes when a NEW high-priority
 * (negative sentiment) complaint appears. Includes a bell toggle that the
 * admin can mute. State persists in localStorage. First mount seeds the
 * "seen" set so historical tickets do NOT trigger a chime.
 */
export function PriorityAlert({ complaints }: PriorityAlertProps) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(STORAGE_KEY) !== "0";
  });
  const seenRef = useRef<Set<string>>(new Set());
  const seededRef = useRef(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!complaints) return;

    // Seed once with whatever was on screen first — avoids chiming for the
    // entire historical backlog on initial page load.
    if (!seededRef.current) {
      complaints.forEach((c) => seenRef.current.add(c.ticketId));
      seededRef.current = true;
      return;
    }

    const newOnes = complaints.filter((c) => !seenRef.current.has(c.ticketId));
    newOnes.forEach((c) => seenRef.current.add(c.ticketId));

    const highPriorityNew = newOnes.filter(
      (c) => c.sentiment === "negative" || c.severity === "HIGH",
    );

    if (highPriorityNew.length > 0 && enabled) {
      playAlertTone();
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [complaints, enabled]);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={enabled ? "Mute high-priority chime" : "Enable high-priority chime"}
      aria-label={enabled ? "Mute alerts" : "Enable alerts"}
      data-testid="priority-alert-toggle"
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3 rounded-full border text-xs transition-all",
        enabled
          ? "border-orange-500/40 text-orange-300 bg-orange-500/10 hover:border-orange-500/60"
          : "border-white/10 text-muted-foreground hover:border-white/20",
        pulse && "animate-pulse glow-orange",
      )}
    >
      {enabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
      <span>{enabled ? "Alerts on" : "Muted"}</span>
    </button>
  );
}
