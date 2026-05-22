import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion } from "framer-motion";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";
import eminenceLogo from "../assets/eminence-logo.png";

export const Route = createFileRoute("/tribute")({
  head: () => ({
    meta: [{ title: "NSS Farewell — Journey" }],
    links: FONT_LINKS,
  }),
  component: JourneyPage,
});

// ==========================================================
// BACKEND: MANAGE YOUR TIMELINE DATA HERE
// ==========================================================
const TIMELINE = [
  { 
    year: "2023", 
    events: [
      { title: "Arrival in the scene", body: "Where it all began. Donning the NSS badge for the first time.", photo: "" },
      { title: "Being a part of a family", body: "Cleaning the campus streets and learning the dignity of labor.", photo: "" }
    ]
  },
  { 
    year: "2024", 
    events: [
      { 
        title: "7-Day Special Camp", 
        body: "Life in the village. Hard work by day, bonfires by night.",
        // 💡 TESTED LINK: Using the working ID we found earlier
        photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv" 
      },
      { title: "NSS Day Celebration", body: "A day of pride, cultural performances, and unit unity.", photo: "" }
    ]
  },
  { 
    year: "2025", 
    events: [
      { title: "The Leadership Era", body: "Guiding the juniors and leading the cell to new heights.", photo: "" },
    ]
  },
  { 
    year: "2026", 
    events: [
      { title: "Final Farewell", body: "End of an era. The badge stays in our hearts forever.", photo: "" },
    ]
  },
];

function JourneyPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        CLOUDS({
          el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
          // 🚀 FORCED BLUE TINT (Removed all brown/orange codes)
          backgroundColor: 0x020617, // Rich Navy Black
          skyColor: 0x0f172a,       // Slate Blue Sky
          cloudColor: 0x1e293b,     // Muted Blue Clouds
          cloudShadowColor: 0x020617,
          sunColor: 0x000000,       // Kills the orange glow
          sunlightColor: 0x000000,  // Kills the brown tint
          speed: 1.2
        })
      );
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const scrollToStory = () => storyRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-[1]" />
      <div className="fixed inset-0 z-[2] stars-layer animate-twinkle pointer-events-none opacity-30" />

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <Reveal>
            <img src={eminenceLogo} alt="Logo" className="h-20 w-20 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
            <div className="mb-6 px-4 py-1 border border-accent/30 rounded-full bg-accent/5 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent font-medium">
                    National Service Scheme • Batch 2022—2026
                </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="font-display text-7xl sm:text-9xl tracking-tighter leading-none text-white">
               <span className="text-shiny-gold italic">Eminence</span>
            </h1>
            <p className="font-display italic text-4xl sm:text-5xl mt-4 text-white/90 tracking-widest">
              Farewell - 2k26
            </p>
          </Reveal>

          <Reveal delay={400}>
            <button onClick={scrollToStory} className="mt-12 px-10 py-4 bg-accent text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              Relive Memories
            </button>
          </Reveal>
        </section>

        {/* JOURNEY TITLE */}
        <div ref={storyRef} className="pt-32 pb-24 px-6 text-center">
            <p className="font-script text-accent text-4xl mb-4">the story of</p>
            <h1 className="font-display text-6xl sm:text-9xl text-white">
                <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_auto] animate-shine">
                    Their NSS Journey
                </span>
            </h1>
        </div>

        {/* TIMELINE SECTION */}
        <section className="relative pb-40 px-6 max-w-5xl mx-auto">
          <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
          
          <div className="space-y-60">
            {TIMELINE.map((yearGroup, yearIndex) => {
              const isLeft = yearIndex % 2 === 0;
              return (
                <div key={yearGroup.year} className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-20 items-start ${isLeft ? "" : "sm:[&>*:first-child]:order-2"}`}>
                  
                  <div className={`${isLeft ? "sm:text-right" : "sm:text-left"} sticky top-40`}>
                    <Reveal>
                        <span className="font-script text-accent text-6xl sm:text-8xl block drop-shadow-2xl">{yearGroup.year}</span>
                    </Reveal>
                  </div>

                  <div className="space-y-20 pt-10">
                    {yearGroup.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="relative">
                            <div className="absolute left-[-42px] sm:left-[-51px] top-6 h-3 w-3 rounded-full bg-accent border border-accent shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                            <Reveal delay={eventIndex * 150}>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight mb-3">{event.title}</h3>
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-md shadow-2xl transition-all hover:bg-black/60">
                                            <p className="text-white/70 leading-relaxed text-base italic">{event.body}</p>
                                        </div>
                                    </div>

                                    {/* 🖼️ PHOTO DISPLAY FIX */}
                                    {event.photo && (
                                        <div className="relative mt-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 group">
                                            <img 
                                              src={event.photo} 
                                              alt={event.title} 
                                              className="w-full h-auto min-h-[150px] object-cover block transition-transform duration-700 group-hover:scale-105"
                                              onError={(e) => {
                                                console.error("Image failed to load. Check ID and permissions.");
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        <footer className="py-20 text-center border-t border-white/5 bg-black/40">
            <p className="font-script text-accent text-3xl mb-4 italic">Not Me, But You</p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 italic">Batch 2022 — 2026</p>
        </footer>
      </div>

      <style>{`
        @keyframes shine { to { background-position: 200% center; } }
        .animate-shine { animation: shine 4s linear infinite; }
      `}</style>
    </div>
  );
}
