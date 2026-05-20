import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion } from "framer-motion";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";

export const Route = createFileRoute("/tribute")({
  head: () => ({
    meta: [{ title: "NSS Farewell — Journey" }],
    links: FONT_LINKS,
  }),
  component: JourneyPage,
});

const TIMELINE = [
  { year: "2022", title: "The Beginning", body: "First orientation, first uniform, first NSS pledge — where it all started." },
  { year: "2023", title: "First NSS Camp", body: "Seven days, one village, countless memories. The camp that turned strangers into family." },
  { year: "2024", title: "Drives & Dedication", body: "Swachh Bharat, blood donation, tree plantation — every weekend was a mission." },
  { year: "2025", title: "Leading the Way", body: "As seniors, you led the unit — organising, mentoring, inspiring every junior." },
  { year: "2026", title: "The Farewell", body: "The uniform comes off, but the spirit stays. Thank you for everything." },
];

function JourneyPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        CLOUDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          // UPDATED: MIDNIGHT BLUE NIGHT SKY THEME
          backgroundColor: 0x010c1e, // Very Dark Blue
          skyColor: 0x001f3f,       // Deep Navy Sky
          cloudColor: 0x112240,     // Dusky Blue Clouds
          cloudShadowColor: 0x010c1e,
          sunColor: 0xffd700,       // Moonlight/Gold
          sunlightColor: 0x233554,  // Soft blue moonlight glow on clouds
          speed: 1.0
        })
      );
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const scrollToStory = () => storyRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />

      {/* 1. MIDNIGHT BLUE CLOUD LAYER */}
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      {/* 2. ATMOSPHERIC OVERLAY */}
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-[1]" />

      {/* 3. SHINING STARS LAYER */}
      <div className="fixed inset-0 z-[2] stars-layer animate-twinkle pointer-events-none" />

      <div className="relative z-10">
        
        {/* SECTION 1: HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <Reveal>
            {/* REVERTED: TRANSPARENT GOLD CYLINDER */}
            <div className="mb-8 px-6 py-2 border border-accent/30 rounded-full bg-accent/5 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold text-accent">
                   National Service Scheme • Batch 2022—2026
                </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            {/* REVERTED: SHINING GOLD TITLE */}
            <h1 className="font-display text-7xl sm:text-9xl tracking-tighter leading-none mb-4">
              <span className="text-white drop-shadow-2xl">NSS</span><br/>
              <span className="text-shiny-gold italic">Farewell</span>
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <p className="font-display italic text-3xl sm:text-5xl mt-2 text-white/90 tracking-widest drop-shadow-md">
              2022 — 2026
            </p>
          </Reveal>

          <Reveal delay={600}>
            <button 
              onClick={scrollToStory}
              className="mt-16 px-12 py-4 bg-accent text-black font-black uppercase tracking-widest rounded-full hover:scale-110 hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all active:scale-95"
            >
              Relive Memories
            </button>
          </Reveal>
        </section>

        {/* SECTION 2: THE JOURNEY TITLE */}
        <div ref={storyRef} className="pt-32 pb-24 px-6 text-center">
            <Reveal>
                <p className="font-script text-accent text-4xl mb-4">the story of</p>
                <h1 className="font-display text-6xl sm:text-9xl text-white">
                    <span className="italic text-shiny-gold">
                        Their NSS Journey
                    </span>
                </h1>
            </Reveal>
        </div>

        {/* SECTION 3: THE TIMELINE */}
        <section className="relative pb-40 px-6 max-w-5xl mx-auto">
          <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
          
          <div className="space-y-32">
            {TIMELINE.map((t, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-20 items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 ${isLeft ? "" : "sm:[&>*:first-child]:order-2"}`}>
                  <div className="absolute left-[10px] sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
                    <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
                  </div>
                  <div className={`${isLeft ? "sm:text-right" : "sm:text-left"}`}>
                    <span className="font-script text-accent text-4xl block mb-2">{t.year}</span>
                    <h3 className="font-display text-2xl sm:text-4xl text-white tracking-tight">{t.title}</h3>
                  </div>
                  <div className="p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-md shadow-2xl hover:bg-black/60 transition-all group">
                    <p className="text-white/70 leading-relaxed text-base sm:text-lg italic group-hover:text-white transition-colors">
                      {t.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="py-20 text-center border-t border-white/5 bg-black/40">
            <p className="font-script text-accent text-3xl mb-4 italic">Not Me, But You</p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 italic">NSS Farewell · Batch 2022 — 2026</p>
        </footer>
      </div>

      <style>{`
        @keyframes shine { to { background-position: 200% center; } }
        .text-shiny-gold {
          background: linear-gradient(90deg, #d4af37 0%, #fdfc97 50%, #d4af37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }
        .stars-layer {
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50px 160px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 300px 300px;
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.6; } }
        .animate-twinkle { animation: twinkle 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
