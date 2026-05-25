import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ChevronLeft, ChevronRight, Search, SortAsc, SortDesc, Loader2, ImageOff } from "lucide-react";
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
  "16JDdK58F8Ncp5mlbcwYZh3BzLRE6cZxa", 
  "1CdO0SzoBQFYHxahT4SxkPA36GRUcPNxW",
  "1EkCZvr3CDVkVOCHI9mt8tfDiN6qBbtjS",
  "1Pgnj0zk96cienvzZGuZ6CqGVl-TRczGV",
  "1_-tktQh-4pXjkFLXrFMNZDOc76Fxdm0Z",
  "1is-SvvlEp5OOzuQ8pQp_8BEYOb4JB1Oj",
  "1seoinRMuDzaP8q2Jh4eeyUO40n_ipght",
  "1UmNVYgsLkTPpy2UTgPw20e2DpSLihoXq",
  "1tB6uG4TfTzsAISO0p06w2J9AnjbzTVH5",
  "1aSIjLyeTFROYo0wApOM2h--aepU0G6yH",
  "1E7bGFcfFGkin7H7BGhtC31Gyk31zpREo",
  "1tNe_TkGLFyWInUncX0L9sJhVV1Mi57qZ",
  "1vcBCbpJH0OCMXJgL242eQEXhl_xRLfYQ",
  "13XbPJgyaJbCg-NUvQD-vhSffr0p0OLOT",
  "17wnLqdTeVtI5ZRj9cF2GakiL39oQDfWX",
  "1AjnmjOaipqbsjsNZNAmhxhuXVhg5YjVm",
  "1N3KPsvsExmHUExz8cmaOZI8JYgJMa5k8",
  "1P4YA1HKoZ8CR8DxtuMJuuBr0E0ZXYwTQ",
  "1VEOLSrX-rjFz-N_ky7SC_G269UlVFTub",
  "1WpX8na-yvCF9Ox1A-9fsDLg6WmVOmOvt",
  "1XR_wZXye2e2BmQkEiNldWV_sPCL1Njeg",
  "1YGr3OaLFA3xtJc_zd0TSON_JIcKN5oBG",
  "1e9rhMuhcSbrvT8EpQ0qyhPUNuaNomUlE",
  "1gJxH5B9574flesC1o_4XaEg_CGVi02Pi",
  "1Dd17-qeDofbM7cHB5bDat-cBKeukVINz",
  "1JcbEd8xpNr8JcJ3DmcdoW93T7Mxh0pwp",
  "1YS_pqS4lObaWGQIWV9AuWBf0zQwscS7s",
  "1k49PH12GW_7UmTboLvVAIczRRx0poWmw",
  "1cO7AYh3xFluBpXobIqM44kGhzWskhuag",
  "17ip1iC3LUhYxGKiROqRgCamEPMKIMTcs",
  "1Q3wJpRQ1WhBzMmyAmmiQCT8WFkGGsb_g",
  "1kwc_zgszk3Ik5AZh6pXbpUOW7Q-0LYLR"
];

