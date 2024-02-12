import type { Request } from 'express'
import proxy, { ProxyOptions } from 'express-http-proxy'
import * as core from 'express-serve-static-core'
import type { AppConfig, OnBehalfOf } from './types.d.mts'

const envProperties = {
  API_URL: process.env.API_URL || `http://localhost:7070`,
  GRUNNDATA_API_URL: process.env.GRUNNDATA_API_URL || '',
  FINN_HJELPEMIDDEL_API_URL: process.env.FINN_HJELPEMIDDEL_API_URL || '',
  BRILLEKALKULATOR_API_URL: process.env.BRILLEKALKULATOR_API_URL || '',
}
let onBehalfOf: OnBehalfOf
let hotsakApiId: string

const options = (): ProxyOptions => ({
  parseReqBody: false,
  proxyReqOptDecorator: (options, req) => {
    if (process.env.USE_MSW !== 'true') {
      return new Promise((resolve, reject) => {
        const hotsakToken = req.headers['authorization']!.split(' ')[1]

        if (hotsakToken !== '') {
          onBehalfOf.hentFor(hotsakApiId, hotsakToken).then(
            (onBehalfOfToken) => {
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${onBehalfOfToken}`,
              }
              resolve(options)
            },
            (error) => reject(error)
          )
        } else {
          return resolve(options)
        }
      })
    } else {
      return options
    }
  },
  proxyReqPathResolver: (req) => {
    return pathRewriteBasedOnEnvironment(req)
  },
})

const pathRewriteBasedOnEnvironment = (req: Request) => req.originalUrl

const setupProxy = (server: core.Express, _onBehalfOf: OnBehalfOf, config: AppConfig) => {
  onBehalfOf = _onBehalfOf
  hotsakApiId = config.oidc.clientIDHotsakApi
  server.use('/api/', proxy(envProperties.API_URL + '/api', options()))
  server.use('/grunndata-api', proxy(envProperties.GRUNNDATA_API_URL))
  server.use('/finnhjelpemiddel-api', proxy(envProperties.FINN_HJELPEMIDDEL_API_URL))
  server.use('/brillekalkulator-api', proxy(envProperties.BRILLEKALKULATOR_API_URL))
}

export default setupProxy
