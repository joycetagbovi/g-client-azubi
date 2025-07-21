// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4200',
        changeOrigin: true,
        secure: false,
        // Optional rewrite
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});