// Helper to construct Google Drive direct links reliably
const getDriveUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}=s1600`;

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [loadingVault, setLoadingVault] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

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
      .then(data => { setAlbums(data); setLoadingVault(false); })
      .catch(() => setLoadingVault(false));
  }, []);

  useEffect(() => {
    if (activeAlbumId) {
      setLoadingPhotos(true);
      fetch(`${GOOGLE_SCRIPT_URL}?mode=photos&id=${activeAlbumId}`)
        .then(res => res.json())
        .then(data => { setAlbumPhotos(data); setLoadingPhotos(false); })
        .catch(() => setLoadingPhotos(false));
    }
  }, [activeAlbumId]);

  // 4. SLIDESHOW NAVIGATION
  const nextSlide = () => {
    setImageLoading(true);
    setCurrentSlide((prev) => (prev + 1) % shuffledHighlights.length);
  };
  const prevSlide = () => {
    setImageLoading(true);
    setCurrentSlide((prev) => (prev - 1 + shuffledHighlights.length) % shuffledHighlights.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
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

              <div className="group relative h-[400px] sm:h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-white/40 backdrop-blur-md cursor-pointer">
                {/* Clickable Zones for Nav */}
                <div onClick={prevSlide} className="absolute left-0 inset-y-0 w-1/4 z-30 cursor-left" title="Previous" />
                <div onClick={nextSlide} className="absolute right-0 inset-y-0 w-1/4 z-30 cursor-right" title="Next" />
                
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Loader2 className="w-10 h-10 text-[#060642] animate-spin opacity-40" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={getDriveUrl(shuffledHighlights[currentSlide])}
                    onLoad={() => setImageLoading(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Nav Arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-opacity z-40 pointer-events-none">
                   <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform text-[#060642]"><ChevronLeft /></button>
                   <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 transition-transform text-[#060642]"><ChevronRight /></button>
                </div>

                {/* Dot Navigation */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-40">
                   {shuffledHighlights.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); setImageLoading(true); }}
                        className={`h-1.5 rounded-full transition-all ${i === currentSlide ? "w-8 bg-[#c81e1e]" : "w-1.5 bg-white/40 hover:bg-white"}`} 
                      />
                   ))}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#060642]/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: THE DRIVE VAULT */}
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

            {!activeAlbumId && !loadingVault && (
              <div className="max-w-4xl mx-auto mb-16 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="Search by event or year..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/60 border border-white/80 rounded-3xl pl-16 pr-8 py-5 text-[#060642] outline-none backdrop-blur-md shadow-xl focus:ring-2 ring-[#c81e1e]/20 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="bg-white/60 backdrop-blur-md border border-white/80 px-8 py-5 rounded-3xl flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest text-[#060642] shadow-xl hover:bg-white transition-all"
                >
                  {sortOrder === 'newest' ? <SortDesc size={16}/> : <SortAsc size={16}/>}
                  {sortOrder === 'newest' ? "Newest" : "Oldest"}
                </button>
              </div>
            )}

            {activeAlbumId && (
              <button onClick={() => setActiveAlbumId(null)} className="mb-12 flex items-center gap-2 mx-auto text-[#060642] hover:scale-105 transition-all uppercase tracking-widest text-[10px] font-black"><ChevronLeft size={14} /> Back to Vault</button>
            )}

            <AnimatePresence mode="wait">
              {loadingVault ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#244681]/10 rounded-[3rem]">
                  <Loader2 className="w-10 h-10 text-[#244681] animate-spin mb-4" />
                  <p className="text-[#244681]/40 font-display uppercase tracking-[0.3em] text-xs">Connecting to Drive...</p>
                </div>
              ) : !activeAlbumId ? (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredAlbums.map((album) => (
                    <div key={album.id} onClick={() => setActiveAlbumId(album.id)}
                      className="group cursor-pointer relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-md hover:-translate-y-2 transition-all shadow-xl"
                    >
                      {album.cover ? (
                        <img 
                            src={album.cover} 
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-110 transition-all duration-1000" 
                        />
                      ) : <div className="absolute inset-0 bg-slate-100" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent flex flex-col justify-end p-10">
                        <p className="text-[#c81e1e] text-[10px] tracking-[0.3em] font-black mb-2 uppercase">{album.category || "NSS Event"}</p>
                        <h3 className="font-display text-4xl text-[#060642] tracking-tight leading-none">{album.title}</h3>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  {loadingPhotos ? (
                     <div className="flex flex-col items-center justify-center py-40"><Loader2 className="w-12 h-12 text-[#c81e1e] animate-spin mb-4" /><p className="font-script text-[#244681] text-3xl">Decrypting memories...</p></div>
                  ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
                      {albumPhotos.map((item: any, i: number) => (
                        <motion.div key={i} layout onClick={() => setSelectedMedia(item)} className="break-inside-avoid mb-8 relative group rounded-3xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-sm shadow-xl cursor-pointer">
                          <img 
                            src={item.url} 
                            referrerPolicy="no-referrer"
                            className="w-full h-auto transition-transform duration-700 group-hover:scale-105" 
                          />
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

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#060642]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
            <div className="absolute top-6 right-6 flex gap-4 z-[110]">
               <a href={selectedMedia.downloadUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white flex items-center justify-center transition-all text-white border border-white/10"><Download size={20} /></a>
               <button onClick={() => setSelectedMedia(null)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition-all text-white border border-white/10"><X size={20} /></button>
            </div>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-5xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={selectedMedia.url} 
                referrerPolicy="no-referrer"
                className="max-h-[80vh] w-auto rounded-3xl shadow-2xl border border-white/10" 
              />
              <p className="mt-8 font-script text-white text-3xl text-center drop-shadow-lg">{selectedMedia.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
