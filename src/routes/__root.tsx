import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation
} from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Music, Music2 } from "lucide-react";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Eminence 2k26 — NSS Farewell" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  
  // 14. Cursor Glow Logic
  const cursorX = useSpring(0, { stiffness: 100, damping: 25 });
  const cursorY = useSpring(0, { stiffness: 100, damping: 25 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // 15. Ambient Music Logic
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-aurora-container min-h-screen relative text-foreground overflow-x-hidden">
        
        {/* 14. CURSOR GLOW */}
        <motion.div className="cursor-glow hidden md:block" style={{ left: cursorX, top: cursorY }} />

        {/* 12. GLOBAL BACKGROUND (Aurora + Stars) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="aurora-blob w-[600px] h-[600px] bg-[#1e1b4b] top-[-10%] left-[-10%]" />
          <div className="aurora-blob w-[500px] h-[500px] bg-[#0f4c4c] bottom-[10%] right-[-5%]" />
          <div className="aurora-blob w-[400px] h-[400px] bg-[#1e3a5f] top-[30%] left-[20%]" />
          <div className="absolute inset-0 starfield opacity-30" />
        </div>

        {/* 13. SMOOTH PAGE TRANSITIONS */}
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 15. MUSIC TOGGLE BUTTON */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => {
              setPlaying(!playing);
              playing ? audioRef.current?.pause() : audioRef.current?.play();
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl border border-white/10 ${playing ? 'bg-accent text-black animate-pulse' : 'bg-black/40 text-white'}`}
          >
            {playing ? <Music2 className="animate-spin-slow" /> : <Music />}
          </button>
          <audio ref={audioRef} src="/audio/ambient.mp3" loop />
        </div>
      </div>
      <Scripts />
    </QueryClientProvider>
  );
}
