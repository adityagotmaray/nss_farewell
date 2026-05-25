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

const NOTE_COLORS = ['#fef9c3', '#fce7f3', '#dbeafe', '#dcfce7', '#ede9fe'];

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
    
    // FIX: Using 'contents' to match your previous setup
    const { error } = await supabase.from('messages').insert([{ name: newName, contents: newMessage }]);
    
    if (!error) { 
      setNewName(""); 
      setNewMessage(""); 
      fetchNotes(); 
    } else {
      console.error(error);
      alert("Error posting. Check Supabase connection.");
    }
  };

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(CLOUDS({
        el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true,
        backgroundColor: 0x02040a, skyColor: 0x050a1a, cloudColor: 0x1e293b, speed: 1.2 
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  const getNoteStyle = (id: any) => {
    const num = typeof id === 'number' ? id : (id?.length || 0);
    return {
      color: NOTE_COLORS[num % NOTE_COLORS.length],
      rotate: (num % 7) - 3 
    };
  };

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent/20">
      <TopNav />
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-black/50 pointer-events-none z-[1]" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <Reveal>
              <p className="font-script text-accent text-4xl mb-2 italic">leave your mark</p>
              <h1 className="font-display text-6xl sm:text-8xl text-white tracking-tighter drop-shadow-2xl">Memory Wall</h1>
            </Reveal>
          </div>

          <section className="max-w-2xl mx-auto mb-24 relative z-50">
            <form onSubmit={handleAddNote} className="bg-black/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-accent font-display text-3xl mb-8 italic">Write a Note...</h3>
              <input type="text" placeholder="Your name" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-6 text-white focus:border-accent/50 outline-none transition-all placeholder:text-white/20"/>
              <textarea placeholder="Share a memory..." rows={3} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-8 text-white focus:border-accent/50 outline-none transition-all resize-none placeholder:text-white/20"/>
              <div className="flex justify-end">
                <button type="submit" className="px-10 py-4 bg-accent text-black font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]">Pin to Wall</button>
              </div>
            </form>
          </section>

          {/* 🧱 CORKBOARD */}
          <div className="bg-corkboard p-8 sm:p-12 rounded-3xl min-h-[400px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            {loading ? (
              <p className="text-center text-white/20 font-display italic">Scanning the board...</p>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-10">
                <AnimatePresence>
                  {notes.map((note: any) => {
                    const style = getNoteStyle(note.id);
                    return (
                      <motion.div 
                        key={note.id} 
                        initial={{ y: -200, rotate: -10, opacity: 0 }} 
                        animate={{ y: 0, rotate: style.rotate, opacity: 1 }} 
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="break-inside-avoid mb-12 group relative"
                      >
                        <div 
                          style={{ backgroundColor: style.color }}
                          className="relative p-8 shadow-[3px_4px_12px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 hover:z-50 cursor-default"
                        >
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl drop-shadow-md">📌</div>

                          {/* SAFETY FIX: Checks for contents OR content */}
                          <p className="font-handwritten text-2xl leading-relaxed italic mb-8">
                            "{note.contents || note.content}"
                          </p>

                          <div className="flex justify-between items-end border-t border-black/10 pt-6 font-handwritten">
                            <div>
                              <p className="text-xl font-bold">{note.name}</p>
                              <p className="text-[10px] uppercase tracking-widest opacity-40">
                                {new Date(note.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <img 
                              src={eminenceLogo} 
                              className="w-8 h-8 object-contain opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                              alt="icon" 
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
