import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const adminRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: adminRoot,
  base: '/admin/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../dist/admin',
    emptyOutDir: false,
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});