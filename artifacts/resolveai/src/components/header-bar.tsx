import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { CompanySwitcher } from "@/components/company-switcher";
import { useT } from "@/components/language-provider";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function HeaderBar() {
  const t = useT();
  const now = useClock();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between glass-strong border-b border-white/8 relative z-10">
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{date}</span>
          <span className="font-mono text-sm text-foreground tabular-nums tracking-wider">{time}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <CompanySwitcher />
        <LanguageSelector />

        <button
          aria-label={t("header.notifications")}
          className="relative w-9 h-9 rounded-full glass flex items-center justify-center hover:border-primary/40 transition-all"
          data-testid="header-notifications"
        >
          <Bell className="w-4 h-4 text-foreground/80" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ping-dot" />
        </button>

        <div className="flex items-center gap-2 pl-2 md:pl-3 md:border-l border-white/8">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm glow-orange">
            JD
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">John Doe</span>
            <span className="text-[10px] text-muted-foreground">{t("header.role")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
