import type { HtmlTagDescriptor, Plugin } from 'vite'

export function htmlPlugin({ development, proxy }: { development?: boolean; proxy?: boolean }): Plugin {
  return {
    name: 'html-plugin',
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = []
      if (development) {
        tags.push({
          tag: 'script',
          children: `window.appSettings = {
            GIT_COMMIT: 'unknown',
            USE_MSW: ${proxy ? 'false' : 'true'},
            MILJO: 'local',
            IMAGE_PROXY_URL: ${proxy ? "'https://finnhjelpemiddel.intern.dev.nav.no/imageproxy/400d'" : "'http://localhost:3001/imageproxy'"},
            FARO_URL: '',
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
