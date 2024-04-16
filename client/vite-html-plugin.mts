import type { HtmlTagDescriptor, Plugin } from 'vite'

export function htmlPlugin({ development }: { development?: boolean }): Plugin {
  return {
    name: 'html-plugin',
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
