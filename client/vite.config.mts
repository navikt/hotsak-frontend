import react from '@vitejs/plugin-react-swc'
import { defineConfig, HtmlTagDescriptor, Plugin, splitVendorChunkPlugin } from 'vite'

function htmlPlugin({ development }: { development?: boolean }): Plugin {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = []
      if (development) {
        tags.push({
          tag: 'script',
          children: `window.appSettings = {
            GIT_COMMIT: 'unknown',
            USE_MSW: true,
            MILJO: 'local',
            FARO_URL: '',
            AMPLITUDE_API_KEY: '',
            AMPLITUDE_SERVER_URL: '',
          }`,
        })
      } else {
        tags.push(
          {
            tag: 'script',
            children: `window.appSettings = {}`,
          },
          {
            tag: 'script',
            attrs: {
              src: '/settings.js',
            },
          }
        )
      }
      return {
        html,
        tags,
      }
    },
  }
}

/**
 * Sett til true for å gjøre kall til grunndata-search uten mock.
 */
const finnHjelpemiddelProxy = false

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  base: '/',
  plugins: [
    htmlPlugin({ development: env.mode === 'test' || env.mode === 'development' }),
    react(),
    splitVendorChunkPlugin(),
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
}))
