import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: './www',
  build: {
    outDir: './www/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'www/index.html'),
    },
  },
  plugins: [react()],
  server: {
    open: true,
    port: 5173,
  },
});
