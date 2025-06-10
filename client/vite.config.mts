import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import { htmlPlugin } from './vite-html-plugin.mjs'
import { middlewarePlugin } from './vite-middleware-plugin.mjs'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const { VITE_PROXY, VITE_OBO_TOKEN, VITE_API_URL } = loadEnv(env.mode, process.cwd())
  const proxy = VITE_PROXY === 'true'
  return {
    base: '/',
    plugins: [
      middlewarePlugin({ development: env.mode === 'test' || env.mode === 'development', proxy }),
      htmlPlugin({ development: env.mode === 'test' || env.mode === 'development', proxy }),
      react(),
    ],
    build: {
      manifest: true,
      sourcemap: true,
    },
    server: {
      port: 3001,
      proxy: proxy
        ? {
            '/api': {
              target: VITE_API_URL,
              changeOrigin: true,
              headers: {
                Authorization: `Bearer ${VITE_OBO_TOKEN}`,
              },
            },
            '/finnhjelpemiddel-api': {
              target: 'https://hm-grunndata-search.intern.dev.nav.no',
              changeOrigin: true,
              rewrite(path) {
                return path.replace(/^\/finnhjelpemiddel-api/, '')
              },
            },
            '/finnalternativprodukt-api': {
              target: 'http://localhost:8080',
              changeOrigin: true,
              rewrite(path) {
                return path.replace(/^\/finnalternativprodukt-api/, '')
              },
            },
          }
        : undefined,
      strictPort: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/setupTests.ts',
    },
  }
})
