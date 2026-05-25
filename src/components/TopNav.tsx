import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
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
    <header className="fixed top-0 left-0 right-0 z-[70] bg-transparent">
      <div className="max-w-[95%] mx-auto flex items-center justify-between px-4 py-4 relative z-[80]">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 group transition-transform hover:scale-105">
          <img src={nssLogo} alt="NSS" className="h-10 w-10 sm:h-12 sm:w-12" />
          <div className="leading-tight">
            <p className="font-display text-sm sm:text-lg text-[#060642] font-black uppercase tracking-tight">NSS bids Farewell to</p>
            <p className="font-sans text-white text-[10px] sm:text-xs font-bold opacity-90">Batch 2022 — 2026</p>
          </div>
        </Link>

        {/* Desktop nav */}
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

        {/* Mobile toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden h-12 w-12 rounded-full bg-white/90 flex items-center justify-center text-[#060642] shadow-lg active:scale-95 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[65] bg-[#f1eef7]/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center p-8"
          >
            <div className="flex flex-col gap-8 w-full max-w-xs">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)} // Closes menu when a page is selected
                    activeProps={{ className: "text-[#c81e1e] translate-x-4" }}
                    className="flex items-center justify-between text-4xl font-display font-black text-[#060642] uppercase tracking-tighter transition-all"
                  >
                    <span>{l.label}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer inside mobile menu */}
            <div className="absolute bottom-12 text-center">
                <p className="font-script text-[#c81e1e] text-3xl italic">Not Me, But You</p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#060642] font-bold opacity-40 mt-2">NSS Batch 2022—2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
