import type { HtmlTagDescriptor, Plugin } from 'vite'

import type { Proxy } from './proxy'

export function htmlPlugin({ development, proxy }: { development?: boolean; proxy: Proxy }): Plugin {
  return {
    name: 'html-plugin',
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = []
      if (development) {
        tags.push({
          tag: 'script',
          children: `window.appSettings = {
            GIT_COMMIT: 'unknown',
            USE_MSW: ${proxy.api ? 'false' : 'true'},
            USE_MSW_GRUNNDATA: ${proxy.grunndata ? 'false' : 'true'},
            USE_MSW_ALTERNATIVPRODUKTER: ${proxy.alternativprodukter ? 'false' : 'true'},
            MILJO: 'local',
            IMAGE_PROXY_URL: ${proxy.grunndata ? "'https://finnhjelpemiddel.intern.dev.nav.no/imageproxy/400d'" : "'http://localhost:3001/imageproxy'"},
            FARO_URL: '',
            UMAMI_ENABLED: false,
            UMAMI_WEBSITE_ID: '',
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
