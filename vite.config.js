import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plain Vite + React setup. Output goes to /dist.
export default defineConfig({
  plugins: [react()],
  build: { sourcemap: false, chunkSizeWarningLimit: 800 },
})
