import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: 'lightningcss',
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [{ name: 'react', test: /node_modules[\\/]react/ }],
        },
      },
    },
  },
  css: {
    transformer: 'lightningcss',
  },
  plugins: [react(), tailwindcss()],
  preview: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
