// import { createFileRoute } from "@tanstack/react-router";
// import TopNav from "@/components/TopNav";
// import { Reveal, Typewriter, FONT_LINKS } from "@/components/tribute-ui";
// import nssLogo from "@/assets/nss-logo.png";

// export const Route = createFileRoute("/letter")({
//   head: () => ({
//     meta: [
//       { title: "Letter — NSS Farewell Batch 2022–2026" },
//       { name: "description", content: "A farewell letter from juniors to the outgoing NSS seniors." },
//     ],
//     links: FONT_LINKS,
//   }),
//   component: LetterPage,
// });

// // ===== EDIT YOUR CONTENT HERE =====
// const LETTER = `EDIT: Dear Seniors,

// Some goodbyes don't really feel like goodbyes. They feel like a pause — a quiet breath before the next chapter.

// We watched you wake up before sunrise for drives, stay back late for planning, and still find the energy to make us laugh in between. You didn't just wear the NSS badge — you became it.

// Thank you for the example, the patience, and the love. We promise to carry the unit forward the way you taught us to.

// With all our hearts,
// The Juniors.`;
// // ===== END EDIT =====

// function LetterPage() {
//   return (
//     <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
//       <TopNav />
//       <section className="relative py-16 sm:py-24 px-6">
//         <div className="absolute inset-0 starfield opacity-20 pointer-events-none" />
//         <div className="relative max-w-3xl mx-auto">
//           <Reveal>
//             <p className="font-script text-accent text-xl text-center">a final letter</p>
//             <h1 className="font-display text-3xl sm:text-5xl text-center mt-1">To Our Seniors</h1>
//           </Reveal>

//           <Reveal delay={150}>
//             <div className="mt-12 rounded-3xl border border-border bg-card/80 backdrop-blur p-8 sm:p-12 shadow-card">
//               <p className="font-display text-lg sm:text-xl leading-relaxed whitespace-pre-line text-foreground/90">
//                 <Typewriter text={LETTER} speed={12} />
//               </p>
//               <p className="font-script text-accent text-2xl text-right mt-8">— with love, the juniors</p>
//             </div>
//           </Reveal>

//           <div className="mt-16 text-center">
//             <img src={nssLogo} alt="NSS" className="h-12 w-12 mx-auto opacity-80" />
//             <p className="font-script text-accent text-xl mt-3">Not Me, But You</p>
//             <p className="text-xs text-muted-foreground mt-2">NSS Farewell · Batch 2022 — 2026</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
