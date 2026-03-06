import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 確保編譯後的路徑為相對路徑，相容 GitHub Pages
  plugins: [react()],
})
