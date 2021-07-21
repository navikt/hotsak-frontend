import proxy from 'express-http-proxy'
import { Request } from 'express'
import * as core from 'express-serve-static-core'

const envProperties = {
  API_URL: process.env.API_URL || `http://localhost:7070`,
}

const options = () => (
  {
  parseReqBody: false,
  proxyReqPathResolver: (req: Request) => {
    return pathRewriteBasedOnEnvironment(req)
  },
})

const pathRewriteBasedOnEnvironment = (req: Request) => {
  return req.originalUrl
}

const setupProxy = (server: core.Express) => {
  server.use('/api/', proxy(envProperties.API_URL + '/api', options()))
}

export default setupProxy
