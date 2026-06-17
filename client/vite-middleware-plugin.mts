import type { Plugin } from 'vite'
import * as fs from 'fs'
import * as path from 'path'

import type { Proxy } from './proxy'
import { velgDokumentFil } from './src/mocks/data/dokumentvelger.ts'

export function middlewarePlugin({ proxy }: { development?: boolean; proxy: Proxy }): Plugin {
  if (proxy.api) {
    return {
      name: 'middleware-plugin',
    }
  }
  return {
    name: 'middleware-plugin',
    configureServer(server) {
      server.middlewares.use('/api/journalpost', (req, res, next) => {
        // req.url er relativ til mount-punktet: "/9002/2"
        const segments = req.url?.split('/').filter(Boolean) ?? []
        if (segments.length !== 2) {
          next()
          return
        }
        const journalpostId = segments[0]
        const dokumentId = segments[1]
        const { filsti } = velgDokumentFil(journalpostId, dokumentId)
        const filepath = path.resolve('./src/mocks/data/pdf', filsti)

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
