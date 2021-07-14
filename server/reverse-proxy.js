import config from './config'
import proxy from 'express-http-proxy'

const envProperties = {
  API_URL: process.env.API_URL || `http://localhost:${config.server.port}`,
}

const options = () => ({
  parseReqBody: false,
  proxyReqPathResolver: (req) => {
    return pathRewriteBasedOnEnvironment(req)
  },
})

const pathRewriteBasedOnEnvironment = (req) => {
  console.log('Rewrite ' + req.originalUrl)
  return req.originalUrl
}

const setupProxy = (server) => {
  console.log('setup proxy ' + envProperties.API_URL)

  server.use(`/api/`, proxy(envProperties.API_URL + '/api', options()))
}

export default setupProxy
