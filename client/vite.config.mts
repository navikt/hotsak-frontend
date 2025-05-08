import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { htmlPlugin } from './vite-html-plugin.mjs'
import { middlewarePlugin } from './vite-middleware-plugin.mjs'

/**
 * Sett til true for å gjøre kall til hm-grunndata-search uten mock.
 */
const finnHjelpemiddelProxy = true

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return {
    base: '/',
    plugins: [
      middlewarePlugin({ development: env.mode === 'test' || env.mode === 'development' }),
      htmlPlugin({ development: env.mode === 'test' || env.mode === 'development' }),
      react(),
    ],
    build: {
      manifest: true,
      sourcemap: true,
    },
    server: {
      port: 3001,
      proxy: finnHjelpemiddelProxy
        ? {
            '/finnhjelpemiddel-api': {
              target: 'https://hm-grunndata-search.intern.dev.nav.no',
              changeOrigin: true,
              rewrite(path) {
                return path.replace(/^\/finnhjelpemiddel-api/, '')
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
