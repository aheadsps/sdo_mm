import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': '/src/pages',
      '@assets': '/src/assets',
      '@shared': '/src/shared',
      '@features': '/src/features',
      '@routes': '/src/routes',
      '@services': '/src/services',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: true,
  },
  server: {
    allowedHosts: ['edu.sdo-metro.ru, sdo-metro.ru'],
    host: true,
  },
})
