import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import nssLogo from "@/assets/nss-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NSS Farewell — Batch 2022–2026" },
      { name: "description", content: "A nostalgic farewell to our NSS seniors — Not Me, But You." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Caveat:wght@500;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

const BATCH_LABEL = "Batch 2022 — 2026";
const NSS_MOTTO = "Not Me, But You";
const NSS_MESSAGE = `The National Service Scheme aims at developing the personality of students through community service. To the seniors who lived this motto every single day — this one is for you.`;


// NEW: Emotional phrases for the launcher
const LOADING_PHRASES = [
  "Initializing NSS Memories...",
  "Recalling the camps and drives...",
  "Gathering gratitude from juniors...",
  "Almost there...",
];

function Landing() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  
  // NEW STATES FOR LAUNCHER
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    // 1. Progress Bar Logic
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false); // Hide launcher
            setTimeout(() => setRevealed(true), 100); // Reveal main page
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // Total loading time ~4 seconds

    // 2. Phrase Rotation Logic
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(phraseInterval);
    };
  }, []);

  const goNext = () => {
    if (!revealed) return;
    navigate({ to: "/tribute" });
  };

  return (
    <div
      onClick={goNext}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goNext()}
      role="button"
      tabIndex={0}
      className="relative min-h-[100svh] w-full overflow-hidden cursor-pointer select-none bg-background text-foreground"
    >
      
      {/* ===== CHANGE 1: THE LAUNCHER OVERLAY ===== */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-1000">
          <div className="relative">
             {/* Pulsing Logo */}
            <img 
              src={nssLogo} 
              alt="Loading" 
              className="h-24 w-24 mb-8 animate-pulse opacity-80"
              style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}
            />
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Emotional Phrases */}
          <p className="mt-6 font-script text-accent text-xl animate-in fade-in slide-in-from-bottom-2 duration-700">
            {LOADING_PHRASES[phraseIndex]}
          </p>
          
          <p className="mt-2 text-white/30 text-[10px] uppercase tracking-[0.4em]">
            Preparing Farewell
          </p>
        </div>
      )}

      {/* ===== REST OF YOUR ORIGINAL CODE ===== */}
      <img
        src={heroBg}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[3000ms] ease-out ${
          revealed ? "opacity-60 scale-100" : "opacity-0 scale-110"
        }`}
      />
      <div className="absolute inset-0 starfield opacity-60" />

      {/* Fog layers */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-[4000ms] ease-out ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background: "radial-gradient(ellipse at 50% 60%, oklch(0.18 0.04 264 / 0.4), oklch(0.10 0.03 264 / 0.95) 70%)",
          backdropFilter: "blur(12px)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80 pointer-events-none" />

      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-16">
        <div
          className={`transition-all ease-out`}
          style={{
            transitionDuration: "1800ms",
            transitionDelay: "600ms",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0) scale(1)" : "translateY(20px) scale(0.92)",
            filter: revealed ? "blur(0px)" : "blur(8px)",
          }}
        >
          <img
            src={nssLogo}
            alt="NSS Logo"
            className="h-28 w-28 sm:h-36 sm:w-36 mx-auto drop-shadow-[0_0_40px_rgba(255,200,100,0.35)]"
          />
        </div>

        <p
          className="font-script text-accent text-2xl sm:text-3xl mt-6 transition-all ease-out"
          style={{
            transitionDuration: "1800ms",
            transitionDelay: "1400ms",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {BATCH_LABEL}
        </p>

        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl mt-3 leading-tight transition-all ease-out"
          style={{
            transitionDuration: "2200ms",
            transitionDelay: "2000ms",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span className="italic text-gradient-gold">{NSS_MOTTO}</span>
        </h1>

        <p
          className="mt-8 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed transition-all ease-out"
          style={{
            transitionDuration: "2200ms",
            transitionDelay: "3000ms",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {NSS_MESSAGE}
        </p>

        <div
          className="mt-10 max-w-2xl transition-all ease-out"
          style={{
            transitionDuration: "2400ms",
            transitionDelay: "4200ms",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="font-script text-accent/80 text-lg sm:text-xl mb-2">a message from your juniors</p>
          <p className="font-display italic text-lg sm:text-2xl leading-relaxed whitespace-pre-line text-foreground/90">
            
          </p>
        </div>

        <p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70 transition-opacity"
          style={{
            transitionDuration: "1500ms",
            transitionDelay: "6000ms",
            opacity: revealed ? 1 : 0,
          }}
        >
          <span className="animate-pulse">click anywhere to enter</span>
        </p>
      </div>
    </div>
  );
}
