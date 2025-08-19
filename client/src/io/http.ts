import type {
  BrevTekst,
  Brevtype,
  EndretHjelpemiddelRequest,
  JournalføringRequest,
  OppdaterVilkårData,
  OppgaveStatusType,
  VurderVilkårRequest,
} from '../types/types.internal'
import { HttpError } from './HttpError.ts'

export interface SaksbehandlingApiResponse<T = any> {
  status: number
  data: T
}

export interface PDFResponse {
  status: number
  data: Blob
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

async function getBlob(response: Response): Promise<undefined | Blob> {
  try {
    return await response.blob()
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

export const put = async (url: string, data?: any, headers?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'PUT', data, headers)
}

export const del = async (url: string, data?: any, headers?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'DELETE', data, headers)
}

export const httpGetPdf = async (url: string): Promise<PDFResponse> => {
  const headers = {
    headers: {
      Accept: 'application/pdf, application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  }

  const response = await fetch(`${baseUrl}/${url}`, headers)
  if (!response.ok) {
    const errorMessage = await getErrorMessage(response)
    throw new HttpError(errorMessage, response.status)
  }

  const blob = await getBlob(response)
  if (!blob) {
    throw new HttpError('Feil ved uthenting av PDF-blob', response.status)
  }

  return {
    status: response.status,
    data: blob,
  }
}

export const httpGet = async <T = any>(url: string): Promise<SaksbehandlingApiResponse<T>> => {
  const headers = {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  }

  const response = await fetch(`${baseUrl}/${url}`, headers)
  if (!response.ok) {
    const errorMessage = await getErrorMessage(response)
    throw new HttpError(errorMessage, response.status)
  }

  return {
    status: response.status,
    data: (await getData<T>(response)) as T,
  }
}

export const hentBrukerdataMedPost: any = async ([
  url,
  fnr,
  sakstype,
  behandlingsstatus,
]: string[]): Promise<SaksbehandlingApiResponse> => {
  const response = await post(`${baseUrl}/${url}`, { fnr, sakstype, behandlingsstatus }, {})

  return {
    status: response.status,
    data: response.data,
  }
}

export const putOppdaterStatus = async (sakId: number | string, nyStatus: OppgaveStatusType) => {
  return put(`${baseUrl}/api/sak/${sakId}/status`, { status: nyStatus })
}

export const postJournalføring = async (journalføringRequest: JournalføringRequest) => {
  return post(`${baseUrl}/api/journalpost/${journalføringRequest.journalpostId}/journalforing`, journalføringRequest)
}

export const postVilkårsvurdering = async (vurderVilkårRequest: VurderVilkårRequest) => {
  return post(`${baseUrl}/api/sak/${vurderVilkårRequest.sakId}/vilkarsgrunnlag`, vurderVilkårRequest)
}

export const putOppdaterVilkår = async (
  sakId: number | string,
  vilkårId: string,
  oppdaterVilkårData: OppdaterVilkårData
) => {
  return put(`${baseUrl}/api/sak/${sakId}/vilkar/${vilkårId}`, oppdaterVilkårData)
}

export const putEndreHjelpemiddel = async (sakId: number | string, endreHjelpemiddel: EndretHjelpemiddelRequest) => {
  return put(`${baseUrl}/api/sak/${sakId}/hjelpemidler`, endreHjelpemiddel)
}

export const postEndringslogginnslagLest = async (endringslogginnslagId: string) => {
  return post(`${baseUrl}/api/endringslogg/leste`, { endringslogginnslagId })
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
