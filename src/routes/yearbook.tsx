import { createFileRoute } from "@tanstack/react-router";
import TopNav from "@/components/TopNav";
import { Reveal, FONT_LINKS, initials } from "@/components/tribute-ui";

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [
      { title: "Yearbook — NSS Farewell Batch 2022–2026" },
      { name: "description", content: "The outgoing NSS batch — names, roles, and photos." },
    ],
    links: FONT_LINKS,
  }),
  component: YearbookPage,
});

// ===== EDIT YOUR CONTENT HERE =====
const SENIORS: { name: string; role?: string; photo?: string }[] = [
  { name: "EDIT Name 1", role: "Program Officer" },
  { name: "EDIT Name 2", role: "Unit Leader" },
  { name: "EDIT Name 3", role: "Volunteer" },
  { name: "EDIT Name 4", role: "Volunteer" },
  { name: "EDIT Name 5", role: "Volunteer" },
  { name: "EDIT Name 6", role: "Volunteer" },
  { name: "EDIT Name 7", role: "Volunteer" },
  { name: "EDIT Name 8", role: "Volunteer" },
  { name: "EDIT Name 9", role: "Volunteer" },
  { name: "EDIT Name 10", role: "Volunteer" },
  { name: "EDIT Name 11", role: "Volunteer" },
  { name: "EDIT Name 12", role: "Volunteer" },
  { name: "EDIT Name 13", role: "Volunteer" },
  { name: "EDIT Name 14", role: "Volunteer" },
  { name: "EDIT Name 15", role: "Volunteer" },
  { name: "EDIT Name 16", role: "Volunteer" },
];
// ===== END EDIT =====

function YearbookPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopNav />
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="font-script text-accent text-xl text-center">the yearbook</p>
            <h1 className="font-display text-3xl sm:text-5xl text-center mt-1">The Outgoing Batch</h1>
            <p className="text-muted-foreground text-center mt-4 max-w-xl mx-auto">
              EDIT: Replace the names below with the real seniors. Drop their Google Drive photo URLs into the photo field.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
            {SENIORS.map((s, i) => (
              <Reveal key={i} delay={(i % 4) * 80}>
                <div className="group rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-1">
                  <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-background flex items-center justify-center relative overflow-hidden">
                    {s.photo ? (
                      <img src={s.photo} alt={s.name} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-5xl text-gradient-gold">{initials(s.name)}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-display text-base sm:text-lg leading-tight">{s.name}</p>
                    {s.role && <p className="font-script text-accent text-sm mt-1">{s.role}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
