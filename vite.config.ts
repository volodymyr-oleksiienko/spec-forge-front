import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    clearScreen: false,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      open: env.VITE_APP_BASENAME,
      proxy: {
        [env.VITE_APP_API_BASENAME]: {
          target: env.VITE_APP_API,
          changeOrigin: true,
        },
      },
    },
  };
});
