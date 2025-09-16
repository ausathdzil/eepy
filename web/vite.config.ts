import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: 'lightningcss',
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react', test: '/node_modules[\\/]react/' },
            { name: 'react-dom', test: '/node_modules[\\/]react-dom/' },
          ],
        },
      },
    },
  },
  css: {
    transformer: 'lightningcss',
  },
  plugins: [react(), tailwindcss()],
});
