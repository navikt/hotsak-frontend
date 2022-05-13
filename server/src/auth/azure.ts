import logger from '../logging'
import { OidcConfig } from '../types'
import { setup as proxy } from './proxy'
import { Client, custom, Issuer } from 'openid-client'

;('use strict')

let azureClient
const proxyAgent = proxy(Issuer, custom)

const setup = (config: OidcConfig) => {
  return new Promise<void | Client>((resolve, reject) => {
    if (process.env.NODE_ENV === 'development' || process.env.NAIS_CLUSTER_NAME === 'labs-gcp') {
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
            azure[custom.http_options] = function (options) {
              options.agent = proxyAgent
              return options
            }
            azureClient[custom.http_options] = function (options) {
              options.agent = proxyAgent
              return options
            }
          }

          resolve(azureClient)
        })
        .catch((err) => {
          console.log('Klarte ikke sette opp azure client')
          reject(err)
        })
    }
  })
}

export default { setup }
