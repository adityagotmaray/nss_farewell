import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, Scripts, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Music, Music2 } from "lucide-react";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cursor Logic
  const cursorX = useSpring(0, { stiffness: 100, damping: 25 });
  const cursorY = useSpring(0, { stiffness: 100, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Generate 40 random embers for the background
  const embers = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 15}s`,
    duration: `${Math.random() * 10 + 15}s`,
    size: `${Math.random() * 3 + 1}px`
  })), []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="nebula-container min-h-screen relative text-foreground">
        
        {/* BACKGROUND ENGINE */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="nebula-cloud bg-[#1e1b4b] top-[-20%] left-[-10%]" />
          <div className="nebula-cloud bg-[#0f172a] bottom-[-20%] right-[-10%]" style={{ animationDelay: '-15s' }} />
          <div className="starfield-cinematic" />
          
          {/* RISING EMBERS */}
          {embers.map(e => (
            <div key={e.id} className="ember" style={{ 
              left: e.left, '--delay': e.delay, '--duration': e.duration, width: e.size, height: e.size 
            } as any} />
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        <motion.div className="cursor-glow hidden md:block" style={{ left: cursorX, top: cursorY }} />

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <div className="fixed bottom-8 right-8 z-50">
          <button onClick={() => { setPlaying(!playing); playing ? audioRef.current?.pause() : audioRef.current?.play(); }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border border-white/10 ${playing ? 'bg-accent text-black music-playing' : 'bg-black/40 text-white'}`}>
            {playing ? <Music2 /> : <Music />}
          </button>
          <audio ref={audioRef} src="/audio/ambient.mp3" loop />
        </div>
      </div>
      <Scripts />
    </QueryClientProvider>
  );
}
