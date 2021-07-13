import config from './config'
import proxy from 'express-http-proxy'

const envProperties = {
  API_URL: process.env.API_URL || `http://localhost:${config.server.port}`,
}

const setupProxy = (server) => {
  console.log('setup proxy ' + envProperties.API_URL)

  server.use(`/api/`, proxy(envProperties.API_URL))
}

export default setupProxy
