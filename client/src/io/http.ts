import { isNumber } from '../utils/type'

import type {
  AvvisBestilling,
  OppgaveStatusType,
  OverforGosysTilbakemelding,
  Vedtaksgrunnlag,
  VedtakStatusType,
} from '../types/types.internal'

export interface SaksbehandlingApiResponse<T = any> {
  status: number
  data: T
}

const baseUrl = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production' ? '' : `http://localhost:3001`

type Headers = { [key: string]: any }

export class ResponseError extends Error {
  constructor(readonly statusCode: number, message?: string) {
    super(message)
  }

  isUnauthorized() {
    return this.statusCode === 401
  }

  isNotFound() {
    return this.statusCode === 404
  }

  isInternalServerError() {
    return this.statusCode === 500
  }
}

export function isResponseError(value: unknown): value is ResponseError {
  return value instanceof ResponseError || isNumber((value as any).statusCode)
}

const getData = async (response: Response) => {
  try {
    return await response.json()
  } catch (e) {
    return undefined
  }
}

const getErrorMessage = async (response: Response) => {
  try {
    return await response.text()
  } catch (e) {
    return undefined
  }
}

const save = async (url: string, method: string, data: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  const response = await fetch(url, {
    method: method,
    headers: {
      ...headere,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.status > 400) {
    const message = await getErrorMessage(response)
    throw new ResponseError(response.status, message)
  }

  return {
    status: response.status,
    data: await getData(response),
  }
}

export const post = async (url: string, data: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'POST', data, headere)
}

export const put = async (url: string, data?: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'PUT', data, headere)
}

export const del = async (url: string, data?: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'DELETE', data, headere)
}

export const httpGet = async <T = any>(url: string): Promise<SaksbehandlingApiResponse<T>> => {
  const headers = { headers: { Accept: 'application/json' } }
  const response = await fetch(`${baseUrl}/${url}`, headers)

  if (response.status >= 400) {
    const errorMessage = await getErrorMessage(response)
    throw new ResponseError(response.status, errorMessage)
  }

  return {
    status: response.status,
    data: await getData(response),
  }
}

export const hentBrukerdataMedPost = async (
  url: string,
  brukersFodselsnummer: string
): Promise<SaksbehandlingApiResponse> => {
  const response = await post(`${baseUrl}/${url}`, { brukersFodselsnummer }, {})

  return {
    status: response.status,
    data: response.data,
  }
}

export const postTildeling = async (oppgavereferanse: string) => {
  return post(`${baseUrl}/api/tildeling/${oppgavereferanse}`, {})
}

export const tildelBestilling = async (oppgavereferanse: string) => {
  return post(`${baseUrl}/api/bestilling/tildeling/${oppgavereferanse}`, {})
}

export const deleteFjernTildeling = async (oppgavereferanse: string) => {
  return del(`${baseUrl}/api/tildeling/${oppgavereferanse}`, {})
}

export const putVedtak = async (saksnummer: string, status: VedtakStatusType, vedtaksgrunnlag: Vedtaksgrunnlag[]) => {
  return put(`${baseUrl}/api/vedtak-v2/${saksnummer}`, { status, vedtaksgrunnlag })
}

export const putFerdigstillBestilling = async (bestillingsnummer: string, status: OppgaveStatusType) => {
  return put(`${baseUrl}/api/bestilling/ferdigstill/${bestillingsnummer}`, { status })
}

export const putSendTilGosys = async (saksnummer: string, tilbakemelding: OverforGosysTilbakemelding) => {
  return put(`${baseUrl}/api/tilbakefoer/${saksnummer}`, { tilbakemelding })
}

export const putAvvisBestilling = async (saksnummer: string, tilbakemelding: AvvisBestilling) => {
  return put(`${baseUrl}/api/bestilling/avvis/${saksnummer}`, { tilbakemelding })
}

export const postEndringslogginnslagLest = async (endringslogginnslagId: string) => {
  return post(`${baseUrl}/api/endringslogg/leste`, { endringslogginnslagId })
}
