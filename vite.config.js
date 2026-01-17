import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Para GitHub Pages, ajuste o 'base' para o nome do seu repositório
export default defineConfig({
  plugins: [react()],
  base: '/',
})
