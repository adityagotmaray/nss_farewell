import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Download, X, ChevronLeft, Film } from "lucide-react";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [{ title: "Memories Vault — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: MemoriesPage,
});

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

  useEffect(() => {
    fetch(`${GOOGLE_SCRIPT_URL}?mode=list&id=${PARENT_DRIVE_FOLDER_ID}`)
      .then(res => res.json())
      .then(data => { setAlbums(data); setLoadingVault(false); });
  }, []);

  useEffect(() => {
    if (activeAlbumId) {
      setLoadingPhotos(true);
      fetch(`${GOOGLE_SCRIPT_URL}?mode=photos&id=${activeAlbumId}`)
        .then(res => res.json())
        .then(data => { setAlbumPhotos(data); setLoadingPhotos(false); });
    }
  }, [activeAlbumId]);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
        backgroundColor: 0x010c1e, skyColor: 0x001f3f, cloudColor: 0x112240,
        sunColor: 0xffd700, sunlightColor: 0x233554, speed: 1.2 
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const activeAlbum = albums.find(a => a.id === activeAlbumId);

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/50 pointer-events-none z-[1]" />
      <div className="fixed inset-0 z-[2] stars-layer animate-twinkle pointer-events-none opacity-40" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <LayoutGroup>
            <div className="text-center mb-16">
              <motion.h1 layoutId="page-title" className="font-display text-5xl sm:text-8xl text-white tracking-tighter mb-4">
                {activeAlbum ? activeAlbum.title : "Memories Vault"}
              </motion.h1>
              
              <AnimatePresence>
                {activeAlbumId && (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    onClick={() => setActiveAlbumId(null)}
                    className="mt-4 flex items-center gap-2 mx-auto text-accent hover:text-white transition-all uppercase tracking-widest text-[10px] font-bold"
                  >
                    <ChevronLeft size={14} /> Return to Vault
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {loadingVault ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-accent/30 animate-pulse mt-20 font-display">
                  Accessing the Vault...
                </motion.div>
              ) : !activeAlbumId ? (
                /* 10. ALBUM GRID WITH LAYOUT TRANSITION */
                <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {albums.map((album) => (
                    <motion.div 
                      key={album.id} 
                      layoutId={`album-${album.id}`}
                      onClick={() => setActiveAlbumId(album.id)}
                      className="group cursor-pointer relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5"
                    >
                      <motion.img layoutId={`img-${album.id}`} src={album.cover} className="absolute inset-0 h-full w-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                        <p className="text-accent text-[10px] tracking-[0.3em] font-black uppercase mb-1">{album.category}</p>
                        <h3 className="font-display text-3xl text-white">{album.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* GALLERY VIEW */
                <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  {/* Transition Overlay */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/60 z-[-1] pointer-events-none" />
                  
                  {loadingPhotos ? (
                    <p className="text-center text-accent/40 animate-bounce font-script text-3xl py-20">Unrolling the film...</p>
                  ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
                      {albumPhotos.map((item, i) => (
                        <motion.div key={i} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedMedia(item)}
                          className="break-inside-avoid mb-8 relative group rounded-3xl overflow-hidden border border-white/5 shadow-2xl cursor-pointer bg-white/5"
                        >
                          {item.type === "video" ? (
                            <div className="aspect-video flex items-center justify-center">
                               <img src={item.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                               <div className="relative z-10 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40"><span className="text-accent text-xl ml-1">▶</span></div>
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
          </LayoutGroup>
        </div>
      </div>

      {/* 11. LIGHTBOX WITH FILM STRIP */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-between py-10">
            
            {/* Toolbar */}
            <div className="w-full px-10 flex justify-between items-center">
               <div className="flex items-center gap-3 text-white/40">
                  <Film size={18} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">NSS Film Roll</span>
               </div>
               <div className="flex gap-4">
                 <a href={selectedMedia.downloadUrl} target="_blank" className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent hover:text-black flex items-center justify-center transition-all text-white border border-white/10"><Download size={18} /></a>
                 <button onClick={() => setSelectedMedia(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500 flex items-center justify-center transition-all text-white border border-white/10"><X size={18} /></button>
               </div>
            </div>

            {/* Main Stage */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-grow flex items-center justify-center p-6 w-full max-w-5xl">
              {selectedMedia.type === "video" ? (
                <iframe src={selectedMedia.url + "?autoplay=1"} className="w-full aspect-video rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" allow="autoplay" />
              ) : (
                <img src={selectedMedia.url} className="max-h-[60vh] w-auto rounded-2xl shadow-2xl border border-white/5" />
              )}
            </motion.div>

            {/* THE FILM STRIP (Horizontal Scroller) */}
            <div className="w-full film-strip-container">
               <div className="flex gap-4 overflow-x-auto px-10 no-scrollbar pb-2">
                  {albumPhotos.map((thumb, idx) => (
                    <img 
                      key={idx} 
                      src={thumb.type === 'video' ? thumb.thumbnailUrl : thumb.url} 
                      onClick={() => setSelectedMedia(thumb)}
                      className={`film-thumbnail ${selectedMedia.url === thumb.url ? 'active' : ''}`}
                    />
                  ))}
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
