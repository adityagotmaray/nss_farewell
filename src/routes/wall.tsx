import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav.tsx";
import { Reveal, FONT_LINKS } from "../components/Tribute-UI.tsx";
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
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-white/5 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="font-script text-[#c81e1e] text-4xl mb-2 italic tracking-wide">leave your mark</p>
              <h1 className="font-display text-6xl sm:text-8xl text-[#060642] tracking-tighter drop-shadow-sm">Memory Wall</h1>
            </Reveal>
          </div>

          {/* Submission Form */}
          <section className="max-w-2xl mx-auto mb-24 relative z-50">
            <form onSubmit={handleAddNote} className="bg-white/80 backdrop-blur-3xl border border-white p-8 sm:p-12 rounded-[3rem] shadow-2xl">
              <h3 className="text-[#060642] font-display text-3xl mb-8 italic">Pin a thought...</h3>
              <input 
                type="text" placeholder="Who are you?" value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 mb-6 text-[#060642] focus:ring-2 ring-[#060642]/5 outline-none transition-all placeholder:text-slate-400 shadow-inner"
              />
              <textarea 
                placeholder="Share a message for the batch..." rows={4} value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 mb-8 text-[#060642] focus:ring-2 ring-[#060642]/5 outline-none transition-all resize-none placeholder:text-slate-400 shadow-inner"
              />
              <div className="flex justify-end">
                <button type="submit" className="px-12 py-4 bg-[#060642] text-white font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-white/10">
                  Pin to Wall
                </button>
              </div>
            </form>
          </section>

          {/* Memory Notes Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
            <AnimatePresence>
              {loading ? (
                <div className="col-span-full text-center py-20 opacity-40 font-display uppercase tracking-widest text-xs">Loading the wall...</div>
              ) : (
                notes.map((note: any) => (
                  <motion.div 
                    key={note.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="break-inside-avoid mb-8 group"
                  >
                    <div className="relative p-8 bg-white/90 backdrop-blur-xl border-t-[6px] border-[#c81e1e] rounded-br-[3rem] shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:bg-white">
                      
                      {/* Message Content: Switched to font-sans for readability */}
                      <p className="font-sans text-[#060642] text-lg sm:text-xl leading-relaxed font-medium mb-10 selection:bg-[#c81e1e]/10">
                        "{note.contents}"
                      </p>
                      
                      <div className="flex justify-between items-end border-t border-slate-100 pt-6">
                        <div>
                          {/* Signatures still use the display font for style */}
                          <p className="font-display text-[#244681] text-xl tracking-tight font-bold">— {note.name}</p>
                          <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase mt-1 font-bold">
                            {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <img 
                            src={eminenceLogo} 
                            className="w-10 h-10 object-contain opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                            alt="logo" 
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
