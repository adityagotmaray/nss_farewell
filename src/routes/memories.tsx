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

// Helper to construct Google Drive direct links reliably
const getDriveUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}=s2000`;

const RAW_PHOTOS = [
  "16JDdK58F8Ncp5mlbcwYZh3BzLRE6cZxa", "1CdO0SzoBQFYHxahT4SxkPA36GRUcPNxW", "1EkCZvr3CDVkVOCHI9mt8tfDiN6qBbtjS",
  "1Pgnj0zk96cienvzZGuZ6CqGVl-TRczGV", "1_-tktQh-4pXjkFLXrFMNZDOc76Fxdm0Z", "1is-SvvlEp5OOzuQ8pQp_8BEYOb4JB1Oj",
  "1seoinRMuDzaP8q2Jh4eeyUO40n_ipght", "1UmNVYgsLkTPpy2UTgPw20e2DpSLihoXq", "1tB6uG4TfTzsAISO0p06w2J9AnjbzTVH5",
  "1aSIjLyeTFROYo0wApOM2h--aepU0G6yH", "1E7bGFcfFGkin7H7BGhtC31Gyk31zpREo", "1tNe_TkGLFyWInUncX0L9sJhVV1Mi57qZ",
  "1vcBCbpJH0OCMXJgL242eQEXhl_xRLfYQ", "13XbPJgyaJbCg-NUvQD-vhSffr0p0OLOT", "17wnLqdTeVtI5ZRj9cF2GakiL39oQDfWX",
  "1AjnmjOaipqbsjsNZNAmhxhuXVhg5YjVm", "1N3KPsvsExmHUExz8cmaOZI8JYgJMa5k8", "1P4YA1HKoZ8CR8DxtuMJuuBr0E0ZXYwTQ",
  "1VEOLSrX-rjFz-N_ky7SC_G269UlVFTub", "1WpX8na-yvCF9Ox1A-9fsDLg6WmVOmOvt", "1XR_wZXye2e2BmQkEiNldWV_sPCL1Njeg",
  "1YGr3OaLFA3xtJc_zd0TSON_JIcKN5oBG", "1e9rhMuhcSbrvT8EpQ0qyhPUNuaNomUlE", "1gJxH5B9574flesC1o_4XaEg_CGVi02Pi",
  "1Dd17-qeDofbM7cHB5bDat-cBKeukVINz", "1JcbEd8xpNr8JcJ3DmcdoW93T7Mxh0pwp", "1YS_pqS4lObaWGQIWV9AuWBf0zQwscS7s",
  "1k49PH12GW_7UmTboLvVAIczRRx0poWmw", "1cO7AYh3xFluBpXobIqM44kGhzWskhuag", "17ip1iC3LUhYxGKiROqRgCamEPMKIMTcs",
  "1Q3wJpRQ1WhBzMmyAmmiQCT8WFkGGsb_g", "1kwc_zgszk3Ik5AZh6pXbpUOW7Q-0LYLR"
];

function MemoriesPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [loadingVault, setLoadingVault] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const shuffledHighlights = useMemo(() => [...RAW_PHOTOS].sort(() => Math.random() - 0.5), []);

  const nextSlide = () => { setImageLoading(true); setCurrentSlide((prev) => (prev + 1) % shuffledHighlights.length); };
  const prevSlide = () => { setImageLoading(true); setCurrentSlide((prev) => (prev - 1 + shuffledHighlights.length) % shuffledHighlights.length); };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [shuffledHighlights]);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
        backgroundColor: 0xf1eef7, skyColor: 0x244681, cloudColor: 0x143047, cloudShadowColor: 0xf5f9fc,
        sunColor: 0xfff9f2, sunGlareColor: 0xfff9f7, sunlightColor: 0xf7f4f0, speed: 1.0 
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-white/10 pointer-events-none z-[1]" />

      <div className="relative z-10">
        {!activeAlbumId && (
          <section className="pt-32 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
              <Reveal>
                <div className="mb-10">
                  <p className="text-[#c81e1e] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Moments of Service</p>
                  <h2 className="font-display text-5xl sm:text-7xl text-[#060642] tracking-tighter">Highlights</h2>
                </div>
              </Reveal>

              {/* SLIDESHOW CONTAINER */}
              <div className="group relative h-[500px] sm:h-[700px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-[#060642]/10 backdrop-blur-md">
                
                {imageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/10 backdrop-blur-sm">
                        <Loader2 className="w-10 h-10 text-[#060642] animate-spin mb-4" />
                        <p className="text-[#060642]/40 font-display uppercase tracking-[0.2em] text-[10px]">Loading Memory...</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* 1. BLURRED BACKGROUND (Handles vertical photo edges) */}
                    <img
                      src={getDriveUrl(shuffledHighlights[currentSlide])}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
                    />
                    
                    {/* 2. SHARP FOREGROUND (Shows entire image without cropping) */}
                    <img
                      src={getDriveUrl(shuffledHighlights[currentSlide])}
                      onLoad={() => setImageLoading(false)}
                      referrerPolicy="no-referrer"
                      className="relative z-10 w-full h-full object-contain p-4 sm:p-12"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Click Navigation Overlays */}
                <div onClick={prevSlide} className="absolute left-0 inset-y-0 w-1/4 z-30 cursor-pointer" />
                <div onClick={nextSlide} className="absolute right-0 inset-y-0 w-1/4 z-30 cursor-pointer" />

                {/* Arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-all z-40 pointer-events-none">
                   <button onClick={prevSlide} className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 active:scale-95 transition-all text-[#060642]"><ChevronLeft /></button>
                   <button onClick={nextSlide} className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 active:scale-95 transition-all text-[#060642]"><ChevronRight /></button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-40">
                   {shuffledHighlights.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); setImageLoading(true); }}
                        className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-10 bg-[#c81e1e]" : "w-2 bg-white/40 hover:bg-white"}`} 
                      />
                   ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ... (Rest of your Vault code remains the same as previously optimized) ... */}
      </div>
    </div>
  );
}
