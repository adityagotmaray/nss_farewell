import { createFileRoute } from "@tanstack/react-router";
import TopNav from "@/components/TopNav";
import { Reveal, Typewriter, FONT_LINKS } from "@/components/tribute-ui";

export const Route = createFileRoute("/wall")({
  head: () => ({
    meta: [
      { title: "Wall — NSS Farewell Batch 2022–2026" },
      { name: "description", content: "Notes from juniors to our outgoing NSS seniors." },
    ],
    links: FONT_LINKS,
  }),
  component: WallPage,
});

// ===== EDIT YOUR CONTENT HERE =====
const WALL_NOTES = [
  { from: "— A Junior", text: "EDIT: You taught me what it means to serve without expecting anything back." },
  { from: "— Volunteer '24", text: "EDIT: My first camp was scary till you made it feel like home." },
  { from: "— Junior", text: "EDIT: Watching you lead made me want to lead too one day." },
  { from: "— '25 batch", text: "EDIT: The unit feels different without you. Thank you for everything." },
  { from: "— A friend", text: "EDIT: Not me, but you — you actually lived it." },
  { from: "— Junior", text: "EDIT: Every drive, every shout of NSS, every late-night planning — unforgettable." },
];
// ===== END EDIT =====

function WallPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopNav />
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="font-script text-accent text-xl text-center">the wall</p>
            <h1 className="font-display text-3xl sm:text-5xl text-center mt-1">Notes From Juniors</h1>
          </Reveal>

          <div className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {WALL_NOTES.map((n, i) => (
              <Reveal key={i} delay={(i % 3) * 100}>
                <div className="break-inside-avoid mb-6 rounded-2xl border border-border bg-card p-6 shadow-card">
                  <p className="font-display italic text-lg leading-relaxed">
                    <Typewriter text={n.text} speed={16} />
                  </p>
                  <p className="font-script text-accent text-lg mt-4">{n.from}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
