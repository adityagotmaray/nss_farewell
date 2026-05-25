import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [{ title: "Yearbook — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: YearbookPage,
});

// ADD YOUR SENIORS HERE (Unchanged data)
const SENIORS = [
  { name: "Dr. Anand Tamrakar", major: "FACULTY", role: "PO", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Leadership is service." },
  { name: "Mr. Ayush Sahu", major: "FACULTY", role: "SEC", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Impact over intensity." },
  { name: "Dhanendra kumar sahu", major: "CSE", role: "Dal Nayak", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Service is rent for space." },
  // ... more seniors ...
];

function YearbookPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Logic for the "Scattered photos on a table" look
  const rotations = useMemo(() => SENIORS.map(() => (Math.random() * 4 - 2).toFixed(2)), []);

  const filteredSeniors = SENIORS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.role === filter;
    return matchesSearch && matchesFilter;
  });

  const roles = ["All", ...new Set(SENIORS.map(s => s.role))];

  return (
    <div className="relative min-h-screen">
      <TopNav />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <Reveal>
              <p className="text-accent text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Batch 2022—2026</p>
              <h1 className="font-display text-6xl sm:text-8xl italic text-shiny-gold uppercase">The Yearbook</h1>
            </Reveal>
          </div>

          {/* Search/Filters */}
          <div className="max-w-4xl mx-auto mb-16 space-y-6">
            <input 
              type="text" placeholder="Search by name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:border-accent/40 outline-none backdrop-blur-xl transition-all"
            />
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map(r => (
                <button key={r} onClick={() => setFilter(r)} className={`px-6 py-2 rounded-full text-[10px] font-bold border transition-all ${filter === r ? "bg-accent text-black" : "text-white/40 border-white/10"}`}>{r?.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* THE SCATTERED GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredSeniors.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.8, y: 30, rotate: rotations[i] }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: rotations[i] }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  whileHover={{ rotate: 0, scale: 1.05, zIndex: 50 }}
                  className="group [perspective:1000px] aspect-[4/5] cursor-pointer"
                >
                  <div className="relative w-full h-full transition-all duration-[0.8s] preserve-3d group-hover:[transform:rotateY(180deg)]">
                    
                    {/* FRONT: THE POLAROID */}
                    <div className="absolute inset-0 backface-hidden paper-texture p-4 pb-16 shadow-2xl rounded-sm">
                      <div className="w-full h-full overflow-hidden bg-black/5">
                         <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute bottom-4 left-0 w-full text-center">
                         <p className="text-handwritten text-3xl">{s.name}</p>
                      </div>
                    </div>

                    {/* BACK: THE DETAILS */}
                    <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] paper-texture p-8 flex flex-col justify-center items-center text-center rounded-sm border-2 border-accent/20">
                      <h3 className="font-display text-2xl text-black mb-2">{s.name}</h3>
                      <p className="text-accent font-bold uppercase text-[10px] mb-4">{s.role}</p>
                      <p className="text-black/60 italic font-serif text-sm border-t border-black/5 pt-4">"{s.quote}"</p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
