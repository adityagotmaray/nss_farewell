import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ChevronLeft, ChevronRight, Search, SortAsc, SortDesc, Loader2 } from "lucide-react";
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

const RAW_PHOTOS = [
  "https://lh3.googleusercontent.com/d/1okcn2Pl_vum45Zu3chqq5K2P59X6ox42", 
  "https://lh3.googleusercontent.com/d/1Z9-bG57e1Zr7bmfYZriu40gF4IRHpDnM",
  "https://lh3.googleusercontent.com/d/1W2jl_kAo7JJEh0yEJNESM75Q8wBgjsln",
  "https://lh3.googleusercontent.com/d/1PlKTxbmxoUerpj_fqkYBWVyRUl0q1Zmk",
  "https://lh3.googleusercontent.com/d/1S8zSynpn3rGu3u0Z34tLofGrwc84whsV",
  "https://lh3.googleusercontent.com/d/1ZY5e5ux9vtZE5qP5T6yAXDyvy0hDQkCP",
  "https://lh3.googleusercontent.com/d/1n93eiF7sqJrDv5fkMuhR2S0s2WODu9gV",
  "https://lh3.googleusercontent.com/d/1CvZD5tCslRwy7dbxH2MFYh8_QXc3vtDq",
  "https://lh3.googleusercontent.com/d/1efULAvK5Rp0H4K0p3cUOtaBjItmivOsE"
];

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  
  // Drive Data States
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [loadingVault, setLoadingVault] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // Search & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. SHUFFLE LOCAL PHOTOS ON MOUNT
  const shuffledHighlights = useMemo(() => {
    return [...RAW_PHOTOS].sort(() => Math.random() - 0.5);
  }, []);

  // 2. VAULT FILTERING & SORTING LOGIC
  const filteredAlbums = useMemo(() => {
    let list = albums.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return list.sort((a, b) => {
      const yearA = parseInt(a.title.match(/\d{4}/)?.[0] || "0");
      const yearB = parseInt(b.title.match(/\d{4}/)?.[0] || "0");
      return sortOrder === 'newest' ? yearB - yearA : yearA - yearB;
    });
  }, [albums, searchQuery, sortOrder]);

  // 3. FETCH DATA
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

  // 4. SLIDESHOW NAVIGATION
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % shuffledHighlights.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + shuffledHighlights.length) % shuffledHighlights.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [shuffledHighlights]);

  // 5. VANTA
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
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
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-white/10 pointer-events-none z-[1]" />

      <div className="relative z-10">
        
        {/* SECTION 1: INTERACTIVE HERO SLIDESHOW */}
        {!activeAlbumId && (
          <section className="pt-32 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
              <Reveal>
                <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
                  <div>
                    <p className="text-[#c81e1e] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Moments of Service</p>
                    <h2 className="font-display text-5xl sm:text-7xl text-[#060642] tracking-tighter">Highlights</h2>
                  </div>
                </div>
              </Reveal>

              <div className="group relative h-[400px] sm:h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-white/20 backdrop-blur-md cursor-pointer">
                {/* Clickable Zones for Nav */}
                <div onClick={prevSlide} className="absolute left-0 inset-y-0 w-1/4 z-30 cursor-left" title="Previous" />
                <div onClick={nextSlide} className="absolute right-0 inset-y-0 w-1/4 z-30 cursor-right" title="Next" />
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={shuffledHighlights[currentSlide]}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Nav Arrows (Show on Hover) */}
                <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-opacity z-40 pointer-events-none">
                   <button onClick={prevSlide} className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform text-[#060642]"><ChevronLeft /></button>
                   <button onClick={nextSlide} className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform text-[#060642]"><ChevronRight /></button>
                </div>

                {/* Dot Navigation */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-40">
                   {shuffledHighlights.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
                        className={`h-2 rounded-full transition-all border border-white/40 shadow-sm ${i === currentSlide ? "w-10 bg-[#c81e1e]" : "w-2 bg-white/60 hover:bg-white"}`} 
                      />
                   ))}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#060642]/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: THE DRIVE VAULT WITH SEARCH & SORT */}
        <section className={`px-6 pb-20 ${activeAlbumId ? 'pt-40' : 'pt-20'}`}>
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-12">
              <Reveal>
                <h1 className="font-display text-5xl sm:text-8xl text-[#060642] tracking-tighter mb-4">
                  {activeAlbum ? activeAlbum.title : "Memories Vault"}
                </h1>
                <p className="font-script text-[#c81e1e] text-3xl italic">
                  {activeAlbum ? "Step inside the moment." : "Official event archives."}
                </p>
              </Reveal>
            </div>

            {/* VAULT CONTROLS (Only visible in Grid View) */}
            {!activeAlbumId && !loadingVault && (
              <div className="max-w-4xl mx-auto mb-16 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="Search by event or year (e.g. 2025)..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/60 border border-white/80 rounded-3xl pl-16 pr-8 py-5 text-[#060642] outline-none backdrop-blur-md shadow-xl focus:ring-2 ring-[#c81e1e]/20 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="bg-white/60 backdrop-blur-md border border-white/80 px-8 py-5 rounded-3xl flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest text-[#060642] shadow-xl hover:bg-white transition-all"
                >
                  {sortOrder === 'newest' ? <SortDesc size={16}/> : <SortAsc size={16}/>}
                  {sortOrder === 'newest' ? "Newest First" : "Oldest First"}
                </button>
              </div>
            )}

            {activeAlbumId && (
              <button onClick={() => setActiveAlbumId(null)} className="mb-12 flex items-center gap-2 mx-auto text-[#ffffff] hover:text-[#ffffff] transition-all uppercase tracking-widest text-[10px] font-black"><ChevronLeft size={14} /> Return to Vault</button>
            )}

            <AnimatePresence mode="wait">
              {loadingVault ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#244681]/10 rounded-[3rem]">
                  <Loader2 className="w-10 h-10 text-[#244681] animate-spin mb-4" />
                  <p className="text-[#244681]/40 font-display uppercase tracking-[0.3em] text-xs">Syncing with Drive...</p>
                </div>
              ) : !activeAlbumId ? (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredAlbums.map((album) => (
                    <div key={album.id} onClick={() => setActiveAlbumId(album.id)}
                      className="group cursor-pointer relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-md hover:-translate-y-2 transition-all shadow-xl"
                    >
                      {album.cover ? <img src={album.cover} className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-110 transition-all duration-1000" /> : <div className="absolute inset-0 bg-slate-100" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent flex flex-col justify-end p-10">
                        <p className="text-[#c81e1e] text-[10px] tracking-[0.3em] font-black mb-2 uppercase">{album.category || "NSS Event"}</p>
                        <h3 className="font-display text-4xl text-[#060642] tracking-tight leading-none">{album.title}</h3>
                      </div>
                    </div>
                  ))}
                  {filteredAlbums.length === 0 && <p className="col-span-full text-center py-20 font-script text-3xl text-slate-400">No memories match your search...</p>}
                </motion.div>
              ) : (
                <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  {loadingPhotos ? (
                     <div className="flex flex-col items-center justify-center py-40"><Loader2 className="w-12 h-12 text-[#c81e1e] animate-spin mb-4" /><p className="font-script text-[#244681] text-3xl">Opening the archive...</p></div>
                  ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
                      {albumPhotos.map((item: any, i: number) => (
                        <motion.div key={i} layout onClick={() => setSelectedMedia(item)} className="break-inside-avoid mb-8 relative group rounded-3xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-sm shadow-xl cursor-pointer">
                          <img src={item.url} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Lightbox remains the same */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#060642]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
            <div className="absolute top-6 right-6 flex gap-4 z-[110]">
               <a href={selectedMedia.downloadUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white flex items-center justify-center transition-all text-white border border-white/10"><Download size={20} /></a>
               <button onClick={() => setSelectedMedia(null)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition-all text-white border border-white/10"><X size={20} /></button>
            </div>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-5xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img src={selectedMedia.url} className="max-h-[80vh] w-auto rounded-3xl shadow-2xl border border-white/10" />
              <p className="mt-8 font-script text-white text-3xl text-center drop-shadow-lg">{selectedMedia.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
