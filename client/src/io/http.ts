import type { BrevTekst, Brevtype, VurderVilkårRequest } from '../types/types.internal.ts'
import { HttpError } from './HttpError.ts'

export interface SaksbehandlingApiResponse<T = any> {
  status: number
  data: T
}

export const baseUrl = import.meta.env.NODE_ENV === 'test' || import.meta.env.NODE_ENV === 'production' ? '' : ''

type Headers = { [key: string]: any }

async function getData<T = any>(response: Response): Promise<T | undefined> {
  try {
    return (await response.json()) as T
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return undefined
  }
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    return await response.text()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return 'Ukjent feil'
  }
}

const save = async (url: string, method: string, data: any, headers?: Headers): Promise<SaksbehandlingApiResponse> => {
  const response = await fetch(url, {
    method: method,
    headers: {
      ...headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: data == null ? null : JSON.stringify(data),
  })
  if (!response.ok) {
    const errorMessage = await getErrorMessage(response)
    throw new HttpError(errorMessage, response.status)
  }

  return {
    status: response.status,
    data: await getData(response),
  }
}

export const post = async (url: string, data: any, headers?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'POST', data, headers)
}

export const del = async (url: string, data?: any, headers?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'DELETE', data, headers)
}

export const postVilkårsvurdering = async (vurderVilkårRequest: VurderVilkårRequest) => {
  return post(`${baseUrl}/api/sak/${vurderVilkårRequest.sakId}/vilkarsgrunnlag`, vurderVilkårRequest)
}

export const postBrevutkast = async (brevTekst: BrevTekst) => {
  return post(`${baseUrl}/api/sak/${brevTekst.sakId}/brevutkast`, brevTekst)
}

export const deleteBrevutkast = async (sakId: string, brevtype: Brevtype) => {
  return del(`${baseUrl}/api/sak/${sakId}/brevutkast/${brevtype}`)
}

export const postBrevutsending = async (brevTekst: BrevTekst) => {
  return post(`${baseUrl}/api/sak/${brevTekst.sakId}/brevsending`, brevTekst)
}
