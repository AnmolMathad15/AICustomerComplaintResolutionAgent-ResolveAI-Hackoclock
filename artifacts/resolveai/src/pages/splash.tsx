import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { BackgroundAmbient } from "@/components/background-ambient";
import { useT } from "@/components/language-provider";
import { LanguageSelector } from "@/components/language-selector";

export default function Splash() {
  const [, navigate] = useLocation();
  const t = useT();
  const logoUrl = `${import.meta.env.BASE_URL}resolveai-logo.png`;

  useEffect(() => {
    document.title = "ResolveAI | Where AI Meets Real Customer Care";
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <BackgroundAmbient />

      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <img
          src={logoUrl}
          alt="ResolveAI"
          className="splash-logo glow-logo-xl"
          style={{ width: 320, height: "auto" }}
        />

        <p
          className="fade-in-1s mt-6 text-cyan-400 uppercase font-medium"
          style={{ fontSize: 16, letterSpacing: 3 }}
        >
          {t("splash.tagline")}
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="fade-in-15s mt-10 group inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-white font-semibold tracking-wide transition-all"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
            boxShadow: "0 0 20px rgba(124,58,237,0.5)",
          }}
          data-testid="splash-enter"
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 40px rgba(124,58,237,0.85)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.5)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {t("splash.enter")}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
