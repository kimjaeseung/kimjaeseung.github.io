import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: repo가 calcurlator면 /calcurlator/, echo-legacy-books면 /echo-legacy-books/
export default defineConfig({
  plugins: [react()],
  base: '/calcurlator/',
})
