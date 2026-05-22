import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import nssLogo from "../assets/nss-logo.png"; // REVERTED

const LINKS = [
  { to: "/tribute", label: "Journey" },
  { to: "/yearbook", label: "Yearbook" },
  { to: "/memories", label: "Memories" },
  { to: "/wall", label: "Wall" },
] as const;

export default function TopNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={nssLogo} alt="NSS" className="h-9 w-9 transition-transform group-hover:scale-105" />
          <div className="leading-tight">
            <p className="font-display text-sm sm:text-base text-white">NSS Farewell</p>
            <p className="font-script text-accent text-xs sm:text-sm -mt-0.5">Batch 2022 — 2026</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} activeProps={{ className: "text-accent bg-accent/10" }} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white/50 hover:text-accent transition-all">
              {l.label}
            </Link>
          ))}
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} activeProps={{ className: "text-accent bg-accent/10" }} className="px-4 py-4 rounded-lg text-xs font-bold uppercase tracking-widest text-white/70">
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
