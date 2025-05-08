import type { Plugin } from 'vite'
import * as fs from 'fs'

export function middlewarePlugin({ proxy }: { development?: boolean; proxy?: boolean }): Plugin {
  if (proxy) {
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
