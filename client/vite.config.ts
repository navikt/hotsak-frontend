import react from '@vitejs/plugin-react'
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
            GIT_COMMIT: 'ukjent',
            USE_MSW: true,
            MILJO: 'local'
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
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
  },
}))
