import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDemo = env.VITE_DEMO_MODE === 'true';

  return {
    // Use /New-Insurex/ base when building for GitHub Pages demo
    base: isDemo ? '/New-Insurex/' : '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'https://localhost:5001',
          changeOrigin: true,
          secure: false, // allow self-signed cert in dev
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});
