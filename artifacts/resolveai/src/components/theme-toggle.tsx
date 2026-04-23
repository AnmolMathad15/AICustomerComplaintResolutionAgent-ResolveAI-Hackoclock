import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-testid="theme-toggle"
      className="relative w-9 h-9 rounded-full glass flex items-center justify-center hover:border-primary/40 transition-all"
    >
      <Sun
        className={`w-4 h-4 absolute transition-all ${
          isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100 text-amber-400"
        }`}
      />
      <Moon
        className={`w-4 h-4 absolute transition-all ${
          isDark ? "opacity-100 rotate-0 scale-100 text-indigo-300" : "opacity-0 rotate-90 scale-50"
        }`}
      />
    </button>
  );
}
