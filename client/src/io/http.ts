import type { ISvar, Tilbakemelding } from '../innsikt/Besvarelse'

import type {
  AvvisBestilling,
  BrevTekst,
  Brevtype,
  EndretHjelpemiddel,
  JournalføringRequest,
  OppdaterVilkårData,
  OppgaveStatusType,
  VedtakStatusType,
  VurderVilkårRequest,
} from '../types/types.internal'
import { isNumber } from '../utils/type'

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
  constructor(
    readonly statusCode: number,
    message?: string
  ) {
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
  return value instanceof ResponseError || isNumber((value as any)?.statusCode)
}

const getData = async (response: Response) => {
  try {
    return await response.json()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return undefined
  }
}

const getBlob = async (response: Response) => {
  try {
    const data = await response.blob()
    return data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return undefined
  }
}

const getErrorMessage = async (response: Response) => {
  try {
    return await response.text()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return undefined
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
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const message = await getErrorMessage(response)
    throw new ResponseError(response.status, message)
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
  const headers = {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  }
  const response = await fetch(`${baseUrl}/${url}`, headers)

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response)

    throw new ResponseError(response.status, errorMessage)
  }

  return {
    status: response.status,
    data: await getData(response),
  }
}

export const hentBrukerdataMedPost: any = async ([
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

export const postTildeling = async (sakId: number | string, overtaHvisTildelt: boolean | undefined = undefined) => {
  let data = {}
  if (!overtaHvisTildelt) {
    data = { overtaHvisTildelt: false }
  }
  return post(`${baseUrl}/api/sak/${sakId}/tildeling`, data)
}

// Nytt oppgave API
export const postOppgaveTildeling = async (oppgaveId: string) => {
  return post(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, {})
}

export const putOppdaterStatus = async (sakId: number | string, nyStatus: OppgaveStatusType) => {
  return put(`${baseUrl}/api/sak/${sakId}/status`, { status: nyStatus })
}

export const postJournalføringStartet = async (oppgaveId: string) => {
  return post(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, {})
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

export const deleteFjernOppgaveTildeling = async (oppgaveId: string) => {
  return del(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, {})
}

export const deleteFjernTildeling = async (sakId: number | string) => {
  return del(`${baseUrl}/api/sak/${sakId}/tildeling`, {})
}

export const putVedtak = async (sakId: number | string, status: VedtakStatusType, problemsammendrag: string) => {
  return put(`${baseUrl}/api/sak/${sakId}/vedtak`, { status, problemsammendrag })
}

export const putFerdigstillBestilling = async (sakId: number | string, status: OppgaveStatusType) => {
  return put(`${baseUrl}/api/bestilling/${sakId}/ferdigstilling`, { status })
}

export const putAvvisBestilling = async (sakId: number | string, tilbakemelding: AvvisBestilling) => {
  return put(`${baseUrl}/api/bestilling/${sakId}/avvisning`, { tilbakemelding })
}

export const putEndreHjelpemiddel = async (sakId: number | string, endreHjelpemiddel: EndretHjelpemiddel) => {
  return put(`${baseUrl}/api/bestilling/${sakId}`, endreHjelpemiddel)
}

export const putSendTilGosys = async (sakId: number | string, tilbakemelding: ISvar[]) => {
  return put(`${baseUrl}/api/sak/${sakId}/tilbakeforing`, { tilbakemelding })
}

export const postTilbakemelding = async (sakId: number | string, tilbakemelding: Tilbakemelding) => {
  return post(`${baseUrl}/api/sak/${sakId}/tilbakemelding`, {
    tilbakemelding,
  })
}

export const postEndringslogginnslagLest = async (endringslogginnslagId: string) => {
  return post(`${baseUrl}/api/endringslogg/leste`, { endringslogginnslagId })
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

export const deleteBrevutkast = async (sakId: string, brevtype: Brevtype) => {
  return del(`${baseUrl}/api/sak/${sakId}/brevutkast/${brevtype}`)
}

export const postBrevutsending = async (brevTekst: BrevTekst) => {
  return post(`${baseUrl}/api/sak/${brevTekst.sakId}/brevsending`, brevTekst)
}

/**
 * NB! Fungerer kun for MORS pt.
 *
 * @param sakId
 */
export async function postHenleggelse(sakId: string) {
  return post(`${baseUrl}/api/sak/${sakId}/henleggelse`, {
    valgteÅrsaker: ['Bruker er død'],
    begrunnelse: undefined,
  })
}
