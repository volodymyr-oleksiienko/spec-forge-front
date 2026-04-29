import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_APP_BUILD_TARGET === 'forge' ? './' : '/',
    plugins: [react(), tailwindcss()],
    clearScreen: false,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      cors: true,
      open: env.VITE_APP_ROUTER_BASENAME,
      allowedHosts: ['v-oleksiienko-dev.xyz'],
      proxy: {
        [env.VITE_APP_API_PREFIX]: {
          target: env.VITE_APP_API_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
  };
});
