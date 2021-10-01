import request from 'request-promise-native'

import { OidcConfig } from '../types'

export default (config: OidcConfig) => {
  return {
    hentFor: async (targetClientId: string, accessToken: string) => {
      const options = {
        uri: config.tokenEndpoint,
        json: true,
        method: 'POST',
        form: {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          client_id: config.clientID, // our own
          client_secret: config.clientSecret,
          assertion: accessToken,
          scope: targetClientId, // the app we're reaching out to
          requested_token_use: 'on_behalf_of',
        },
      }
      const response = await request.post(options)
      return response.access_token
    },
  }
}
