import config from './config'
import proxy from 'express-http-proxy'

const envProperties = {
  API_URL: process.env.API_URL || `http://localhost:${config.server.port}`,
}

const setup = (server) => {
  server.use(`/api/`, proxy(envProperties.API_URL))
}

module.exports = {
  setup,
}
