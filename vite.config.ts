import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  start: {
    server: {
      preset: 'vercel' // Change this line from 'cloudflare' or 'nitro' to 'vercel'
    }
  }
})
