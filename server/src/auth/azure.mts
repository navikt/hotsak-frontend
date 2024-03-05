import { logger } from '../logging.mjs'
import type { OidcConfig } from '../types.d.mts'
import { setup as proxy } from './proxy.mjs'
import { Client, custom, Issuer } from 'openid-client'

let azureClient
const proxyAgent = proxy(Issuer, custom)

const setup = (config: OidcConfig): Promise<Client | void> => {
  return new Promise<void | Client>((resolve, reject) => {
    if (process.env.NODE_ENV === 'development' || process.env.USE_MSW === 'true') {
      resolve()
    } else {
      Issuer.discover(config.wellKnownEndpoint)
        .then((azure) => {
          logger.info(`Discovered issuer ${azure.issuer}`)
          azureClient = new azure.Client({
            client_id: config.clientID,
            client_secret: config.clientSecret,
            redirect_uris: [],
            response_types: ['code'],
          })

          if (proxyAgent) {
            azure[custom.http_options] = function (url, options) {
              options.agent = proxyAgent
              return options
            }
            azureClient[custom.http_options] = function (url, options) {
              options.agent = proxyAgent
              return options
            }
          }

          resolve(azureClient)
        })
        .catch((err) => {
          logger.error('Klarte ikke sette opp Azure OpenId Client')
          reject(err)
        })
    }
  })
}

export default { setup }
