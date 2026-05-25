import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI";
import { supabase } from "../lib/supabaseClient";
import eminenceLogo from "../assets/eminence-logo.png";

export const Route = createFileRoute("/wall")({
  head: () => ({
    meta: [{ title: "Memory Wall — NSS Farewell" }],
    links: FONT_LINKS,
  }),
  component: WallPage,
});

function WallPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotes(); }, []);

  async function fetchNotes() {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (!error) setNotes(data || []);
    setLoading(false);
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMessage) return;
    const { error } = await supabase.from('messages').insert([{ name: newName, contents: newMessage }]);
    if (!error) { setNewName(""); setNewMessage(""); fetchNotes(); }
  };

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

  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      {/* Background Layers */}
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-white/10 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="font-script text-[#c81e1e] text-4xl mb-2 italic">leave your mark</p>
              <h1 className="font-display text-6xl sm:text-8xl text-[#060642] tracking-tighter drop-shadow-sm">Memory Wall</h1>
            </Reveal>
          </div>

          {/* Submission Form (Light Glassmorphism) */}
          <section className="max-w-2xl mx-auto mb-24 relative z-50">
            <form onSubmit={handleAddNote} className="bg-white/60 backdrop-blur-2xl border border-white/80 p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-[#060642] font-display text-3xl mb-8 italic">Write a Note...</h3>
              <input 
                type="text" placeholder="Your name" value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="w-full bg-white/80 border border-slate-200 rounded-2xl px-6 py-4 mb-6 text-[#060642] focus:border-[#244681]/50 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              />
              <textarea 
                placeholder="Share a memory..." rows={3} value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                className="w-full bg-white/80 border border-slate-200 rounded-2xl px-6 py-4 mb-8 text-[#060642] focus:border-[#244681]/50 outline-none transition-all resize-none placeholder:text-slate-400 shadow-sm"
              />
              <div className="flex justify-end">
                <button type="submit" className="px-10 py-4 bg-[#060642] text-white font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">
                  Pin to Wall
                </button>
              </div>
            </form>
          </section>

          {/* Memory Notes Grid (Bright Polaroids) */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-10">
            <AnimatePresence>
              {notes.map((note: any) => (
                <motion.div key={note.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="break-inside-avoid mb-10 group relative">
                  <div className="relative p-8 bg-white/80 backdrop-blur-lg border-t-4 border-[#c81e1e] shadow-xl transition-all group-hover:-translate-y-2 group-hover:shadow-2xl">
                    {/* Folded Corner Effect (Lighter) */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-slate-200" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
                    
                    <p className="font-script text-[#060642] text-2xl leading-relaxed italic opacity-95 mb-8">"{note.contents}"</p>
                    
                    <div className="flex justify-between items-end border-t border-slate-100 pt-6">
                      <div>
                        <p className="font-display text-[#244681] text-xl tracking-wide">{note.name}</p>
                        <p className="text-[10px] text-slate-400 tracking-[0.3em] uppercase mt-1">{new Date(note.created_at).toLocaleDateString()}</p>
                      </div>
                      <img src={eminenceLogo} className="w-8 h-8 object-contain opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="icon" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
