import proxy, { ProxyOptions } from 'express-http-proxy'
import type { Express } from 'express-serve-static-core'
import { getToken, requestAzureOboToken } from '@navikt/oasis'
import { logger } from './logging.mjs'

export function reverseProxy(server: Express): void {
  server.use(
    '/api/',
    proxy(process.env.HOTSAK_API_URL, {
      parseReqBody: false,
      proxyReqOptDecorator: onBehalfOfDecorator(process.env.HOTSAK_API_CLIENT_ID),
      // vi vil ha med "/api/" i kall mot hm-saksbehandling
      proxyReqPathResolver: (req) => req.originalUrl,
    })
  )
  server.use('/grunndata-api', proxy(process.env.GRUNNDATA_API_URL))
  server.use('/alternativprodukter-api', proxy(process.env.ALTERNATIVPRODUKTER_API_URL))
  server.use('/brille-api', proxy(process.env.BRILLE_API_URL))
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
