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
// CONFIGURATION: PASTE YOUR LINKS HERE
// ============================================================
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_NEW_WEB_APP_URL_HERE";
const PARENT_DRIVE_FOLDER_ID = "1yCcnLb29ST1wPBGolNlpsgSbufVuoLwj";

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  
  // State for data
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  
  // State for loading
  const [loadingVault, setLoadingVault] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  
  // State for Lightbox
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // 1. Initial Load: Fetch folder list only (FAST)
  useEffect(() => {
    fetch(`${GOOGLE_SCRIPT_URL}?mode=list&id=${PARENT_DRIVE_FOLDER_ID}`)
      .then(res => res.json())
      .then(data => {
        setAlbums(data);
        setLoadingVault(false);
      })
      .catch(err => console.error("Vault Error:", err));
  }, []);

  // 2. Secondary Load: Fetch photos only when a folder is clicked (FAST)
  useEffect(() => {
    if (activeAlbumId) {
      setLoadingPhotos(true);
      setAlbumPhotos([]); // Reset grid
      fetch(`${GOOGLE_SCRIPT_URL}?mode=photos&id=${activeAlbumId}`)
        .then(res => res.json())
        .then(data => {
          setAlbumPhotos(data);
          setLoadingPhotos(false);
        })
        .catch(err => console.error("Photos Error:", err));
    }
  }, [activeAlbumId]);

  // 3. Vanta Cloud Effect (Midnight Blue Theme)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
        backgroundColor: 0x010c1e, skyColor: 0x001f3f, cloudColor: 0x112240,
        cloudShadowColor: 0x010c1e, sunColor: 0xffd700, sunlightColor: 0x233554,
        speed: 1.2 
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const activeAlbum = albums.find(a => a.id === activeAlbumId);

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />

      {/* BACKGROUND LAYERS */}
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-[1]" />
      <div className="fixed inset-0 z-[2] stars-layer animate-twinkle pointer-events-none opacity-40" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <div className="text-center mb-16">
            <Reveal>
              <h1 className="font-display text-5xl sm:text-8xl text-white tracking-tighter mb-4">
                {activeAlbum ? activeAlbum.title : "Memories Vault"}
              </h1>
              <p className="font-script text-accent text-2xl italic">
                {activeAlbum ? "A walk down memory lane." : "Unfolding the chapters of your journey."}
              </p>
            </Reveal>
            
            {activeAlbumId && (
              <button onClick={() => setActiveAlbumId(null)}
                className="mt-8 flex items-center gap-2 mx-auto text-accent hover:text-white transition-all uppercase tracking-widest text-[10px] font-black"
              >
                <ChevronLeft size={14} /> Back to Vault
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loadingVault ? (
              /* INITIAL LOADER */
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-accent/30 animate-pulse mt-20 font-display uppercase tracking-widest">
                Connecting to Drive...
              </motion.div>
            ) : !activeAlbumId ? (
              /* ALBUM LIST (THE FOLDERS) */
              <motion.div key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {albums.map((album) => (
                  <div key={album.id} onClick={() => setActiveAlbumId(album.id)}
                    className="group cursor-pointer relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl hover:-translate-y-2 transition-all bg-white/5"
                  >
                    {album.cover ? (
                      <img src={album.cover} className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white/5 font-display text-9xl">?</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
                      <p className="text-accent text-[10px] tracking-[0.3em] font-bold mb-2 uppercase">{album.category}</p>
                      <h3 className="font-display text-4xl text-white tracking-tight leading-none">{album.title}</h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              /* GALLERY VIEW (INSIDE THE ALBUM) */
              <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                {loadingPhotos ? (
                   <div className="text-center py-20">
                      <p className="text-accent/40 animate-bounce font-script text-3xl">Unfolding the album...</p>
                   </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
                    {albumPhotos.map((item: any, i: number) => (
                      <motion.div key={i} layout onClick={() => setSelectedMedia(item)}
                        className="break-inside-avoid mb-8 relative group rounded-3xl overflow-hidden border border-white/5 bg-white/5 shadow-2xl cursor-pointer"
                      >
                        {item.type === "video" ? (
                          <div className="aspect-video flex items-center justify-center bg-black/40">
                             <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40">
                                <span className="text-accent text-xl ml-1">▶</span>
                             </div>
                          </div>
                        ) : (
                          <img src={item.url} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                          <p className="text-white font-script text-xl opacity-80">{item.caption}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
          >
            {/* Toolbar */}
            <div className="absolute top-6 right-6 flex gap-4 z-[110]">
               <a href={selectedMedia.downloadUrl} target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-accent hover:text-black flex items-center justify-center transition-all text-white border border-white/10"
               >
                 <Download size={20} />
               </a>
               <button onClick={() => setSelectedMedia(null)}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-red-500 flex items-center justify-center transition-all text-white border border-white/10"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Media */}
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-5xl flex flex-col items-center">
              {selectedMedia.type === "video" ? (
                <iframe src={selectedMedia.url} className="w-full aspect-video rounded-3xl shadow-2xl" allow="autoplay" />
              ) : (
                <img src={selectedMedia.url} className="max-h-[80vh] w-auto rounded-3xl shadow-2xl border border-white/5" />
              )}
              <p className="mt-8 font-script text-accent text-3xl text-center drop-shadow-lg">{selectedMedia.caption}</p>
            </motion.div>

            {/* Close on background tap */}
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedMedia(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .stars-layer {
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 300px 300px;
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.6; } }
        .animate-twinkle { animation: twinkle 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
