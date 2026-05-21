import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [{ title: "Memories Vault — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: MemoriesPage,
});

// ============================================================
// BACKEND: ADD YOUR DRIVE PHOTOS HERE
// ============================================================
const ALBUMS = [
  {
    id: "camp-23",
    category: "CAMPS",
    title: "Annual Camp 2023",
    description: "7 Days of brotherhood and service.",
    cover: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", // Thumbnail for the folder
    photos: [
      { url: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", caption: "Day 1 Assembly" },
      // 💡 Paste more converted Drive links here...
    ]
  },
  {
    id: "social-drives",
    category: "SOCIAL",
    title: "Social Activities",
    description: "Blood donation and plantation drives.",
    cover: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv",
    photos: [
      { url: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", caption: "Planting hope" },
    ]
  },
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
        backgroundColor: 0x02040a, skyColor: 0x050a1a, cloudColor: 0x1e293b, speed: 1.2 
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const filteredAlbums = ALBUMS.filter(a => activeCategory === "ALL" || a.category === activeCategory);
  const categories = ["ALL", ...new Set(ALBUMS.map(a => a.category))];
  const currentAlbum = ALBUMS.find(a => a.id === activeAlbum);

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/50 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <div className="text-center mb-12">
            <Reveal>
              <h1 className="font-display text-6xl sm:text-8xl text-white tracking-tighter mb-4">
                {activeAlbum ? currentAlbum?.title : "Memories Vault"}
              </h1>
              <p className="font-script text-accent text-2xl italic">
                {activeAlbum ? currentAlbum?.description : "Step into our history."}
              </p>
            </Reveal>
            
            {activeAlbum && (
              <button 
                onClick={() => setActiveAlbum(null)}
                className="mt-8 px-6 py-2 border border-accent/40 rounded-full text-accent hover:bg-accent hover:text-black transition-all uppercase tracking-widest text-[10px] font-bold"
              >
                ← Back to Vault
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!activeAlbum ? (
              /* FOLDER VIEW */
              <motion.div key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                  {categories.map(c => (
                    <button key={c} onClick={() => setActiveCategory(c)}
                      className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all border ${activeCategory === c ? "bg-accent text-black border-accent" : "bg-white/5 text-white/40 border-white/10"}`}>
                      {c}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAlbums.map((album) => (
                    <motion.div key={album.id} layout onClick={() => setActiveAlbum(album.id)}
                      className="group cursor-pointer relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl hover:-translate-y-2 transition-all"
                    >
                      <img src={album.cover} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
                        <p className="text-accent text-[10px] tracking-[0.3em] font-bold mb-2 uppercase">{album.category}</p>
                        <h3 className="font-display text-3xl text-white">{album.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* GALLERY VIEW */
              <motion.div key="photos" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                {currentAlbum?.photos.map((photo, i) => (
                  <div key={i} onClick={() => setSelectedPhoto(photo.url)} className="break-inside-avoid mb-6 relative group cursor-zoom-in rounded-[2rem] overflow-hidden border border-white/10">
                    <img src={photo.url} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                       <p className="text-white font-script text-2xl">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 cursor-zoom-out">
            <img src={selectedPhoto} className="max-h-full max-w-full rounded-xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
