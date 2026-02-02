import { defineConfig } from 'vite';

export default defineConfig({
  // Force absolute base path to prevent relative path resolution errors in production
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
});