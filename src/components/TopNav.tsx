import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import nssLogo from "@/assets/nss-logo.png";

const LINKS = [
  { to: "/tribute", label: "Journey" },
  { to: "/yearbook", label: "Yearbook" },
  { to: "/memories", label: "Memories" },
  { to: "/wall", label: "Wall" },
  { to: "/letter", label: "Letter" },
] as const;

export default function TopNav() {
  const [open, setOpen] = useState(false);

  // close menu on route change
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={nssLogo} alt="NSS" className="h-9 w-9 transition-transform group-hover:scale-105" />
          <div className="leading-tight">
            <p className="font-display text-sm sm:text-base">NSS Farewell</p>
            <p className="font-script text-accent text-xs sm:text-sm -mt-0.5">Batch 2022 — 2026</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-accent bg-accent/10" }}
              className="px-4 py-2 rounded-full text-sm font-medium hover:text-accent hover:bg-accent/10 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-card/60"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-accent bg-accent/10" }}
                className="px-4 py-3 rounded-lg text-sm font-medium hover:text-accent hover:bg-accent/10 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
