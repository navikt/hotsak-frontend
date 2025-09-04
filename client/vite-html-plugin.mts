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
            NAIS_CLUSTER_NAME: 'local',
            
            FARO_URL: '',
            IMAGE_PROXY_URL: ${proxy.grunndata ? "'https://finnhjelpemiddel.intern.dev.nav.no/imageproxy/400d'" : "'http://localhost:3001/imageproxy'"},
            
            UMAMI_ENABLED: false,
            UMAMI_WEBSITE_ID: '',
            
            USE_MSW: ${proxy.api ? 'false' : 'true'},
            USE_MSW_GRUNNDATA: ${proxy.grunndata ? 'false' : 'true'},
            USE_MSW_ALTERNATIVPRODUKTER: ${proxy.alternativprodukter ? 'false' : 'true'},
            
            GIT_COMMIT: '',
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
