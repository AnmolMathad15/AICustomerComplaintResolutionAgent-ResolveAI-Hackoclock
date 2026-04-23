import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Brain, ShieldCheck, TrendingUp } from "lucide-react";
import { useT } from "@/components/language-provider";
import { LanguageSelector } from "@/components/language-selector";

export default function Splash() {
  const [, navigate] = useLocation();
  const t = useT();
  const logoUrl = `${import.meta.env.BASE_URL}resolveai-logo.png`;

  useEffect(() => {
    document.title = "ResolveAI | Where AI Meets Real Customer Care";
  }, []);

  // Pre-generate floating particles around logo
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        angle: (i / 18) * Math.PI * 2,
        radius: 140 + Math.random() * 80,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 4,
      })),
    []
  );

  const features = [
    { icon: Zap, label: "AI Powered Resolutions" },
    { icon: Brain, label: "Context Awareness" },
    { icon: ShieldCheck, label: "Policy Driven Decisions" },
    { icon: TrendingUp, label: "Real-time Escalation" },
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden text-foreground"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 30%, #1a0b3a 0%, #0a0625 40%, #050214 100%)",
      }}
    >
      {/* Background ambient layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial behind logo */}
        <div
          className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 720,
            height: 720,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(6,182,212,0.12) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        {/* Animated wave lines (left & right) */}
        <svg
          className="absolute left-0 top-0 h-full w-1/2 opacity-50"
          viewBox="0 0 600 1000"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="waveL" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(124,58,237,0)" />
              <stop offset="50%" stopColor="rgba(124,58,237,0.6)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0)" />
            </linearGradient>
          </defs>
          {[200, 350, 500, 700].map((y, i) => (
            <motion.path
              key={i}
              d={`M-50 ${y} Q150 ${y - 60} 350 ${y} T800 ${y}`}
              stroke="url(#waveL)"
              strokeWidth="1.5"
              fill="none"
              animate={{ x: [-40, 40, -40] }}
              transition={{
                duration: 8 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
        <svg
          className="absolute right-0 top-0 h-full w-1/2 opacity-50"
          viewBox="0 0 600 1000"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="waveR" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(6,182,212,0)" />
              <stop offset="50%" stopColor="rgba(6,182,212,0.6)" />
              <stop offset="100%" stopColor="rgba(236,72,153,0)" />
            </linearGradient>
          </defs>
          {[260, 420, 600, 780].map((y, i) => (
            <motion.path
              key={i}
              d={`M-50 ${y} Q150 ${y + 60} 350 ${y} T800 ${y}`}
              stroke="url(#waveR)"
              strokeWidth="1.5"
              fill="none"
              animate={{ x: [40, -40, 40] }}
              transition={{
                duration: 9 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        {/* Subtle drifting background particles */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2 + Math.random() * 2,
              height: 2 + Math.random() * 2,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top right language switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center"
      >
        {/* Logo + glow ring + particles */}
        <div className="relative mb-10" style={{ width: 220, height: 220 }}>
          {/* Outer pulsing glow ring */}
          <motion.div
            className="absolute inset-[-20px] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #7C3AED, #3b82f6, #06B6D4, #7C3AED)",
              filter: "blur(14px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-[-8px] rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg, #7C3AED, #06B6D4, #ec4899, #7C3AED)",
              opacity: 0.7,
            }}
            animate={{ rotate: -360, scale: [1, 1.05, 1] }}
            transition={{
              rotate: { duration: 18, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Pulse halo */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                "0 0 60px rgba(124,58,237,0.6), 0 0 120px rgba(6,182,212,0.4)",
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.04, 1],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo circle with floating motion */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden border border-white/10"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #1a0e3a 0%, #0a0420 70%)",
              backgroundImage: `url(${logoUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "360% auto",
              backgroundPosition: "12% 50%",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
            transition={{
              scale: { duration: 1, ease: "easeOut" },
              opacity: { duration: 1, ease: "easeOut" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {/* Inner subtle glow overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, transparent 50%, rgba(10,4,32,0.6) 100%)",
              }}
            />
          </motion.div>

          {/* Floating particles around logo */}
          {particles.map((p) => {
            const x = Math.cos(p.angle) * p.radius;
            const y = Math.sin(p.angle) * p.radius;
            return (
              <motion.span
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: p.size,
                  height: p.size,
                  background:
                    p.id % 3 === 0 ? "#06B6D4" : p.id % 3 === 1 ? "#7C3AED" : "#ec4899",
                  boxShadow: "0 0 8px currentColor",
                  color:
                    p.id % 3 === 0 ? "#06B6D4" : p.id % 3 === 1 ? "#7C3AED" : "#ec4899",
                }}
                animate={{
                  x: [x, x * 1.15, x],
                  y: [y, y * 1.15, y],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        {/* Welcome small heading */}
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3"
        >
          Welcome to
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-6xl md:text-7xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #06B6D4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ResolveAI
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-4 text-cyan-300/90 font-medium"
          style={{ letterSpacing: 2 }}
        >
          {t("splash.tagline")}
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-3 max-w-xl text-sm md:text-base text-white/60 leading-relaxed"
        >
          Intelligent complaint resolution that understands, analyzes, and resolves
          instantly.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/dashboard")}
          className="group mt-10 inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold tracking-wide w-full sm:w-auto justify-center"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #3b82f6 60%, #06B6D4 100%)",
            boxShadow:
              "0 10px 40px rgba(124,58,237,0.45), 0 0 30px rgba(6,182,212,0.35)",
          }}
          data-testid="splash-enter"
        >
          {t("splash.enter")}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </motion.button>

        {/* Features strip */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all hover:border-cyan-400/40"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))",
                    boxShadow: "0 0 0 rgba(124,58,237,0)",
                  }}
                >
                  <Icon className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs md:text-sm text-white/70 text-center leading-tight group-hover:text-white transition-colors">
                  {f.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
