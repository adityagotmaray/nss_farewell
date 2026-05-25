import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";

import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI";

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [{ title: "Yearbook — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: YearbookPage,
});

const SENIORS = [
  { name: "Dr. Anand Tamrakar", major: "FACULTY", role: "PO", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Leadership is service, not position." },
  { name: "Mr. Ayush Sahu", major: "FACULTY", role: "SEC", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Consistency is the key to impact." },
  { name: "Dhanendra kumar sahu", major: "CSE", role: "Dal Nayak", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv", quote: "Service is the rent we pay for our space on earth." },
  { name: "Chhanendra sahu", major: "Mechanical", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1ilD9Vm9KhL4F_vk1cBRYh3P71dTRe6pT", quote: "Once a volunteer, always a volunteer." },
  { name: "Julie Prajapati", major: "CSE", role: "Dal Nayaika", photo: "https://lh3.googleusercontent.com/d/1A5JmZFG3uyp4TWnVByT8NagzeYnpwQAm", quote: "Empower through action." },
  { name: "Ashi sao", major: "Civil", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1_uD8fMK-0z6HWXV6x9-clZSGCHLJE7la", quote: "Small acts, big changes." },
  { name: "Atul singh rajput", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1LRSr2z2I0_7I8xXooGBUZ3Iri7RbdT9P", quote: "Dedication defines us." },
  { name: "Harsh sonwanshi", major: "IT", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1opm2UAF9rm-H0w2QrivM2cb3ly90OUSN", quote: "Making every moment count." },
  { name: "K Abhilash", major: "ECE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1ElFYj8J7Qpm4r1hCVf1jbsxzvF738Oxb", quote: "To serve is to live." },
  { name: "Bhupesh sahu", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1VeoY_5z2vpnNnhJouwNlb78Vo9fWpb5v", quote: "Building a better tomorrow." },
  { name: "Dharninee", major: "IT", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1iidPtcQZBX8UIOutjO2fQWY0X2IDTol8", quote: "Kindness is free." }
];

function YearbookPage() {
  

  // Generate random rotations for the "scattered photo" look
  const cardRotations = useMemo(() => {
    return SENIORS.map(() => (Math.random() * 3 - 1.5).toFixed(2));
  }, []);

  const filteredSeniors = SENIORS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.role === filter;
    return matchesSearch && matchesFilter;
  });

  const roles = ["All", ...new Set(SENIORS.map(s => s.role))];

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <Reveal>
              <p className="text-accent text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Batch 2022—2026</p>
              <h1 className="font-display text-6xl sm:text-8xl text-white tracking-tighter mb-4 italic text-shiny-gold">The Yearbook</h1>
            </Reveal>
          </div>

          <div className="max-w-4xl mx-auto mb-16 space-y-6">
            <input 
              type="text" placeholder="Search by name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:border-accent/40 outline-none backdrop-blur-xl transition-all shadow-2xl"
            />
            
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map(r => (
                <button
                  key={r} onClick={() => setFilter(r)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all border ${
                    filter === r ? "bg-accent text-black border-accent" : "bg-white/5 text-white/40 border-white/10"
                  }`}
                >
                  {r?.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* GRID WITH STAGGERED ENTRY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredSeniors.map((s, index) => {
                const initialsStr = s.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.85, y: 30, rotate: cardRotations[index] }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: Math.min(index * 0.07, 1.4), // Cap delay for long lists
                      ease: "easeOut"
                    }}
                    className="group [perspective:1000px] aspect-[4/5] cursor-pointer"
                  >
                    {/* FLIPPER CONTAINER */}
                    <div className="relative w-full h-full transition-all duration-[0.8s] preserve-3d group-hover:[transform:rotateY(180deg)]">
                      
                      {/* FRONT SIDE (POLAROID STYLE) */}
                      <div className="absolute inset-0 backface-hidden paper-texture p-4 pb-14 shadow-2xl rounded-sm border border-white/20">
                        <div className="w-full h-full overflow-hidden bg-black/10 relative">
                           {s.photo ? (
                             <img src={s.photo} alt={s.name} className="w-full h-full object-cover grayscale-[0.2]" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center font-display text-8xl text-black/5">{initialsStr}</div>
                           )}
                           <div className="absolute inset-0 shadow-inner pointer-events-none" />
                        </div>
                        {/* Handwritten Name on bottom border */}
                        <div className="absolute bottom-3 left-0 w-full text-center">
                           <p className="text-handwritten text-2xl leading-none">{s.name}</p>
                        </div>
                      </div>

                      {/* BACK SIDE (DETAILS) */}
                      <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] paper-texture p-8 flex flex-col justify-center items-center text-center rounded-sm border-2 border-accent/20 shadow-glow">
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                        
                        <p className="text-accent text-[10px] font-black tracking-widest uppercase mb-2">Member Details</p>
                        <h3 className="font-display text-2xl text-black mb-4 leading-tight">{s.name}</h3>
                        
                        <div className="space-y-4 w-full border-y border-black/5 py-4">
                           <div>
                              <p className="text-[9px] uppercase text-black/40 font-bold tracking-tighter">Department</p>
                              <p className="font-display text-lg text-black/80">{s.major || "Volunteer"}</p>
                           </div>
                           <div>
                              <p className="text-[9px] uppercase text-black/40 font-bold tracking-tighter">Role</p>
                              <p className="font-display text-lg text-accent font-bold">{s.role}</p>
                           </div>
                        </div>

                        <p className="mt-6 text-black/60 italic font-serif text-sm">
                           "{s.quote || "Service over self."}"
                        </p>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
