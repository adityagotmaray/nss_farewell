import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min"; 
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
  { name: "Dr. Anand Tamrakar", major: "FACULTY", role: "Programme Officer", photo: "https://lh3.googleusercontent.com/d/1MJd483hk7Y_z4ywtI0ZoIE8otAP9LuBQ"},
  { name: "Mr. Ayush Sahu", major: "FACULTY", role: "Assistant Programme Officer", photo: "https://lh3.googleusercontent.com/d/1y_ZAuyGc1spuiH2omFdVDLsj0pLw0DQP"},
  { name: "Dhanendra Kumar Sahu", major: "CSE", role: "DalNayak", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv"},
  { name: "Julie Prajapati", major: "CSE", role: "DalNayika", photo: "https://lh3.googleusercontent.com/d/1A5JmZFG3uyp4TWnVByT8NagzeYnpwQAm"},
  { name: "Chhanendra Sahu", major: "CSE", role: "Documentation Head", photo: "https://lh3.googleusercontent.com/d/1ilD9Vm9KhL4F_vk1cBRYh3P71dTRe6pT"},
  { name: "Ashi Sao", major: "CSE", role: "Social Media Head", photo: "https://lh3.googleusercontent.com/d/1_uD8fMK-0z6HWXV6x9-clZSGCHLJE7la"},
  { name: "Atul Singh rajput", major: "CSE", role: "Core Team Head", photo: "https://lh3.googleusercontent.com/d/1LRSr2z2I0_7I8xXooGBUZ3Iri7RbdT9P"},
  { name: "Aastha Singh", major: "", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv"},
  { name: "Richa Sahu", major: "", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv"},
  { name: "Devesh Sahu", major: "", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1AsBrFFgMxpZED0lBX5qCSP8HUsLTk9Mv"},
  { name: "Harsh Sonwanshi", major: "CSE", role: "RRC Head", photo: "https://lh3.googleusercontent.com/d/1opm2UAF9rm-H0w2QrivM2cb3ly90OUSN"},
  { name: "K Abhilash", major: "IT", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1ElFYj8J7Qpm4r1hCVf1jbsxzvF738Oxb"},
  { name: "Milind sahu", major: "", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1V6j3W7wuH9vgB3jmy1i9HCpu_AJH7DLd"},
  { name: "Ayush shinde", major: "", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1r6s_rWkHfskw3VNj5Ok4ZAuflzaKFWTo"},
  { name: "Anand sharma", major: "", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1q4qzj8vCB1r_YE98ntkX_3Bl0AC3XS6Z"},
  { name: "Bhupesh Dewangan", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1VeoY_5z2vpnNnhJouwNlb78Vo9fWpb5v"},
  { name: "Dharninee Yadu", major: "", role: "RRC Head", photo: "https://lh3.googleusercontent.com/d/1iidPtcQZBX8UIOutjO2fQWY0X2IDTol8"},
  { name: "Krrish Singh", major: "CSE", role: "Logistics Head", photo: "https://lh3.googleusercontent.com/d/1RWBsd2k28Vux-DEaCZHrHebiVlbmUEGB"}, // Blank 1
  { name: "Tejaswani Gupta", major: "CSE", role: "Cultural Head", photo: "https://lh3.googleusercontent.com/d/1Ax9NoztwBXDy2UyZErExLztC_zDkENB9"}, // Blank 2
  { name: "Anjali Sahu", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1TlSHPH6OxjvCQXQdhlSRazse5NamIt1f"},
  { name: "Aditi Bandawar", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1kI6NbR7t_JkS_RoL-9hkvA0U4FaCMXH2"},
  { name: "Dhanraj Singh", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1aj23PN53f8dB1sj2cDWkdud5zr7CfDBj"},// Blank 3
  { name: "Aasma Ali", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1wbR1k2noja71LwwkMzP46Y8SJ0wL9cyL"},
  { name: "Baldev Das Vaishnav", major: "IT", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1iuwkjyGIiSZ3Hn2OrgOLS7RLBYv83PEZ"},
  { name: "Kanchan Dewangan", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1J8u2KKCl0RnkBocrdoiJPzjZr33xYUov"},
  { name: "Anchal", major: "CSE", role: "VOL", photo: "https://lh3.googleusercontent.com/d/1FTskAfFRLls9F_61623s2oOLN-H5tcd5"},
];

function YearbookPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        // ADJUSTED THESE TO MATCH YOUR SCREENSHOT BETTER
        scale: 1.00,
        backgroundColor: 0xf1eef7, // The Pink
        skyColor: 0x244681,   
        cloudColor: 0x143047,
        cloudShadowColor: 0xf5f9fc,
        sunColor: 0xfff9f2,
        sunGlareColor: 0xfff9f7,
        sunlightColor: 0xf7f4f0
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const filteredSeniors = SENIORS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.role === filter;
    return matchesSearch && matchesFilter;
  });

  const roles = ["All", ...new Set(SENIORS.map(s => s.role))];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <TopNav />
      {/* Vanta Canvas */}
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      
      {/* MISTY OVERLAY: This blends the top nav into the clouds */}
      <div className="fixed inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-[#c81e1e] text-[10px] uppercase tracking-[0.5em] font-black mb-4">Batch 2022—2026</p>
              <h1 className="font-display text-7xl sm:text-9xl text-[#060642] tracking-tighter mb-4 drop-shadow-2xl">
                Yearbook
              </h1>
            </Reveal>
          </div>

          {/* SEARCH BAR: Made more "Glassy" and less "Solid White" */}
          <div className="max-w-4xl mx-auto mb-20 space-y-6">
            <input 
              type="text" placeholder="Search by name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/40 border border-white/60 rounded-[2rem] px-10 py-7 text-[#060642] focus:ring-4 focus:ring-white/20 outline-none backdrop-blur-xl shadow-2xl placeholder:text-[#060642]/40 text-xl font-medium"
            />
            
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map(r => (
                <button
                  key={r} onClick={() => setFilter(r)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest border transition-all ${
                    filter === r 
                    ? "bg-[#060642] text-white border-[#060642] shadow-xl" 
                    : "bg-white/20 text-[#060642] border-white/40 backdrop-blur-md hover:bg-white/40"
                  }`}
                >
                  {r?.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredSeniors.map((s) => {
                const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <motion.div key={s.name} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/60 bg-white/20 backdrop-blur-md shadow-2xl transition-all hover:-translate-y-3"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <span className="font-display text-[100px] text-[#060642]/10">{initials}</span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent flex flex-col justify-end p-10">
                       <p className="text-[#c81e1e] text-[10px] tracking-[0.3em] font-black mb-1 uppercase">{s.major}</p>
                       <h3 className="font-display text-4xl text-[#060642] leading-tight mb-2">{s.name}</h3>
                       <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                          <span className="text-[10px] font-black text-[#060642]/40 tracking-widest uppercase">{s.role}</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_rgba(200,30,30,0.4)]" />
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
