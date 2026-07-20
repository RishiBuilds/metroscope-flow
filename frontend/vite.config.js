import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const required = ['VITE_API_URL'];
  if (command === 'serve') required.push('VITE_DEV_PROXY_TARGET', 'VITE_PORT');
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required frontend environment variable(s): ${missing.join(', ')}`);
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.VITE_PORT),
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_DEV_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/recharts')) {
              return 'recharts';
            }
            if (id.includes('node_modules/motion')) {
              return 'motion';
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
              return 'react-vendor';
            }
          },
        },
      },
    },
  };
});
