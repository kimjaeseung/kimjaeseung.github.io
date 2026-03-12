import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: username.github.io 레포면 루트(/)에서 서비스
export default defineConfig({
  plugins: [react()],
  base: '/',
})
