import useSwr from 'swr'
import { httpGet } from '../../io/http'
import { FinnOppgaverResponse, Oppgavetype, Statuskategori } from '../../oppgave/oppgaveTypes.ts'

const oppgaverBasePath = 'api/oppgaver-v2'

interface OppgaverData {
  data?: FinnOppgaverResponse
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

export function useDokumentliste(): OppgaverData {
  const { data, error, mutate, isLoading } = useSwr<{ data: FinnOppgaverResponse }>(
    `${oppgaverBasePath}?oppgavetype=${encodeURIComponent(Oppgavetype.JOURNALFØRING)}&statuskategori=${encodeURIComponent(Statuskategori.ÅPEN)}`,
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
