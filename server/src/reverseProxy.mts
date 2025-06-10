import proxy, { ProxyOptions } from 'express-http-proxy'
import type { Express } from 'express-serve-static-core'
import { getToken, requestAzureOboToken } from '@navikt/oasis'
import { logger } from './logging.mjs'

export function reverseProxy(server: Express): void {
  server.use(
    '/heit-krukka/',
    proxy(process.env.HEIT_KRUKKA_URL, {
      parseReqBody: false,
      proxyReqOptDecorator: onBehalfOfDecorator(process.env.CLIENT_ID_HEIT_KRUKKA_API),
    })
  )
  server.use(
    '/api/',
    proxy(process.env.API_URL, {
      parseReqBody: false,
      proxyReqOptDecorator: onBehalfOfDecorator(process.env.CLIENT_ID_HOTSAK_API),
      // vi vil ha med "/api/" i kall mot hm-saksbehandling
      proxyReqPathResolver: (req) => req.originalUrl,
    })
  )
  server.use('/finnhjelpemiddel-api', proxy(process.env.FINN_HJELPEMIDDEL_API_URL))
  server.use('/brillekalkulator-api', proxy(process.env.BRILLEKALKULATOR_API_URL))
  server.use('/finnalternativprodukt-api', proxy(process.env.FINN_ALTERNATIV_PRODUKT_API_URL))
}

function onBehalfOfDecorator(clientId: string): ProxyOptions['proxyReqOptDecorator'] {
  return async (options, req) => {
    const token = getToken(req)
    if (!token) {
      const message = 'Token mangler'
      logger.stdout.warn(message)
      return options
    }

    const obo = await requestAzureOboToken(token, clientId)
    if (obo.ok) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${obo.token}`,
      }
    } else {
      const error = new Error('Feil under OnBehalfOf-flyt', { cause: obo.error })
      logger.stdout.warn(error)
      return Promise.reject(error)
    }

    return options
  }
}
