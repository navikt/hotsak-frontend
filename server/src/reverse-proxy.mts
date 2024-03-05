import proxy, { ProxyOptions } from 'express-http-proxy'
import type { Express } from 'express-serve-static-core'
import type { AppConfig, OnBehalfOf } from './types.d.mts'

const envProperties = {
  API_URL: process.env.API_URL || `http://localhost:7070`,
  FINN_HJELPEMIDDEL_API_URL: process.env.FINN_HJELPEMIDDEL_API_URL || '',
  BRILLEKALKULATOR_API_URL: process.env.BRILLEKALKULATOR_API_URL || '',
  HEIT_KRUKKA_URL: process.env.HEIT_KRUKKA_URL || '',
}

let onBehalfOf: OnBehalfOf
const onBehalfOfDecorator: (tjenesteClientId: string) => ProxyOptions['proxyReqOptDecorator'] =
  (tjenesteClientId) => (options, req) => {
    if (process.env.USE_MSW !== 'true') {
      return new Promise((resolve, reject) => {
        const hotsakToken = req.headers['authorization']!.split(' ')[1]

        if (hotsakToken !== '') {
          onBehalfOf.hentFor(tjenesteClientId, hotsakToken).then(
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
  }

export const setupProxy = (server: Express, _onBehalfOf: OnBehalfOf, config: AppConfig) => {
  onBehalfOf = _onBehalfOf
  server.use(
    '/heit-krukka/',
    proxy(envProperties.HEIT_KRUKKA_URL, {
      parseReqBody: false,
      proxyReqOptDecorator: onBehalfOfDecorator(config.oidc.clientIDHeitKrukkaApi),
    })
  )
  server.use(
    '/api/',
    proxy(envProperties.API_URL, {
      parseReqBody: false,
      proxyReqOptDecorator: onBehalfOfDecorator(config.oidc.clientIDHotsakApi),
      // vi vil ha med "/api/" i kall mot hm-saksbehandling
      proxyReqPathResolver: (req) => req.originalUrl,
    })
  )
  server.use('/finnhjelpemiddel-api', proxy(envProperties.FINN_HJELPEMIDDEL_API_URL))
  server.use('/brillekalkulator-api', proxy(envProperties.BRILLEKALKULATOR_API_URL))
}
