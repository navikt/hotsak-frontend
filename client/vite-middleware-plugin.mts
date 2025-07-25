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
      server.middlewares.use('/api', (_req, res, next) => {
        const filepath = './src/mocks/data/barnebriller_søknad.pdf'
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
