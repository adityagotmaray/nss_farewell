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

// ==========================================
// BACKEND: ADD SENIORS HERE
// ==========================================
const SENIORS = [
  { name: "Arjun Mehta", major: "Computer Science", role: "PO", photo: "" },
  { name: "Priya Sharma", major: "Biotechnology", role: "SEC", photo: "" },
  { name: "Rohit Verma", major: "Mechanical Engg.", role: "VOL", photo: "" },
  { name: "Sneha Nair", major: "Electronics", role: "CORD", photo: "" },
  { name: "Aaditya G.", major: "Computer Science", role: "VOL", photo: "" },
  // 💡 Add more seniors...
];

function YearbookPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          backgroundColor: 0x02040a,
          skyColor: 0x050a1a,
          sunColor: 0x030712,
          sunGlareColor: 0x1d4ed8,
          cloudColor: 0x0f172a,
          speed: 1.2 
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
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <div className="text-center mb-12">
            <Reveal>
              <p className="text-accent text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Batch 2022—2026</p>
              <h1 className="font-display text-6xl sm:text-8xl text-white tracking-tighter mb-4">Yearbook</h1>
            </Reveal>
          </div>

          {/* SEARCH & PILL FILTERS (Screenshot Style) */}
          <div className="max-w-4xl mx-auto mb-16 space-y-6">
            <div className="relative">
              <input 
                type="text" placeholder="Search by name..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:border-accent/40 outline-none backdrop-blur-xl transition-all shadow-2xl"
              />
            </div>
            
            {/* Pill Selectors */}
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all border ${
                    filter === r ? "bg-accent text-black border-accent" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* THE "FULL-LENGTH" GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredSeniors.map((s) => {
                const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <motion.div
                    key={s.name} layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0f1d] shadow-2xl transition-all hover:-translate-y-2"
                  >
                    {/* Background Content (Photo or Massive Initials) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <span className="font-display text-[120px] text-white/[0.03] select-none tracking-tighter group-hover:text-white/[0.07] transition-colors">
                          {initials}
                        </span>
                      )}
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                       <p className="text-accent text-[10px] tracking-[0.3em] font-bold mb-1 opacity-60 uppercase">{s.major}</p>
                       <h3 className="font-display text-3xl text-white leading-tight mb-2">{s.name}</h3>
                       
                       <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
                          <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{s.role}</span>
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,175,55,1)]" />
                          </div>
                       </div>
                    </div>

                    {/* Selection Glow */}
                    <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/40 rounded-[2rem] transition-colors pointer-events-none" />
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
