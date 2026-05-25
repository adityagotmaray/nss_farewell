import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import nssLogo from "../assets/nss-logo.png";

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
  "Preparing the farewell...",
];

function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    // Artificial load time for the experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 900);

    return () => {
      clearTimeout(timer);
      clearInterval(phraseInterval);
    };
  }, []);

  const goNext = () => {
    if (isLoading) return;
    navigate({ to: "/tribute" });
  };

  return (
    <div
      onClick={goNext}
      className="relative min-h-[100svh] w-full overflow-hidden cursor-pointer select-none bg-[#02021a] text-white"
    >
      {/* MOVING STARFIELD CSS */}
      <style>{`
        @keyframes move-stars {
          from { transform: translateY(0); }
          to { transform: translateY(-1000px); }
        }
        .stars-container {
          position: absolute;
          width: 200%;
          height: 200%;
          background: transparent;
          background-image: radial-gradient(white 1px, transparent 0);
          background-size: 50px 50px;
          animation: move-stars 100s linear infinite;
          opacity: 0.3;
        }
        .stars-small {
          background-size: 30px 30px;
          animation-duration: 150s;
          opacity: 0.15;
        }
      `}</style>

      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02021a] via-[#060642] to-[#02021a]" />
      <div className="stars-container" />
      <div className="stars-container stars-small" />
      
      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02021a]"
          >
            <motion.img 
              src={nssLogo} 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-24 w-24 mb-8" 
            />
            <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
                <motion.div 
                    className="absolute inset-0 bg-[#c81e1e]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 3.5, ease: "easeInOut" }}
                />
            </div>
            <p className="mt-6 font-script text-[#c81e1e] text-2xl italic tracking-wide">
              {LOADING_PHRASES[phraseIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={!isLoading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <img src={nssLogo} alt="NSS Logo" className="h-32 w-32 sm:h-44 sm:w-44 mx-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-8" />
          
          <p className="font-script text-[#c81e1e] text-3xl sm:text-4xl mb-4 italic tracking-wider">
            {BATCH_LABEL}
          </p>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-tight mb-8">
            <span className="italic bg-gradient-to-b from-white via-white/80 to-transparent bg-clip-text text-transparent">
                {NSS_MOTTO}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-white/60 text-lg leading-relaxed italic px-4">
            {NSS_MESSAGE}
          </p>

          {/* Animated Footer Hint */}
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mt-20 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
            <p className="text-xs uppercase tracking-[0.5em] text-white/40 font-bold">
               click anywhere to enter
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
