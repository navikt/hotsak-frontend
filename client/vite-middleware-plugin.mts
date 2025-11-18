import type { Plugin } from 'vite'
import * as fs from 'fs'

import type { Proxy } from './proxy'

export function middlewarePlugin({ proxy }: { development?: boolean; proxy: Proxy }): Plugin {
  if (proxy.api) {
    return {
      name: 'middleware-plugin',
    }
  }
  return {
    name: 'middleware-plugin',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        const regex = /^\/api\/sak\/\d+\/brev\/BREVEDITOR_VEDTAKSBREV(_.+)?/
        let filepath = './src/mocks/data/barnebriller_søknad.pdf'
        const match = (req.originalUrl || '').match(regex)
        if (match && match.length > 1) {
          switch (match[1]) {
            case '_INNVILGET':
              filepath = './src/mocks/data/breveditor_vedtaksbrev_innvilget.pdf'
              break
            case '_DELVIS_INNVILGET':
              filepath = './src/mocks/data/breveditor_vedtaksbrev_delvis_innvilget.pdf'
              break
            case '_AVSL%C3%85TT':
              filepath = './src/mocks/data/breveditor_vedtaksbrev_avslått.pdf'
              break
            default:
              filepath = './src/mocks/data/breveditor_vedtaksbrev.pdf'
          }
        }
        fs.stat(filepath, (err, stats) => {
          if (err) {
            next(err)
          } else {
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Content-Length': stats.size,
            })
            fs.createReadStream(filepath).pipe(res)
          }
        })
      })
    },
  }
}
