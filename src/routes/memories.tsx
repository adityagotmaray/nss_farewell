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
// CONFIGURATION: PASTE YOUR LINKS HERE
// ============================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyU5x-DPQJy1AsQbcce6ZZMU0gyoAa9BZaRFkaSALfWMbwFZphRoaIKGDUsB8AJyg3j/exec";
const PARENT_DRIVE_FOLDER_ID = "1yCcnLb29ST1wPBGolNlpsgSbufVuoLwj";
// ============================================================

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fetch albums and media recursively from Google Drive
  useEffect(() => {
    fetch(`${GOOGLE_SCRIPT_URL}?id=${PARENT_DRIVE_FOLDER_ID}`)
      .then(res => res.json())
      .then(data => {
        setAlbums(data);
        setLoading(false);
      })
      .catch(err => console.error("Vault Error:", err));
  }, []);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
        backgroundColor: 0x02040a, skyColor: 0x050a1a, cloudColor: 0x1e293b, speed: 1.2 
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const activeAlbum = albums.find(a => a.id === activeAlbumId);

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/50 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <Reveal>
              <h1 className="font-display text-6xl sm:text-8xl text-white tracking-tighter mb-4">
                {activeAlbum ? activeAlbum.title : "Memories Vault"}
              </h1>
              <p className="font-script text-accent text-2xl italic">
                {activeAlbum ? "Reliving every moment." : "Opening the chapters of your journey."}
              </p>
            </Reveal>
            
            {activeAlbumId && (
              <button onClick={() => setActiveAlbumId(null)}
                className="mt-8 px-6 py-2 border border-accent/40 rounded-full text-accent hover:bg-accent hover:text-black transition-all uppercase tracking-widest text-[10px] font-black"
              >
                ← Return to Vault
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-accent/30 animate-pulse mt-20 font-display">
                Scanning Drive Folders...
              </motion.div>
            ) : !activeAlbumId ? (
              /* ALBUMLIST (THE VAULT) */
              <motion.div key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {albums.map((album) => (
                  <div key={album.id} onClick={() => setActiveAlbumId(album.id)}
                    className="group cursor-pointer relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl hover:-translate-y-2 transition-all bg-white/5"
                  >
                    <img src={album.cover} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
                      <p className="text-accent text-[10px] tracking-[0.3em] font-bold mb-2 uppercase">COLLECTION</p>
                      <h3 className="font-display text-4xl text-white tracking-tight">{album.title}</h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              /* GALLERY VIEW (INSIDE THE ALBUM) */
              <motion.div key="photos" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="columns-1 sm:columns-2 lg:columns-3 gap-8">
                {activeAlbum.photos.map((item: any, i: number) => (
                  <div key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}
                    className="break-inside-avoid mb-8 relative group rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a1120] shadow-2xl"
                  >
                    {item.type === "video" ? (
                      <div className="aspect-video w-full relative">
                        {hoveredIndex === i ? (
                          <iframe src={item.url + "?autoplay=1&mute=1"} className="absolute inset-0 w-full h-full" allow="autoplay" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black to-[#0a1a3b]">
                             <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4"><span className="text-accent text-2xl">▶</span></div>
                             <p className="text-[10px] text-white/30 tracking-widest font-black uppercase">Hover to Play</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img src={item.url} className="w-full h-auto transition-transform duration-1000 group-hover:scale-110" />
                    )}
                    {hoveredIndex !== i && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 pointer-events-none">
                        <p className="text-white font-script text-2xl drop-shadow-lg">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
