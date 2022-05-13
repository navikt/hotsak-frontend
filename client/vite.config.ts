import react from '@vitejs/plugin-react'
import { defineConfig, HtmlTagDescriptor, Plugin, splitVendorChunkPlugin } from 'vite'

const development = process.env.NODE_ENV === 'development'

const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = []
      if (development) {
        tags.push({
          tag: 'script',
          children: `window.appSettings = {
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
export default defineConfig({
  base: '/',
  plugins: [htmlPlugin(), react(), splitVendorChunkPlugin()],
  build: {
    manifest: true,
    sourcemap: true,
  },
  server: {
    port: 3001,
  },
})
