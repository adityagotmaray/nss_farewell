import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import nssLogo from "../assets/nss-logo.png";
import heroBg from "../assets/hero-bg.jpg";

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

const LOADING_PHRASES = [
  "Initializing NSS Memories...",
  "Recalling the camps and drives...",
  "Gathering gratitude from juniors...",
  "Almost there...",
];

function Landing() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // --- TYPEWRITER LOGIC ---
  const [mottoText, setMottoText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  // Generate 80 random particle configs once
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
  }, []);

  useEffect(() => {
    // 1. Progress Bar Logic
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setRevealed(true), 100);
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    // 2. Phrase Rotation Logic
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(phraseInterval);
    };
  }, []);

  // 3. Start typewriter only after revealed
  useEffect(() => {
    if (!revealed) return;
    
    let i = 0;
    const timer = setInterval(() => {
      setMottoText(NSS_MOTTO.slice(0, i + 1));
      i++;
      if (i >= NSS_MOTTO.length) {
        clearInterval(timer);
        setTimeout(() => setTypingDone(true), 2000);
      }
    }, 60);

    return () => clearInterval(timer);
  }, [revealed]);

  const goNext = () => { if (!revealed) return; navigate({ to: "/tribute" }); };

  return (
    <div onClick={goNext} role="button" tabIndex={0} className="relative min-h-[100svh] w-full overflow-hidden cursor-pointer select-none bg-background text-foreground">
      
      {/* LAUNCHER OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-1000">
          <img src={nssLogo} alt="Loading" className="h-24 w-24 mb-8 animate-pulse opacity-80" />
          <div className="w-64 h-[1px] bg-white/10 overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }} />
          </div>
          <p className="mt-6 font-script text-accent text-xl">{LOADING_PHRASES[phraseIndex]}</p>
        </div>
      )}

      {/* BACKGROUND & CINEMATIC KEN BURNS */}
      <img
        src={heroBg}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[8000ms] ease-out ${
          revealed ? "opacity-40 scale-100" : "opacity-0 scale-110"
        }`}
      />

      {/* NEW: GOLDEN DUST PARTICLE CONTAINER */}
      <div className={`absolute inset-0 transition-opacity duration-[3000ms] ${revealed ? 'opacity-100' : 'opacity-0'}`}>
        {particles.map((p) => (
          <div
            key={p.id}
            className="dust-particle"
            style={{
              "--left": p.left,
              "--size": p.size,
              "--delay": p.delay,
              "--duration": p.duration,
            } as any}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80 pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-16">
        
        {/* NEW: LOGO WITH BREATHING GLOW */}
        <div className="transition-all ease-out" style={{ transitionDuration: "1800ms", opacity: revealed ? 1 : 0 }}>
          <img 
            src={nssLogo} 
            alt="NSS Logo" 
            className="h-28 w-28 sm:h-36 sm:w-36 mx-auto animate-breathing" 
          />
        </div>

        <p className="font-script text-accent text-2xl sm:text-3xl mt-6 transition-all" style={{ opacity: revealed ? 1 : 0 }}>
          {BATCH_LABEL}
        </p>

        {/* NEW: TYPEWRITER MOTTO */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl mt-3 leading-tight transition-all" style={{ opacity: revealed ? 1 : 0 }}>
          <span className="italic text-gradient-gold">
            {mottoText}
            {!typingDone && <span className="cursor-blink">|</span>}
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-muted-foreground transition-all" style={{ opacity: revealed ? 1 : 0 }}>
          {NSS_MESSAGE}
        </p>

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          <span className="animate-pulse">click anywhere to enter</span>
        </p>
      </div>
    </div>
  );
}
