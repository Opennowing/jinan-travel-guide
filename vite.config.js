import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/jinan-travel-guide/',
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        spots: resolve(__dirname, 'spots.html'),
        food: resolve(__dirname, 'food.html'),
        itinerary: resolve(__dirname, 'itinerary.html'),
        guide: resolve(__dirname, 'guide.html'),
        culture: resolve(__dirname, 'culture.html'),
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
