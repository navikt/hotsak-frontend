import type { OidcConfig } from '../types'
import fetch from 'node-fetch'

export default (config: OidcConfig) => {
  return {
    hentFor: async (targetClientId: string, accessToken: string): Promise<string> => {
      const body = new URLSearchParams()
      body.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer')
      body.append('client_id', config.clientID) // our own
      body.append('client_secret', config.clientSecret)
      body.append('assertion', accessToken)
      body.append('scope', targetClientId) // the app we're reaching out to
      body.append('requested_token_use', 'on_behalf_of')
      const response = await fetch(config.tokenEndpoint, {
        method: 'POST',
        body,
      })
      if (response.ok) {
        const data = (await response.json()) as { access_token: string }
        return data.access_token
      }
      return Promise.reject(new Error(`kall feilet med status: ${response.status}`))
    },
  }
}
