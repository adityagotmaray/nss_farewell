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

// ============================================================
// CONFIGURATION
// ============================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwYkYfmhZuOHkGAFwBqDhTpg3ekeVP2ZzPoo2Tw_O1lZ9dh37rFigJKdEy7ytZhkaQA/exec";
const PARENT_DRIVE_FOLDER_ID = "1yCcnLb29ST1wPBGolNlpsgSbufVuoLwj";

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [loadingVault, setLoadingVault] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${GOOGLE_SCRIPT_URL}?mode=list&id=${PARENT_DRIVE_FOLDER_ID}`)
      .then(res => res.json())
      .then(data => { setAlbums(data); setLoadingVault(false); });
  }, []);

  useEffect(() => {
    if (activeAlbumId) {
      setLoadingPhotos(true);
      setAlbumPhotos([]); 
      fetch(`${GOOGLE_SCRIPT_URL}?mode=photos&id=${activeAlbumId}`)
        .then(res => res.json())
        .then(data => { setAlbumPhotos(data); setLoadingPhotos(false); });
    }
  }, [activeAlbumId]);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
        /* BRIGHT CLOUD COLORS */
        backgroundColor: 0xf1eef7, 
        skyColor: 0x244681,   
        cloudColor: 0x143047,
        cloudShadowColor: 0xf5f9fc,
        sunColor: 0xfff9f2,
        sunGlareColor: 0xfff9f7,
        sunlightColor: 0xf7f4f0,
        speed: 1.0 
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const activeAlbum = albums.find(a => a.id === activeAlbumId);

  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      {/* Background Layers */}
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-white/10 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <Reveal>
              <h1 className="font-display text-5xl sm:text-8xl text-[#060642] tracking-tighter mb-4">
                {activeAlbum ? activeAlbum.title : "Memories Vault"}
              </h1>
              <p className="font-script text-[#c81e1e] text-3xl italic">
                {activeAlbum ? "Step inside the moment." : "Unfolding the chapters of your journey."}
              </p>
            </Reveal>
            {activeAlbumId && (
              <button onClick={() => setActiveAlbumId(null)}
                className="mt-8 flex items-center gap-2 mx-auto text-[#244681] hover:text-[#060642] transition-all uppercase tracking-widest text-[10px] font-black"
              >
                <ChevronLeft size={14} /> Return to Vault
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loadingVault ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[#244681]/40 animate-pulse mt-20 uppercase tracking-[0.5em] font-display">
                Connecting to Vault...
              </motion.div>
            ) : !activeAlbumId ? (
              <motion.div key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {albums.map((album) => (
                  <div key={album.id} onClick={() => setActiveAlbumId(album.id)}
                    className="group cursor-pointer relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-md hover:-translate-y-2 transition-all shadow-xl"
                  >
                    {album.cover ? (
                      <img src={album.cover} className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-200 font-display text-9xl italic">?</div>
                    )}
                    {/* Gradient changed to light-to-transparent */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent flex flex-col justify-end p-10">
                      <p className="text-[#c81e1e] text-[10px] tracking-[0.3em] font-black mb-2 uppercase">{album.category}</p>
                      <h3 className="font-display text-4xl text-[#060642] tracking-tight leading-none">{album.title}</h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                {loadingPhotos ? (
                   <p className="text-center text-[#244681]/40 animate-bounce font-script text-3xl py-20">Gathering photos...</p>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
                    {albumPhotos.map((item: any, i: number) => (
                      <motion.div key={i} layout onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => setSelectedMedia(item)}
                        className="break-inside-avoid mb-8 relative group rounded-3xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-sm shadow-xl cursor-pointer"
                      >
                        {item.type === "video" ? (
                          <div className="aspect-video w-full relative">
                            {hoveredIndex === i ? (
                              <iframe src={item.url + "?autoplay=1&mute=1"} className="absolute inset-0 w-full h-full" allow="autoplay" />
                            ) : (
                              <div className="absolute inset-0 w-full h-full">
                                <img src={item.thumbnailUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                   <div className="w-16 h-16 rounded-full bg-white/40 border border-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg"><span className="text-[#060642] text-2xl ml-1">▶</span></div>
                                   <p className="text-[9px] text-[#060642]/60 uppercase tracking-widest font-black">Hover to Play</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <img src={item.url} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox - Keep dark for focus on media */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#060642]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
            <div className="absolute top-6 right-6 flex gap-4 z-[110]">
               <a href={selectedMedia.downloadUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white hover:text-[#060642] flex items-center justify-center transition-all text-white border border-white/10"><Download size={20} /></a>
               <button onClick={() => setSelectedMedia(null)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition-all text-white border border-white/10"><X size={20} /></button>
            </div>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-5xl flex flex-col items-center">
              {selectedMedia.type === "video" ? (<iframe src={selectedMedia.url} className="w-full aspect-video rounded-3xl shadow-2xl" allow="autoplay" />) : (<img src={selectedMedia.url} className="max-h-[80vh] w-auto rounded-3xl shadow-2xl border border-white/10" />)}
              <p className="mt-8 font-script text-white text-3xl text-center drop-shadow-lg">{selectedMedia.caption}</p>
            </motion.div>
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedMedia(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
