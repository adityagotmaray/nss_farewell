import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion } from "framer-motion";
import TopNav from "@/components/TopNav";
import { Reveal, FONT_LINKS } from "@/components/tribute-ui";

export const Route = createFileRoute("/tribute")({
  head: () => ({
    meta: [{ title: "NSS Farewell — Journey" }],
    links: FONT_LINKS,
  }),
  component: JourneyPage,
});

// ==========================================================
// BACKEND: ADD MORE YEARS OR EDIT TEXT HERE
// ==========================================================
const TIMELINE = [
  { year: "2022", title: "The Beginning", body: "First orientation, first uniform, first NSS pledge — where it all started." },
  { year: "2023", title: "First NSS Camp", body: "Seven days, one village, countless memories. The camp that turned strangers into family." },
  { year: "2024", title: "Drives & Dedication", body: "Swachh Bharat, blood donation, tree plantation — every weekend was a mission." },
  { year: "2025", title: "Leading the Way", body: "As seniors, you led the unit — organising, mentoring, inspiring every junior." },
  { year: "2026", title: "The Farewell", body: "The uniform comes off, but the spirit stays. Thank you for everything." },
  // 💡 To extend: Copy one line above, paste it here, and change the year/text!
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
          backgroundColor: 0x02040a,
          skyColor: 0x050a1a,
          cloudColor: 0x1e293b,
          speed: 1.2 // Exact same speed as Wall
        })
      );
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const scrollToStory = () => storyRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />

      {/* FIXED LIVE BACKGROUND - Exact Match to Wall */}
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/50 pointer-events-none z-[1]" />

      <div className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <Reveal>
            <div className="mb-6 px-4 py-1 border border-accent/30 rounded-full bg-accent/5 backdrop-blur-sm">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent font-medium">
                    National Service Scheme • Batch 2022—2026
                </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="font-display text-6xl sm:text-8xl md:text-9xl tracking-tighter leading-none text-white">
              NSS <span className="text-gradient-gold italic">Farewell</span>
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <p className="font-display italic text-3xl sm:text-5xl mt-4 text-white/90 tracking-widest">
              2022 — 2026
            </p>
          </Reveal>

          <Reveal delay={800}>
            <button 
              onClick={scrollToStory}
              className="mt-12 px-10 py-4 bg-accent text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)]"
            >
              Relive Memories
            </button>
          </Reveal>
        </section>

        <div ref={storyRef} className="pt-32 pb-24 px-6 text-center">
            <p className="font-script text-accent text-3xl mb-4">the story of</p>
            <h1 className="font-display text-5xl sm:text-8xl relative inline-block text-white">
                <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_auto] animate-shine">
                    Their NSS Journey
                </span>
            </h1>
        </div>

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
                  <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-md shadow-2xl hover:bg-black/50 transition-all group">
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
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/20">NSS Farewell · Batch 2022 — 2026</p>
        </footer>
      </div>

      <style>{`
        @keyframes shine { to { background-position: 200% center; } }
        .animate-shine { animation: shine 4s linear infinite; }
      `}</style>
    </div>
  );
}