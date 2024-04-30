import useSwr from 'swr'
import { httpGet } from '../../io/http'
import { OppgaverResponse, Oppgavetype } from '../../types/types.internal'

const oppgaverBasePath = 'api/oppgaver-v2'

interface OppgaverData {
  data?: OppgaverResponse
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

export function useDokumentliste(): OppgaverData {
  const relevanteStatuser = ['OPPRETTET', 'ÅPNET', 'UNDER_BEHANDLING']
    .map((status) => `oppgavestatus=${encodeURIComponent(status)}`)
    .join('&')

  const { data, error, mutate, isLoading } = useSwr<{ data: OppgaverResponse }>(
    `${oppgaverBasePath}?oppgavetype=${encodeURIComponent(Oppgavetype.JOURNALFØRING)}&${relevanteStatuser}`,
    httpGet,
    {
      refreshInterval: 10_000,
    }
  )

  return {
    ...data,
    isLoading,
    error,
    mutate,
  }
}
