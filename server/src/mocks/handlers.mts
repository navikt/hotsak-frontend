import { graphql, http, HttpResponse, RequestHandler } from 'msw'
import { publicJwk } from '../testSupport.mjs'

export const handlers: RequestHandler[] = [
  /**
   * Stub for AZURE_OPENID_CONFIG_JWKS_URI.
   */
  http.get('http://azure.test/keys', async () => {
    return HttpResponse.json({ keys: [publicJwk] })
  }),

  /**
   * Stub for AZURE_OPENID_CONFIG_TOKEN_ENDPOINT.
   */
  http.post('http://azure.test/token', async ({ request }) => {
    const formData = await request.formData()
    return HttpResponse.json({
      access_token: formData.get('assertion'),
      expires_in: 600,
      token_type: 'Bearer',
    })
  }),

  /**
   * Stub for HOTSAK_API_URL (hm-saksbehandling).
   */
  http.get<{ sakId: string }>('http://hm-saksbehandling.test/api/sak/:sakId', async ({ params: { sakId } }) => {
    return HttpResponse.json({ sakId })
  }),

  /**
   * Stub for BRILLE_API_URL.
   */
  http.post('http://hm-brille-api.test/api/brillesedler', async () => {
    return HttpResponse.json({ sats: 1 })
  }),

  /**
   * Stub for GRUNNDATA_API_URL.
   */
  graphql.query('FinnHjelpemiddelprodukter', async () => {
    return HttpResponse.json({ data: { products: [] } })
  }),
  /**
   * Stub for ALTERNATIVPRODUKTER_API_URL.
   */
  graphql.query('FinnAlternativeProdukter', async () => {
    return HttpResponse.json({ data: { alternativeProducts: [] } })
  }),
]
