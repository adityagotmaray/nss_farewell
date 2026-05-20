import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav";
import { Reveal, FONT_LINKS, initials, Typewriter } from "../components/Tribute-UI";
import { supabase } from "../lib/supabaseClient"; // Fixed import for your folder structure

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

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching:', error);
    else setNotes(data || []);
    setLoading(false);
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMessage) return;

    // FIX: Changed 'contents' to 'content' to match your database
    const { error } = await supabase
      .from('messages')
      .insert([{ name: newName, contents: newMessage }]);

    if (error) {
      console.error(error);
      alert("Error posting! Make sure your Supabase column is named 'content'");
    } else {
      setNewName("");
      setNewMessage("");
      fetchNotes(); 
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
            <form onSubmit={handleAddNote} className="bg-black/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <h3 className="text-accent font-display text-3xl mb-8 italic">Write a Note...</h3>
              <input 
                type="text" placeholder="Your name" value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-6 text-white focus:border-accent/50 outline-none transition-all placeholder:text-white/20"
              />
              <textarea 
                placeholder="Share a memory, feeling, or farewell message..." rows={3} value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-8 text-white focus:border-accent/50 outline-none transition-all resize-none placeholder:text-white/20"
              />
              <div className="flex justify-end">
                <button type="submit" className="px-10 py-4 bg-accent text-black font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                  Pin to Wall
                </button>
              </div>
            </form>
          </section>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-10">
            <AnimatePresence>
              {notes.map((note: any) => (
                <motion.div key={note.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="break-inside-avoid mb-10 group">
                  <div className="relative p-8 bg-[#1a2135]/80 backdrop-blur-lg border-t-4 border-accent shadow-2xl transition-all group-hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#0a0f1d]" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
                    <p className="font-script text-white text-2xl leading-relaxed italic opacity-95 mb-8">
                      "{note.contents}"
                    </p>
                    <div className="flex justify-between items-end border-t border-white/10 pt-6">
                      <div>
                        <p className="font-display text-accent text-xl tracking-wide">{note.name}</p>
                        <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase mt-1">
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-accent/40 text-2xl">♥</span>
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
