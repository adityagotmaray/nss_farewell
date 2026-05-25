import { Link } from "@tanstack/react-router";
import { useState } from "react";
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
    <header className="fixed top-0 left-0 right-0 z-[60] bg-transparent">
      {/* Changed max-w-7xl to 95% and py-8 to py-4 to push items to the edges and up */}
      <div className="max-w-[95%] mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
          <img src={nssLogo} alt="NSS" className="h-12 w-12" />
          <div className="leading-tight">
            <p className="font-display text-base sm:text-lg text-[#060642] font-black uppercase tracking-tight">NSS Farewell</p>
            <p className="font-sans text-white text-xs font-bold opacity-90">Batch 2022 — 2026</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-[#c81e1e] bg-white/60 shadow-md scale-110" }}
              className="px-6 py-2.5 rounded-full text-sm uppercase tracking-widest font-black text-[#060642] hover:bg-white/40 transition-all hover:scale-110"
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
    </header>
  );
}
