import proxy, { ProxyOptions } from 'express-http-proxy'
import type { Express } from 'express-serve-static-core'

import { logger } from './logging.mjs'
import { exchangeUserToken } from './texas.mjs'
import { tokenFromRequest } from './request.mjs'

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
    const userToken = tokenFromRequest(req)
    if (!userToken) {
      const message = 'User token mangler'
      logger.stdout.warn(message)
      return options
    }

    const result = await exchangeUserToken(userToken, clientId)
    if (result.success) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${result.data.access_token}`,
      }
    } else {
      logger.stdout.warn(result.error)
      return Promise.reject(result.error)
    }

    return options
  }
}
