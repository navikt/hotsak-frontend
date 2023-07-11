import { isNumber } from '../utils/type'

import type {
  AvvisBestilling,
  BrevTekst,
  Brevtype,
  EndreHjelpemiddelRequest,
  JournalføringRequest,
  OppdaterVilkårData,
  OppgaveStatusType,
  OverforGosysTilbakemelding,
  Vedtaksgrunnlag,
  VedtakStatusType,
  VurderVilkårRequest,
} from '../types/types.internal'

export const IKKE_FUNNET = 404
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

const getBlob = async (response: Response) => {
  try {
    const data = await response.blob()
    return data
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

export const httpGetPdf = async (url: string): Promise<PDFResponse> => {
  const headers = { headers: { Accept: 'application/pdf, application/json' } }
  const response = await fetch(`${baseUrl}/${url}`, headers)
  // Trenger vi egne statuser fra backend ala Famile sin RessursStatus?

  if (response.status >= 400) {
    const errorMessage = await getErrorMessage(response)
    throw new ResponseError(response.status, errorMessage)
  }

  const blob = await getBlob(response)

  if (!blob) {
    throw new ResponseError(response.status, 'Feil ved uthenting av PDF blob')
  }

  return {
    status: response.status,
    data: blob,
  }
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

export const hentBrukerdataMedPost = async ([
  url,
  brukersFodselsnummer,
  saksType,
  behandlingsStatus,
]: string[]): Promise<SaksbehandlingApiResponse> => {
  const response = await post(`${baseUrl}/${url}`, { brukersFodselsnummer, saksType, behandlingsStatus }, {})

  return {
    status: response.status,
    data: response.data,
  }
}

export const postTildeling = async (oppgavereferanse: number | string) => {
  return post(`${baseUrl}/api/tildeling/${oppgavereferanse}`, {})
}

export const postJournalføringStartet = async (journalpostID: string) => {
  return post(`${baseUrl}/api/journalpost/${journalpostID}/tildeling`, {})
}

export const postJournalføring = async (journalføringRequest: JournalføringRequest) => {
  return post(`${baseUrl}/api/journalpost/${journalføringRequest.journalpostID}/journalforing`, journalføringRequest)
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

export const tildelBestilling = async (sakId: string) => {
  return post(`${baseUrl}/api/bestilling/tildeling/${sakId}`, {})
}

export const deleteFjernTildeling = async (sakId: number | string) => {
  return del(`${baseUrl}/api/tildeling/${sakId}`, {})
}

export const putVedtak = async (
  sakId: number | string,
  status: VedtakStatusType,
  vedtaksgrunnlag: Vedtaksgrunnlag[]
) => {
  return put(`${baseUrl}/api/vedtak-v2/${sakId}`, { status, vedtaksgrunnlag })
}

export const putFerdigstillBestilling = async (bestillingsnummer: number | string, status: OppgaveStatusType) => {
  return put(`${baseUrl}/api/bestilling/ferdigstill/${bestillingsnummer}`, { status })
}

export const putSendTilGosys = async (sakId: number | string, tilbakemelding: OverforGosysTilbakemelding) => {
  return put(`${baseUrl}/api/tilbakefoer/${sakId}`, { tilbakemelding })
}

export const putAvvisBestilling = async (sakId: number | string, tilbakemelding: AvvisBestilling) => {
  return put(`${baseUrl}/api/bestilling/avvis/${sakId}`, { tilbakemelding })
}

export const postEndringslogginnslagLest = async (endringslogginnslagId: string) => {
  return post(`${baseUrl}/api/endringslogg/leste`, { endringslogginnslagId })
}

export const putEndreHjelpemiddel = async (
  saksnummer: number | string,
  endreHjelpemiddel: EndreHjelpemiddelRequest
) => {
  return put(`${baseUrl}/api/bestilling/v2/${saksnummer}`, endreHjelpemiddel)
}

export const postSaksnotat = async (sakId: string, type: 'INTERNT', innhold: string) => {
  return post(`${baseUrl}/api/sak/${sakId}/notater`, { type, innhold })
}

export const slettSaksnotat = async (sakId: string, notatId: number) => {
  return del(`${baseUrl}/api/sak/${sakId}/notater/${notatId}`)
}

export const postBrevutkast = async (brevTekst: BrevTekst) => {
  return post(`${baseUrl}/api/sak/${brevTekst.sakId}/brevutkast`, brevTekst)
}

export const postBrevutsending = async (brevTekst: BrevTekst) => {
  return post(`${baseUrl}/api/sak/${brevTekst.sakId}/brevsending`, brevTekst)
}
