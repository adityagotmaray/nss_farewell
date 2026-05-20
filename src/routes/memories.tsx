import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [{ title: "Memories Vault — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: MemoriesPage,
});

// ==========================================
// BACKEND: ORGANIZE YOUR ALBUMS HERE
// ==========================================
const ALBUMS = [
  {
    id: "camps",
    category: "Camps",
    title: "Village Camp 2023",
    description: "7 days of service, learning, and late-night talks.",
    photos: [
      { url: "/memories/camp1.jpg", caption: "Day 1 Orientation" },
      { url: "/memories/camp2.jpg", caption: "Field Survey" },
    ]
  },
  {
    id: "social",
    category: "Social Activities",
    title: "Tree Plantation Drive",
    description: "Giving back to nature, one sapling at a time.",
    photos: [
      { url: "/memories/social1.jpg", caption: "Planting hope." },
    ]
  },
  {
    id: "cultural",
    category: "Cultural Events",
    title: "Cultural Night 2024",
    description: "Celebrating our diverse NSS spirit.",
    photos: [
      { url: "/memories/cultural1.jpg", caption: "The final performance." },
    ]
  },
  {
    id: "farewell",
    category: "Farewell",
    title: "Senior Farewell Night",
    description: "A bittersweet goodbye to our mentors.",
    photos: [
      { url: "/memories/farewell1.jpg", caption: "Last group hug." },
    ]
  }
];

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
        backgroundColor: 0x02040a, skyColor: 0x050a1a, cloudColor: 0x1e293b, speed: 1.0
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  // Filter Logic for Folders
  const filteredAlbums = ALBUMS.filter(a => 
    activeCategory === "ALL" || a.category.toUpperCase() === activeCategory
  );

  const categories = ["ALL", ...new Set(ALBUMS.map(a => a.category.toUpperCase()))];

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/50 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="text-center mb-12">
            <Reveal>
              <p className="text-accent text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Gallery</p>
              <h1 className="font-display text-6xl sm:text-8xl text-white tracking-tighter mb-4">
                {activeAlbum ? "The Gallery" : "Memories Vault"}
              </h1>
              <p className="font-script text-white/40 text-2xl italic">Every photo holds a thousand emotions.</p>
            </Reveal>
            
            {activeAlbum && (
              <button 
                onClick={() => setActiveAlbum(null)}
                className="mt-8 text-accent hover:text-white transition-colors uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-2 mx-auto group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Vault
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!activeAlbum ? (
              /* 1. FOLDER VIEW (THE VAULT) */
              <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                
                {/* Pill Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                  {categories.map(c => (
                    <button
                      key={c} onClick={() => setActiveCategory(c)}
                      className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all border ${
                        activeCategory === c ? "bg-accent text-black border-accent" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAlbums.map((album) => (
                    <motion.div 
                      key={album.id} layout onClick={() => setActiveAlbum(album.id)}
                      className="group cursor-pointer relative aspect-square rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden hover:bg-white/[0.05] transition-all hover:-translate-y-2"
                    >
                      {/* Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                         <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl">⊕</span>
                         </div>
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                        <p className="text-accent text-[10px] tracking-[0.3em] font-bold mb-2 uppercase">{album.category}</p>
                        <h3 className="font-display text-3xl text-white mb-2">{album.title}</h3>
                        <p className="text-white/40 text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">{album.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* 2. PHOTO GRID VIEW (INSIDE THE FOLDER) */
              <motion.div key="photos" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                {ALBUMS.find(a => a.id === activeAlbum)?.photos.map((photo, i) => (
                  <div key={i} onClick={() => setSelectedPhoto(photo.url)} className="break-inside-avoid mb-6 relative group cursor-zoom-in rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <div className="aspect-video bg-white/5 flex items-center justify-center">
                       <img src={photo.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                       <p className="text-white font-script text-2xl">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. FULL SCREEN LIGHTBOX */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-10 cursor-zoom-out"
          >
            <img src={selectedPhoto} className="max-h-full max-w-full rounded-3xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
