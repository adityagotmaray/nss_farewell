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
// BACKEND: THE COMPLETE SORTED TIMELINE (2024-2026)
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
        photo: "https://lh3.googleusercontent.com/d/1Z9-bG57e1Zr7bmfYZriu40gF4IRHpDnM" 
      },
      { 
        title: "Hindi Diwas", 
        body: "Honoring our linguistic heritage. A day dedicated to the beauty and cultural significance of our mother tongue.",
        photo: "https://lh3.googleusercontent.com/d/1W2jl_kAo7JJEh0yEJNESM75Q8wBgjsln" 
      },
      { 
        title: "IGKV NSS Foundation Day", 
        body: "Celebrating the roots of our service. A moment to reflect on the history and impact of the NSS unit at our institution.",
        photo: "https://lh3.googleusercontent.com/d/1PlKTxbmxoUerpj_fqkYBWVyRUl0q1Zmk" 
      },
      { 
        title: "Cleanliness Drive", 
        body: "Living the Swachh Bharat mission. Armed with brooms and dedication, we transformed our surrounding environment.",
        photo: "https://lh3.googleusercontent.com/d/1S8zSynpn3rGu3u0Z34tLofGrwc84whsV" 
      },
      { 
        title: "Induction Program", 
        body: "Welcoming the fresh faces into the NSS family. The start of a new chapter of service for our juniors.",
        photo: "https://lh3.googleusercontent.com/d/1ZY5e5ux9vtZE5qP5T6yAXDyvy0hDQkCP" 
      },
      { 
        title: "Chitra-Varnan Pratiyogita", 
        body: "Where creativity met social awareness. Volunteers used art to describe the reality of the society around them.",
        photo: "https://lh3.googleusercontent.com/d/1YCMv__J7O46wWMqKQ8rGx9lsH2YZJ2dn" 
      },
      { 
        title: "Tug Of War", 
        body: "Unity, strength, and sportsmanship. A day of physical grit where we learned that we are stronger when we pull together.",
        photo: "https://lh3.googleusercontent.com/d/1n93eiF7sqJrDv5fkMuhR2S0s2WODu9gV" 
      },
      { 
        title: "Diwali Awareness", 
        body: "Spreading the light of safety. Educating the community on an eco-friendly and responsible celebration of lights.",
        photo: "https://lh3.googleusercontent.com/d/1CvZD5tCslRwy7dbxH2MFYh8_QXc3vtDq" 
      },
      { 
        title: "Blood Donation Camp 2024", 
        body: "The ultimate gift. Seniors and juniors joined hands to save lives, proving that service flows in our veins.",
        photo: "https://lh3.googleusercontent.com/d/1efULAvK5Rp0H4K0p3cUOtaBjItmivOsE" 
      }
    ]
  },
  {
    year: "2025",
    events: [
      { 
        title: "National Youth Day", 
        body: "Celebrating the birth of Swami Vivekananda. Empowering the youth to take charge of the nation's future.",
        photo: "https://lh3.googleusercontent.com/d/135BLNlSAJRr6wiBBmbQl77E5xjTziER9" 
      },
      { 
        title: "National Girl Child Day", 
        body: "Advocating for equality and empowerment. Spreading awareness about the rights and potential of every girl child.",
        photo: "https://lh3.googleusercontent.com/d/1kjEAf1G3zjr7MwKIp0a7lEiCIMthvfT_" 
      },
      { 
        title: "Road Safety Week", 
        body: "Service on the streets. Educating commuters on traffic rules to ensure everyone reaches home safely.",
        photo: "https://lh3.googleusercontent.com/d/1SRmJbkSsI_sMHbF1Cjgg_W1l7JJE9R0J" 
      },
      { 
        title: "7-Day Special Camp", 
        body: "Life in the village. Seven days of shramadaan, community surveys, and bonds that will last a lifetime.",
        photo: "https://lh3.googleusercontent.com/d/1iRf3jAjJCmewZ0ub3h4o_yZdGCJi1P8L" 
      },
      { 
        title: "B Certificate Exam", 
        body: "A milestone in the NSS journey. Demonstrating our theoretical and practical knowledge of social service.",
        photo: "https://lh3.googleusercontent.com/d/1RCoTaOk7_bkj-xdFJkGu5N1OKX8Mguyd" 
      },
      { 
        title: "Rabindranath Tagore Jayanti", 
        body: "Celebrating the Bard of Bengal. A cultural tribute to the man who gave us the anthem of our service.",
        photo: "https://lh3.googleusercontent.com/d/13nQ7H9CEHWbSLM8Apt7hkO2Xp64M1CB8" 
      },
      { 
        title: "Ek Ped Maa Ke Naam 2.0", 
        body: "Sustainable service. Planting saplings in honor of our mothers, securing a greener future for the generations to come.",
        photo: "https://lh3.googleusercontent.com/d/1IUEOVQ5bNbYOO6nD9XFG-wPJk7ZQzjXw" 
      },
      { 
        title: "Digital Poster Making Competition", 
        body: "Using modern tools for age-old causes. Volunteers designed impactful digital art to spread social awareness.",
        photo: "https://lh3.googleusercontent.com/d/1j5uApjwte_Qj7HJXtsPVFjavHazoWgHW" 
      },
      { 
        title: "International Yoga Day", 
        body: "Harmony of mind and body. A morning of collective wellness under the rising sun.",
        photo: "https://lh3.googleusercontent.com/d/1T8rZ_ZyTPCXoRzlmOGH90WcKz9vZcQ5M" 
      },
      { 
        title: "Sarv-Hitaya", 
        body: "For the benefit of all. A dedicated drive to reach out to the marginalized and provide essential support.",
        photo: "https://lh3.googleusercontent.com/d/15IjFP7rKRLZ5Jpa5xC3sCr1_kbKhx-GI" 
      },
      { 
        title: "Independence Day 2025", 
        body: "The tricolor flies high. A day of patriotic fervor and a renewed pledge to serve the motherland.",
        photo: "https://lh3.googleusercontent.com/d/1v6Se-d04n5011WE61Hu88GrB4mdVIych" 
      },
      { 
        title: "1st Year Induction", 
        body: "Passing the torch. Welcoming the new batch of volunteers and teaching them the spirit of 'Not Me, But You'.",
        photo: "https://lh3.googleusercontent.com/d/1SfIoI6V87JVOVeUJLygMkro3z1tZGYck" 
      },
      { 
        title: "Flash Mob HIV/AIDS Awareness", 
        body: "Breaking the silence. Using the power of street performance to educate and remove the stigma around AIDS.",
        photo: "https://lh3.googleusercontent.com/d/1Ly3VbtgiuOfJayXBJ5DEx37BkWp2UP_9" 
      },
      { 
        title: "Raktdaan Amrit Mahotsav 2.0", 
        body: "Another massive milestone in saving lives. A day of sacrifice and immense pride for our unit.",
        photo: "https://lh3.googleusercontent.com/d/1-OoMvpDK_-_FihCeNkvw8awnYLzWsaE0" 
      },
      { 
        title: "Oath Taking Seva Pakhwada", 
        body: "A fortnight of commitment. Renewing our vows to remain selfless and dedicated to the mission of service.",
        photo: "https://lh3.googleusercontent.com/d/1gOEB-uxa2Dg7V5JmCA2YGe_GgKXUApce" 
      },
      { 
        title: "NSS Foundation Day", 
        body: "Celebrating another year of the unit's existence. A day of joy, awards, and looking back at our achievements.",
        photo: "https://lh3.googleusercontent.com/d/1FaXkcoUHUHX35Poi2zrjuOi9I86Bfbsm" 
      },
      { 
        title: "Diwali Awareness And Fundraising", 
        body: "Bringing lights to the dark corners. Raising funds through charity to support those in need during the festive season.",
        photo: "https://lh3.googleusercontent.com/d/1RCoTaOk7_bkj-xdFJkGu5N1OKX8Mguyd" 
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
        photo: "https://lh3.googleusercontent.com/d/1Aalmm41I-6yDlFZS_GIqvqi5-7ugf8Or" 
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
        backgroundColor: 0x02040a, skyColor: 0x050a1a, cloudColor: 0x1e293b, speed: 1.2
        })
      );
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const scrollToStory = () => storyRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      
      {/* BACKGROUND LAYERS */}
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/50 pointer-events-none z-[1]" />
      <div className="fixed inset-0 z-[2] stars-layer animate-twinkle pointer-events-none opacity-30" />

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <Reveal>
            <img src={eminenceLogo} alt="Logo" className="h-50 w-50 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
            <div className="mb-6 px-4 py-1 border border-accent/30 rounded-full bg-accent/5 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent font-medium">
                    National Service Scheme • Batch 2022—2026
                </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="font-display text-7xl sm:text-9xl tracking-tighter leading-none text-white">
               <span className="text-shiny-gold italic">Eminence</span>
            </h1>
            <p className="font-display italic text-4xl sm:text-5xl mt-4 text-white/90 tracking-widest">
              Farewell - 2k26
            </p>
          </Reveal>

          <Reveal delay={400}>
            <button onClick={scrollToStory} className="mt-12 px-10 py-4 bg-accent text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              Relive Memories
            </button>
          </Reveal>
        </section>

        {/* JOURNEY TITLE */}
        <div ref={storyRef} className="pt-32 pb-24 px-6 text-center">
            <p className="font-script text-accent text-4xl mb-4">the story of</p>
            <h1 className="font-display text-6xl sm:text-9xl text-white">
                <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_auto] animate-shine">
                    Their NSS Journey
                </span>
            </h1>
        </div>

        {/* MULTI-EVENT TIMELINE SECTION */}
        <section className="relative pb-40 px-6 max-w-5xl mx-auto">
          <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
          
          <div className="space-y-80">
            {TIMELINE.map((yearGroup, yearIndex) => {
              const isLeft = yearIndex % 2 === 0;
              return (
                <div key={yearGroup.year} className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-20 items-start ${isLeft ? "" : "sm:[&>*:first-child]:order-2"}`}>
                  
                  <div className={`${isLeft ? "sm:text-right" : "sm:text-left"} sticky top-40`}>
                    <Reveal>
                        <span className="font-script text-accent text-7xl sm:text-9xl block drop-shadow-2xl">{yearGroup.year}</span>
                    </Reveal>
                  </div>

                  <div className="space-y-32 pt-10">
                    {yearGroup.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="relative">
                            <div className="absolute left-[-42px] sm:left-[-51px] top-6 h-3 w-3 rounded-full bg-accent border border-accent shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                            <Reveal delay={eventIndex * 150}>
                                <div className="space-y-6">
                                    <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight mb-3">{event.title}</h3>
                                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-md shadow-2xl transition-all hover:bg-black/60">
                                        <p className="text-white/70 leading-relaxed text-base italic">{event.body}</p>
                                    </div>

                                    {event.photo && (
                                        <div className="relative mt-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 group">
                                            <img src={event.photo} alt={event.title} className="w-full h-auto min-h-[150px] object-cover block transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        <footer className="py-20 text-center border-t border-white/5 bg-black/40">
            <p className="font-script text-accent text-3xl mb-4 italic">Not Me, But You</p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 italic">End of an Era · 2022 — 2026</p>
        </footer>
      </div>

      <style>{`
        @keyframes shine { to { background-position: 200% center; } }
        .animate-shine { animation: shine 4s linear infinite; }
      `}</style>
    </div>
  );
}
