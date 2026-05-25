import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min"; 
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI";

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [{ title: "Yearbook — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: YearbookPage,
});

const SENIORS = [
  { name: "Dr. Anand Tamrakar", major: "Professor", role: "PO", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv" },
  { name: "Mr. Ayush Sahu", major: "Coordinator", role: "SEC", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv" },
  { name: "Dhanendra kumar sahu", major: "CSE", role: "Dal Nayak", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv" },
];

function YearbookPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        // ADJUSTED THESE TO MATCH YOUR SCREENSHOT BETTER
        scale: 1.00,
        backgroundColor: 0xf1eef7, // The Pink
        skyColor: 0x244681,   
        cloudColor: 0x143047,
        cloudShadowColor: 0xf5f9fc,
        sunColor: 0xfff9f2,
        sunGlareColor: 0xfff9f7,
        sunlightColor: 0xf7f4f0
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const filteredSeniors = SENIORS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.role === filter;
    return matchesSearch && matchesFilter;
  });

  const roles = ["All", ...new Set(SENIORS.map(s => s.role))];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <TopNav />
      {/* Vanta Canvas */}
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      
      {/* MISTY OVERLAY: This blends the top nav into the clouds */}
      <div className="fixed inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-[#c81e1e] text-[10px] uppercase tracking-[0.5em] font-black mb-4">Batch 2022—2026</p>
              <h1 className="font-display text-7xl sm:text-9xl text-[#060642] tracking-tighter mb-4 drop-shadow-2xl">
                Yearbook
              </h1>
            </Reveal>
          </div>

          {/* SEARCH BAR: Made more "Glassy" and less "Solid White" */}
          <div className="max-w-4xl mx-auto mb-20 space-y-6">
            <input 
              type="text" placeholder="Search by name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/40 border border-white/60 rounded-[2rem] px-10 py-7 text-[#060642] focus:ring-4 focus:ring-white/20 outline-none backdrop-blur-xl shadow-2xl placeholder:text-[#060642]/40 text-xl font-medium"
            />
            
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map(r => (
                <button
                  key={r} onClick={() => setFilter(r)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest border transition-all ${
                    filter === r 
                    ? "bg-[#060642] text-white border-[#060642] shadow-xl" 
                    : "bg-white/20 text-[#060642] border-white/40 backdrop-blur-md hover:bg-white/40"
                  }`}
                >
                  {r?.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredSeniors.map((s) => {
                const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <motion.div key={s.name} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/60 bg-white/20 backdrop-blur-md shadow-2xl transition-all hover:-translate-y-3"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <span className="font-display text-[100px] text-[#060642]/10">{initials}</span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent flex flex-col justify-end p-10">
                       <p className="text-[#c81e1e] text-[10px] tracking-[0.3em] font-black mb-1 uppercase">{s.major}</p>
                       <h3 className="font-display text-4xl text-[#060642] leading-tight mb-2">{s.name}</h3>
                       <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                          <span className="text-[10px] font-black text-[#060642]/40 tracking-widest uppercase">{s.role}</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_rgba(200,30,30,0.4)]" />
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
