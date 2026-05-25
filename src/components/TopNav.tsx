import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import nssLogo from "../assets/nss-logo.png";

const LINKS = [
  { to: "/tribute", label: "Journey" },
  { to: "/yearbook", label: "Yearbook" },
  { to: "/memories", label: "Memories" },
  { to: "/wall", label: "Wall" },
] as const;

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    // Changed bg-background/70 to bg-white/30 and text to navy
    <header className="fixed top-0 left-0 right-0 z-[60] bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={nssLogo} alt="NSS" className="h-10 w-10" />
          <div className="leading-tight">
            <p className="font-display text-sm sm:text-base text-[#060642] font-bold">NSS Farewell</p>
            <p className="font-script text-[#216c90] text-xs sm:text-sm">Batch 2022 — 2026</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-[#c81e1e] bg-white/50 shadow-sm" }}
              className="px-5 py-2 rounded-full text-xs uppercase tracking-widest font-black text-[#060642] hover:bg-white/40 transition-all"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden h-10 w-10 rounded-full bg-white/80 flex items-center justify-center text-[#060642] shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      
    </header>
  );
}
