import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion } from "framer-motion";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";
import eminenceLogo from "../assets/eminence-logo.png";

export const Route = createFileRoute("/tribute")({
  head: () => ({
    meta: [{ title: "NSS Farewell — Journey" }],
    links: FONT_LINKS,
  }),
  component: JourneyPage,
});

// ==========================================================
// BACKEND: DATA
// ==========================================================
const TIMELINE = [
  {
    year: "2024",
    events: [
      { 
        title: "Flash Mob 2024", 
        body: "Spreading energy and awareness through rhythm. A vibrant performance that captured the campus's attention for a cause.",
        photo: "https://lh3.googleusercontent.com/d/1okcn2Pl_vum45Zu3chqq5K2P59X6ox42" 
      },
      { 
        title: "National Space Day", 
        body: "Celebrating India's reach to the stars. A day to inspire scientific temper and pride among our volunteers.",
        photo: "https://lh3.googleusercontent.com/d/1GsKWV_eRS9oq5aUfIqxqMm50cco04V4T" 
      },
      { 
        title: "Hindi Diwas", 
        body: "Honoring our linguistic heritage. A day dedicated to the beauty and cultural significance of our mother tongue.",
        photo: "https://lh3.googleusercontent.com/d/1TRXGXEsM8CrtIZyXdC243zJsKOdE77gF" 
      },
      { 
        title: "IGKV NSS Foundation Day", 
        body: "Celebrating the roots of our service. A moment to reflect on the history and impact of the NSS unit at our institution.",
        photo: "https://lh3.googleusercontent.com/d/1gA2C4VTQFMNT3A0-l8z1wgBL3ZYixgti" 
      },
      { 
        title: "Cleanliness Drive", 
        body: "Living the Swachh Bharat mission. Armed with brooms and dedication, we transformed our surrounding environment.",
        photo: "https://lh3.googleusercontent.com/d/1m5NRygyRDrJleLqof4ynjnopUBI4aY4T" 
      },
      { 
        title: "Induction Program", 
        body: "Welcoming the fresh faces into the NSS family. The start of a new chapter of service for our juniors.",
        photo: "https://lh3.googleusercontent.com/d/11JYMPierfuYeRcQbZrYnpVYw7Byz_fif" 
      },
      { 
        title: "Chitra-Varnan Pratiyogita", 
        body: "Where creativity met social awareness. Volunteers used art to describe the reality of the society around them.",
        photo: "https://lh3.googleusercontent.com/d/1khmiyDcNhrAuNuyFqxCg5od8ORbacJTt" 
      },
      { 
        title: "Tug Of War", 
        body: "Unity, strength, and sportsmanship. A day of physical grit where we learned that we are stronger when we pull together.",
        photo: "https://lh3.googleusercontent.com/d/1zoyjTewg6o3ZZ8Z_d_1winTGQZG2BONO" 
      },
      { 
        title: "Diwali Awareness", 
        body: "Spreading the light of safety. Educating the community on an eco-friendly and responsible celebration of lights.",
        photo: "https://lh3.googleusercontent.com/d/1oF93mRIE9oHCrVaFY_3gC322Ly-yvvAo" 
      },
      { 
        title: "Blood Donation Camp 2024", 
        body: "The ultimate gift. Seniors and juniors joined hands to save lives, proving that service flows in our veins.",
        photo: "https://lh3.googleusercontent.com/d/1T9jV4y3L1NRzBFa3SUuNm9_OECnLrbwx" 
      }
    ]
  },
  {
    year: "2025",
    events: [
      { 
        title: "National Youth Day", 
        body: "Celebrating the birth of Swami Vivekananda. Empowering the youth to take charge of the nation's future.",
        photo: "https://lh3.googleusercontent.com/d/1beIWoyIWHorI24O5jm0nbC7iTGyK1EWq" 
      },
      { 
        title: "National Girl Child Day", 
        body: "Advocating for equality and empowerment. Spreading awareness about the rights and potential of every girl child.",
        photo: "https://lh3.googleusercontent.com/d/1R7oCmkFMgsNaEn_qUMRI4bCfYUVgducn" 
      },
      { 
        title: "7-Day Special Camp", 
        body: "Life in the village. Seven days of shramadaan, community surveys, and bonds that will last a lifetime.",
        photo: "https://lh3.googleusercontent.com/d/1iRf3jAjJCmewZOub3h4o_yZdGCJilP8L" 
      },
      { 
        title: "B Certificate Exam", 
        body: "A milestone in the NSS journey. Demonstrating our theoretical and practical knowledge of social service.",
        photo: "https://lh3.googleusercontent.com/d/1RJLbJq9afAU-0lVybU0wxfPNOyJUqqpn" 
      },
      { 
        title: "Rabindranath Tagore Jayanti", 
        body: "Celebrating the Bard of Bengal. A cultural tribute to the man who gave us the anthem of our service.",
        photo: "https://lh3.googleusercontent.com/d/1r9JIlaZqfvISkxJpXr8GlBJO4cZr48Cw" 
      },
      { 
        title: "Ek Ped Maa Ke Naam 2.0", 
        body: "Sustainable service. Planting saplings in honor of our mothers, securing a greener future for the generations to come.",
        photo: "https://lh3.googleusercontent.com/d/19VoQJ-EVg3UmvaWnnbEiGGY_xOLddRP3" 
      },
      { 
        title: "International Yoga Day", 
        body: "Harmony of mind and body. A morning of collective wellness under the rising sun.",
        photo: "https://lh3.googleusercontent.com/d/1jhDIDbw-jGZAITCVthw_4BJfSw3Ke07U" 
      },
      { 
        title: "Sarv-Hitaya", 
        body: "For the benefit of all. A dedicated drive to reach out to the marginalized and provide essential support.",
        photo: "https://lh3.googleusercontent.com/d/15IjFP7rKRLZ5Jpa5xC3sCr1_kbKhx-GI" 
      },
      { 
        title: "Independence Day 2025", 
        body: "The tricolor flies high. A day of patriotic fervor and a renewed pledge to serve the motherland.",
        photo: "https://lh3.googleusercontent.com/d/1SYowk2kpqtPazDmTfv63EvoERFzkO-BV" 
      },
      { 
        title: "Flash Mob HIV/AIDS Awareness", 
        body: "Breaking the silence. Using the power of street performance to educate and remove the stigma around AIDS.",
        photo: "https://lh3.googleusercontent.com/d/1Ly3VbtgiuOfJayXBJ5DEx37BkWp2UP_9" 
      },
      { 
        title: "Raktdaan Amrit Mahotsav 2.0", 
        body: "Another massive milestone in saving lives. A day of sacrifice and immense pride for our unit.",
        photo: "https://lh3.googleusercontent.com/d/1lKU4LKWvcrwZcbmpi_U5O8q1EXhrM565" 
      },
      { 
        title: "Oath Taking Seva Pakhwada", 
        body: "A fortnight of commitment. Renewing our vows to remain selfless and dedicated to the mission of service.",
        photo: "https://lh3.googleusercontent.com/d/1dxRa-TQE9of8OrsVwsWHqMlFUO1zzL9D" 
      },
      { 
        title: "NSS Foundation Day", 
        body: "Celebrating another year of the unit's existence. A day of joy, awards, and looking back at our achievements.",
        photo: "https://lh3.googleusercontent.com/d/1FaXkcoUHUHX35Poi2zrjuOi9I86Bfbsm" 
      },
      { 
        title: "Diwali Awareness And Fundraising", 
        body: "Bringing lights to the dark corners. Raising funds through charity to support those in need during the festive season.",
        photo: "https://lh3.googleusercontent.com/d/1h6q8xde2uyX1JdpROsHGWSi_dM3TRTqX" 
      },
      { 
        title: "One Day Camp", 
        body: "Intense, short-term service. A focused drive to complete a specific community goal within 24 hours.",
        photo: "https://lh3.googleusercontent.com/d/1iVFm_wYfEPtF7Cu_jXae9np6-VJN9-_i" 
      },
      { 
        title: "1st Dec World AIDS Day", 
        body: "A global stand for health. Joining the world in spreading awareness and honoring those lost to the fight.",
        photo: "https://lh3.googleusercontent.com/d/10MhtFSiXZLN4B9XSvwtGWPKcKkpnSFUe" 
      },
      { 
        title: "Samarpanam (Blood donation Camp)", 
        body: "A dedicated act of surrender to the cause. Our final blood drive of the session, fueled by pure passion.",
        photo: "https://lh3.googleusercontent.com/d/11xo6i7EqVIuXtka5-K_DVNlH5w4FZ-bI" 
      }
    ]
  },
  {
    year: "2026",
    events: [
      { 
        title: "Run For Swadeshi", 
        body: "Fitness meets nationalism. A marathon dedicated to promoting local products and a healthy lifestyle.",
        photo: "https://lh3.googleusercontent.com/d/11-PCcR-oPuslcrg5wi52uKASN6_iG2tr" 
      },
      { 
        title: "7-Day Special Unit Camp", 
        body: "The final camp for our seniors. A bittersweet week of memories, shramadaan, and saying goodbye to the fields.",
        photo: "https://lh3.googleusercontent.com/d/16--9UmAdhJF7SA7uNTCZDJ9_wh5Iha94" 
      }
    ]
  }
];

function JourneyPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        CLOUDS({
          el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
          /* UPDATED TO YOUR PREFERRED COLORS */
          backgroundColor: 0xf1eef7, 
          skyColor: 0x244681,   
          cloudColor: 0x143047,
          cloudShadowColor: 0xf5f9fc,
          sunColor: 0xfff9f2,
          sunGlareColor: 0xfff9f7,
          sunlightColor: 0xf7f4f0,
          speed: 1.0
        })
      );
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const scrollToStory = () => storyRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      {/* Light Overlay instead of black */}
      <div className="fixed inset-0 bg-white/10 pointer-events-none z-[1]" />

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <Reveal>
            <img src={eminenceLogo} alt="Logo" className="h-90 w-90 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
            <div className="mb-6 px-4 py-1 border border-accent/30 rounded-full bg-white/40 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#060642] font-black">National Service Scheme • Batch 2022—2026</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="font-display text-7xl sm:text-9xl tracking-tighter leading-none text-[#060642]">
               <span className="italic">Eminence</span>
            </h1>
            <p className="font-display italic text-4xl sm:text-5xl mt-4 text-[#244681] tracking-widest">Farewell - 2k26</p>
          </Reveal>
          <Reveal delay={400}>
            <button onClick={scrollToStory} className="mt-12 px-10 py-4 bg-[#060642] text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(6,6,66,0.2)]">Relive Memories</button>
          </Reveal>
        </section>

        <div ref={storyRef} className="pt-32 pb-24 px-6 text-center">
            <p className="font-script text-[#c81e1e] text-4xl mb-4 italic">the story of</p>
            <h1 className="font-display text-6xl sm:text-9xl text-[#060642] tracking-tighter">Their NSS Journey</h1>
        </div>

        {/* ALTERNATING TIMELINE SECTION */}
        <section className="relative pb-40 px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Main Vertical Line (Changed to Navy) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#244681]/30 to-transparent hidden md:block" />
          
          <div className="space-y-40">
            {TIMELINE.map((yearGroup, yearIndex) => {
              const isYearLeft = yearIndex % 2 === 0;
              return (
                <div key={yearGroup.year} className="relative">
                  
                  {/* Big Year Marker */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="flex justify-center mb-20 relative z-20"
                  >
                    <div className="bg-white/80 border-2 border-[#244681]/40 px-8 py-3 rounded-2xl shadow-xl backdrop-blur-md">
                      <span className="font-display text-[#060642] text-5xl sm:text-7xl italic">{yearGroup.year}</span>
                    </div>
                  </motion.div>

                  <div className="space-y-32">
                    {yearGroup.events.map((event, eventIndex) => (
                      <motion.div 
                        key={eventIndex}
                        initial={{ opacity: 0, x: isYearLeft ? -100 : 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`flex flex-col ${isYearLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
                      >
                        {/* 1. TEXT SIDE */}
                        <div className="w-full md:w-1/2 space-y-4">
                          <div className={`p-8 rounded-[2rem] bg-white/40 border border-white/60 backdrop-blur-md shadow-xl ${isYearLeft ? "md:text-right" : "md:text-left"}`}>
                            <h3 className="font-display text-3xl sm:text-4xl text-[#060642] mb-4 leading-tight">{event.title}</h3>
                            <p className="text-[#060642]/60 leading-relaxed text-lg italic">{event.body}</p>
                          </div>
                        </div>

                        {/* 2. CENTER NODE (Desktop Only) */}
                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#060642] shadow-[0_0_15px_rgba(6,6,66,0.3)] z-30" />

                        {/* 3. PHOTO SIDE */}
                        <div className="w-full md:w-1/2">
                          {event.photo ? (
                            <div className="relative p-2 bg-white/60 border border-white/60 rounded-[2.5rem] shadow-2xl overflow-hidden group">
                                <img 
                                  src={event.photo} 
                                  alt={event.title} 
                                  className="w-full aspect-[4/3] object-cover rounded-[2rem] transition-all duration-700 group-hover:scale-105" 
                                />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] rounded-[2.5rem] bg-white/20 border border-dashed border-[#060642]/10 flex items-center justify-center">
                               <p className="text-[#060642]/20 font-display italic">Memory Captured in our Hearts</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="py-20 text-center border-t border-black/5 bg-white/10 backdrop-blur-sm">
            <p className="font-script text-[#c81e1e] text-3xl mb-4 italic">Not Me, But You</p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#060642]/30 italic">End of an Era · 2022 — 2026</p>
        </footer>
      </div>
    </div>
  );
}
