import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Keine eval-basierten Source Maps
    minify: 'esbuild', // Schnelleres Production-Build
    target: 'esnext', // Moderne Browser
  },
});
