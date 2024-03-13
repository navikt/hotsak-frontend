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
}

function onBehalfOfDecorator(clientId: string): ProxyOptions['proxyReqOptDecorator'] {
  return async (options, req) => {
    const token = getToken(req)
    if (!token) {
      const message = 'Token mangler'
      logger.stdout.warn(message)
      logger.sikker.warn(message, { req })
      return options
    }

    const obo = await requestAzureOboToken(token, clientId)
    if (obo.ok) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${obo.token}`,
      }
    } else {
      const message = 'Feil under OnBehalfOf-flyt'
      logger.stdout.warn(message, { err: obo.error })
      logger.sikker.warn(message, { err: obo.error, req })
    }

    return options
  }
}
