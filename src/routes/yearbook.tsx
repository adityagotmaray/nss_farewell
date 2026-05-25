import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Music, Music2, Search, Filter } from "lucide-react";
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
  { name: "Dr. Anand Tamrakar", major: "FACULTY", role: "PO", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Leadership is service, not position." },
  { name: "Mr. Ayush Sahu", major: "FACULTY", role: "SEC", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Consistency is the key to impact." },
  { name: "Dhanendra kumar sahu", major: "CSE", role: "Dal Nayak", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Service is the rent we pay for our space on earth." },
  { name: "Chhanendra sahu", major: "Mechanical", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1ilD9Vm9KhL4F_vk1cBRYh3P71dTRe6pT", quote: "Once a volunteer, always a volunteer." },
  { name: "Julie Prajapati", major: "CSE", role: "Dal Nayaika", photo: "https://lh3.googleusercontent.com/d/1A5JmZFG3uyp4TWnVByT8NagzeYnpwQAm", quote: "Empower through action." },
  { name: "Ashi sao", major: "Civil", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1_uD8fMK-0z6HWXV6x9-clZSGCHLJE7la", quote: "Small acts, big changes." },
  { name: "Atul singh rajput", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1LRSr2z2I0_7I8xXooGBUZ3Iri7RbdT9P", quote: "Dedication defines us." },
  { name: "Harsh sonwanshi", major: "IT", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1opm2UAF9rm-H0w2QrivM2cb3ly90OUSN", quote: "Making every moment count." },
  { name: "K Abhilash", major: "ECE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1ElFYj8J7Qpm4r1hCVf1jbsxzvF738Oxb", quote: "To serve is to live." },
  { name: "Bhupesh sahu", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1VeoY_5z2vpnNnhJouwNlb78Vo9fWpb5v", quote: "Building a better tomorrow." },
  { name: "Dharninee", major: "IT", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1iidPtcQZBX8UIOutjO2fQWY0X2IDTol8", quote: "Kindness is free." }
];

function YearbookPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // 14. Cursor Glow Interpolation
  const springConfig = { stiffness: 150, damping: 20 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // 15. Ambient Music Toggle
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cardRotations = useMemo(() => SENIORS.map(() => (Math.random() * 3 - 1.5).toFixed(2)), []);

  const filteredSeniors = SENIORS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.role === filter;
    return matchesSearch && matchesFilter;
  });

  const roles = ["All", ...new Set(SENIORS.map(s => s.role))];

  return (
    // 13. Smooth Page Entrance
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20"
    >
      <TopNav />

      {/* 12. AURORA & STARFIELD BACKGROUND */}
      <div className="aurora-container">
        <div className="aurora-blob w-[700px] h-[700px] bg-[#1e1b4b] top-[-10%] left-[-10%]" />
        <div className="aurora-blob w-[600px] h-[600px] bg-[#0f4c4c] bottom-[5%] right-[-5%]" style={{ animationDelay: '2s' }} />
        <div className="aurora-blob w-[500px] h-[500px] bg-[#1e3a5f] top-[20%] right-[10%]" style={{ animationDelay: '5s' }} />
        <div className="absolute inset-0 star-field-static opacity-30 pointer-events-none" />
      </div>

      {/* 14. CURSOR GLOW DIV */}
      <motion.div className="cursor-glow hidden md:block" style={{ left: cursorX, top: cursorY }} />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <Reveal>
              <p className="text-accent text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Batch 2022—2026</p>
              <h1 className="font-display text-6xl sm:text-8xl text-white tracking-tighter mb-4 italic text-shiny-gold uppercase">Yearbook</h1>
            </Reveal>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="max-w-4xl mx-auto mb-16 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
              <input 
                type="text" placeholder="Search by name..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white focus:border-accent/40 outline-none backdrop-blur-xl transition-all shadow-2xl"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map(r => (
                <button
                  key={r} onClick={() => setFilter(r)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                    filter === r ? "bg-accent text-black border-accent" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  {r?.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 6. STAGGERED MASONRY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredSeniors.map((s, index) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.85, y: 30, rotate: cardRotations[index] }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.07, 1.4), ease: "easeOut" }}
                  className="group [perspective:1000px] aspect-[4/5] cursor-pointer"
                >
                  <div className="relative w-full h-full transition-all duration-[0.8s] transform-style-3d group-hover:[transform:rotateY(180deg)]">
                    {/* FRONT: POLAROID */}
                    <div className="absolute inset-0 backface-hidden paper-texture p-4 pb-14 shadow-2xl rounded-sm border border-white/20">
                      <div className="w-full h-full overflow-hidden bg-black/10">
                         <img src={s.photo} alt={s.name} className="w-full h-full object-cover grayscale-[0.2]" />
                      </div>
                      <div className="absolute bottom-3 left-0 w-full text-center">
                         <p className="text-handwritten text-2xl">{s.name}</p>
                      </div>
                    </div>
                    {/* BACK: DETAILS */}
                    <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] paper-texture p-8 flex flex-col justify-center items-center text-center rounded-sm border-2 border-accent/20 shadow-glow">
                      <h3 className="font-display text-2xl text-black mb-4">{s.name}</h3>
                      <div className="space-y-4 w-full border-y border-black/5 py-4">
                         <p className="text-accent font-bold uppercase text-xs">{s.role}</p>
                         <p className="text-black/60 text-sm italic">"{s.quote}"</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 15. FLOATING MUSIC TOGGLE */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            isPlaying ? audioRef.current?.pause() : audioRef.current?.play();
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border border-white/10 ${isPlaying ? 'bg-accent text-black music-playing' : 'bg-black/60 text-white hover:bg-white/10'}`}
        >
          {isPlaying ? <Music2 className="animate-spin-slow" /> : <Music />}
        </button>
        <audio ref={audioRef} src="/audio/ambient.mp3" loop />
      </div>

    </motion.div>
  );
}
