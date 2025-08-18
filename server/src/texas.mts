/**
 * https://github.com/nais/texas/blob/master/doc/openapi-spec.json
 */

import { failure, flatMapResult, Result, runCatching, success } from './result.mjs'

export interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: 'Bearer'
}

export interface IntrospectResponse extends Record<string, unknown> {
  active: boolean
  error?: string
}

type Parameter = [string, string]
async function request<T>(url: string, ...parameters: Parameter[]): Promise<Result<T>> {
  const body = new FormData()
  body.set('identity_provider', 'azuread')
  parameters.forEach(([name, value]) => {
    body.set(name, value)
  })
  return runCatching(async () => {
    const response = await fetch(url, { method: 'POST', body })
    if (response.ok) {
      return (await response.json()) as T
    } else {
      throw new Error(`${response.status} ${response.statusText}`, { cause: await response.json() })
    }
  })
}

export async function exchangeUserToken(userToken: string, target: string): Promise<Result<TokenResponse>> {
  const url = process.env.NAIS_TOKEN_EXCHANGE_ENDPOINT
  if (!url) {
    throw new Error('NAIS_TOKEN_EXCHANGE_ENDPOINT er ikke satt!')
  }
  return request<TokenResponse>(url, ['target', target], ['user_token', userToken])
}

export async function introspectToken(token: string): Promise<Result<IntrospectResponse>> {
  const url = process.env.NAIS_TOKEN_INTROSPECTION_ENDPOINT
  if (!url) {
    throw new Error('NAIS_TOKEN_INTROSPECTION_ENDPOINT er ikke satt!')
  }
  return request<IntrospectResponse>(url, ['token', token])
}

export async function validateToken(token: string): Promise<Result<string>> {
  const result = await introspectToken(token)
  return flatMapResult(result, ({ active, error }) => {
    if (active) {
      return success('Token er gyldig')
    } else {
      return failure(error)
    }
  })
}
