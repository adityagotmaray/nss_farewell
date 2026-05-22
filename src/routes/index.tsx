import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import nssLogo from "../assets/nss-logo.png"; // REVERTED
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

  useEffect(() => {
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

    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 1200);

    return () => { clearInterval(interval); clearInterval(phraseInterval); };
  }, []);

  const goNext = () => { if (!revealed) return; navigate({ to: "/tribute" }); };

  return (
    <div onClick={goNext} role="button" tabIndex={0} className="relative min-h-[100svh] w-full overflow-hidden cursor-pointer select-none bg-background text-foreground">
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
          <img src={nssLogo} alt="Loading" className="h-24 w-24 mb-8 animate-pulse opacity-80" />
          <div className="w-64 h-[1px] bg-white/10 overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
          </div>
          <p className="mt-6 font-script text-accent text-xl">{LOADING_PHRASES[phraseIndex]}</p>
        </div>
      )}

      <img src={heroBg} alt="" className={`absolute inset-0 h-full w-full object-cover transition-all duration-[3000ms] ${revealed ? "opacity-60 scale-100" : "opacity-0 scale-110"}`} />
      <div className="absolute inset-0 starfield opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80 pointer-events-none" />

      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="transition-all ease-out" style={{ transitionDuration: "1800ms", opacity: revealed ? 1 : 0 }}>
          <img src={nssLogo} alt="NSS Logo" className="h-28 w-28 sm:h-36 sm:w-36 mx-auto drop-shadow-[0_0_40px_rgba(255,200,100,0.35)]" />
        </div>

        <p className="font-script text-accent text-2xl sm:text-3xl mt-6 transition-all" style={{ opacity: revealed ? 1 : 0 }}>{BATCH_LABEL}</p>
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl mt-3 leading-tight transition-all" style={{ opacity: revealed ? 1 : 0 }}>
          <span className="italic text-gradient-gold">{NSS_MOTTO}</span>
        </h1>
        <p className="mt-8 max-w-xl text-muted-foreground transition-all" style={{ opacity: revealed ? 1 : 0 }}>{NSS_MESSAGE}</p>
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70"><span className="animate-pulse">click anywhere to enter</span></p>
      </div>
    </div>
  );
}
