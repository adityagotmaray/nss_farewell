import { createFileRoute } from "@tanstack/react-router";
import TopNav from "../components/TopNav";
import { Reveal, FONT_LINKS, initials, Typewriter } from "../components/Tribute-UI";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [
      { title: "Memories — NSS Farewell Batch 2022–2026" },
      { name: "description", content: "Polaroid memories from camps, drives and unforgettable moments." },
    ],
    links: FONT_LINKS,
  }),
  component: MemoriesPage,
});

// ===== EDIT YOUR CONTENT HERE =====
const MEMORIES = [
  { caption: "EDIT: Camp Day 1 — 2023", rotate: -3 },
  { caption: "EDIT: Tree Plantation Drive", rotate: 2 },
  { caption: "EDIT: Republic Day Parade", rotate: -2 },
  { caption: "EDIT: Blood Donation Camp", rotate: 3 },
  { caption: "EDIT: Village Visit", rotate: -1 },
  { caption: "EDIT: NSS Day 2024", rotate: 2 },
  { caption: "EDIT: Cleanliness Drive", rotate: -3 },
  { caption: "EDIT: Cultural Night at Camp", rotate: 1 },
];
// ===== END EDIT =====

function MemoriesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopNav />
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="font-script text-accent text-xl text-center">the memories</p>
            <h1 className="font-display text-3xl sm:text-5xl text-center mt-1">Moments We'll Keep</h1>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {MEMORIES.map((m, i) => (
              <Reveal key={i} delay={(i % 4) * 100}>
                <div
                  className="polaroid rounded-sm mx-auto w-full max-w-[220px]"
                  style={{ transform: `rotate(${m.rotate}deg)` }}
                >
                  <div className="aspect-square bg-gradient-to-br from-muted to-secondary/40 flex items-center justify-center rounded-sm">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">EDIT: photo</span>
                  </div>
                  <p className="font-script text-lg mt-3 text-center text-foreground/80">{m.caption}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
