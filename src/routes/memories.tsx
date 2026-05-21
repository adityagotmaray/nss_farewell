import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ChevronLeft } from "lucide-react";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [{ title: "Memories Vault — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: MemoriesPage,
});

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxl4NGrvu29omJKcYHvSPY9o7Rc8hqTfSpQJuA3SPcTrnlVqEI_WTwXE0bQGspuQGsS/exec";
const PARENT_DRIVE_FOLDER_ID = "1yCcnLb29ST1wPBGolNlpsgSbufVuoLwj";

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  useEffect(() => {
    fetch(`${GOOGLE_SCRIPT_URL}?id=${PARENT_DRIVE_FOLDER_ID}`)
      .then(res => res.json())
      .then(data => { setAlbums(data); setLoading(false); });
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
              <h1 className="font-display text-5xl sm:text-8xl text-white tracking-tighter mb-4">
                {activeAlbum ? activeAlbum.title : "Memories Vault"}
              </h1>
            </Reveal>
            
            {activeAlbumId && (
              <button onClick={() => setActiveAlbumId(null)}
                className="mt-4 flex items-center gap-2 mx-auto text-accent hover:text-white transition-all uppercase tracking-widest text-[10px] font-bold"
              >
                <ChevronLeft size={14} /> Return to Vault
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-accent/30 animate-pulse mt-20">
                Scanning the Chapters...
              </motion.div>
            ) : !activeAlbumId ? (
              <motion.div key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {albums.map((album) => (
                  <div key={album.id} onClick={() => setActiveAlbumId(album.id)}
                    className="group cursor-pointer relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 hover:-translate-y-2 transition-all shadow-2xl"
                  >
                    <img src={album.cover} className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                      <p className="text-accent text-[10px] tracking-[0.3em] font-black uppercase mb-1">{album.category}</p>
                      <h3 className="font-display text-3xl text-white tracking-tight">{album.title}</h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                {activeAlbum.photos.map((item: any, i: number) => (
                  <motion.div 
                    key={i} 
                    onClick={() => setSelectedMedia(item)}
                    className="break-inside-avoid mb-6 relative group cursor-pointer rounded-3xl overflow-hidden border border-white/5 shadow-xl bg-white/5"
                  >
                    {item.type === "video" ? (
                      <div className="aspect-video flex items-center justify-center bg-black/40">
                         <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center">
                            <span className="text-accent text-xl ml-1">▶</span>
                         </div>
                      </div>
                    ) : (
                      <img src={item.url} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 pointer-events-none">
                       <p className="text-white font-script text-lg opacity-80">{item.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX (MODAL) */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
          >
            {/* Toolbar */}
            <div className="absolute top-6 right-6 flex gap-4 z-[110]">
               <a 
                href={selectedMedia.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-accent hover:text-black flex items-center justify-center transition-all text-white shadow-lg"
                title="Download"
               >
                 <Download size={20} />
               </a>
               <button 
                onClick={() => setSelectedMedia(null)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition-all text-white shadow-lg"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Media Content */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-5xl flex flex-col items-center"
            >
              {selectedMedia.type === "video" ? (
                <iframe src={selectedMedia.url} className="w-full aspect-video rounded-2xl shadow-2xl" allow="autoplay" />
              ) : (
                <img src={selectedMedia.url} className="max-h-[75vh] w-auto rounded-2xl shadow-2xl border border-white/10" />
              )}
              <p className="mt-8 font-script text-accent text-3xl text-center">{selectedMedia.caption}</p>
            </motion.div>

            {/* Background Close Tap Area */}
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedMedia(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
