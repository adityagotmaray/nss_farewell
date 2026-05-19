import { useEffect, useRef, useState } from "react";

export const FONT_LINKS = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Caveat:wght@500;700&family=Inter:wght@400;500;600&display=swap",
  },
];

/** Reveal-on-scroll wrapper */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: "1100ms",
        transitionDelay: `${delay}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(40px)",
        filter: shown ? "blur(0px)" : "blur(6px)",
      }}
    >
      {children}
    </As>
  );
}

/** Typewriter effect — starts only when visible */
export function Typewriter({
  text,
  className = "",
  speed = 22,
  startDelay = 200,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);
  const [out, setOut] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, speed);
    }, startDelay);
    return () => clearTimeout(start);
  }, [started, text, speed, startDelay]);

  return (
    <span ref={ref} className={className}>
      {out}
      {started && out.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] align-[-0.1em] ml-0.5 bg-accent animate-pulse" />
      )}
    </span>
  );
}

export function initials(name: string) {
  return (
    name
      .replace(/EDIT\s*/i, "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "NSS"
  );
}
