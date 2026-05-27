🎓 Eminence: NSS Farewell (Batch 2022—2026)

"Not Me, But You"

A cinematic digital tribute dedicated to the seniors of the National Service
Scheme (NSS), Batch of 2022—2026. This platform serves as a "digital home" to
preserve four years of service, leadership, and brotherhood.

✨ Features

📽️ Interactive Journey

A beautifully animated timeline of the unit's major milestones from 2024
to 2026. Featuring alternating layouts, cinematic typography, and high-quality
photo archives of Flash Mobs, Camps, and Drives.

📖 Digital Yearbook

A searchable and filterable directory of the graduating batch. Includes detailed
profiles with names, majors, and roles (PO, SEC, Dal Nayak, etc.), styled with a
modern "frosted glass" aesthetic.

☁️ Memories Vault

A dynamic media gallery connected directly to Google Drive via Google Apps
Script.

  - Cinematic Loader: To bridge the Google Drive API delay, the page features a
    nostalgic slideshow of shuffled random memories and service-themed quotes.
  - Smart Sort: Ability to filter and sort albums by year or event name.

✍️ Memory Wall

A real-time "Digital Guestbook" where seniors and juniors can pin messages,
advice, and inside jokes. Powered by Supabase for instant updates.

🚀 Tech Stack

  - Framework: React 18 with Vite
  - Routing: TanStack Router (Type-safe routing)
  - Styling: Tailwind CSS v4 (using the new @theme engine)
  - Animations: Framer Motion
  - Visual Effects: Vanta.js (Clouds2 / Three.js)
  - Backend: Supabase (Database)
  - API Integration: Google Apps Script (Drive-to-JSON bridge)

🛠️ Installation & Setup

1.  Clone the repository:

    git clone https://github.com/yourusername/nss-farewell.git
    cd nss-farewell

2.  Install dependencies:

    npm install

3.  Configure Environment Variables: Create a .env file in the root and add your
    Supabase credentials:

    VITE_SUPABASE_URL= "https://nktdvuxppvjdtpjytrlh.supabase.co"
    VITE_SUPABASE_ANON_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGR2dXhwcHZqZHRwanl0cmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDcyODYsImV4cCI6MjA5NDc4MzI4Nn0.Rdgm8178CEYYYRktHgJkSIR7Ud3s7BtetpAGgx_BENI'

4.  Run the project:

    npm run dev

📂 Project Structure

src/
├── assets/             # Logos, brand assets, and local highlight photos
├── components/         # TopNav, UI wrappers, and Reveal animations
├── lib/                # Supabase client configuration
├── routes/             # Page Definitions (TanStack Router)
│   ├── index.tsx       # Landing Page (The Welcome)
│   ├── tribute.tsx     # The Journey Timeline
│   ├── yearbook.tsx    # Senior Gallery
│   ├── memories.tsx    # Drive Integration & Slideshow
│   └── wall.tsx        # Message Board
└── styles.css          # Global Tailwind 4 theme & Bright Cloud palette

📜 The NSS Spirit

The National Service Scheme aims at developing the personality of students
through community service. This project was built to honor the seniors who lived
this motto every single day.

"The best way to find yourself is to lose yourself in the service of others."

Built with ❤️ by the NSS Juniors for the Batch of 2026.
