import useSWRImmutable from 'swr/immutable'
import { http } from '../io/HttpClient'

interface OppgaveFiltreResponse {
  områder: string[]
  saksbehandlere: string[]
  gjelderVerdier: string[]
  behandlingstyper: string[]
}

export interface OppgaveFiltre {
  områder: ReadonlySet<string>
  saksbehandlere: ReadonlySet<string>
  gjelderVerdier: ReadonlySet<string>
  behandlingstyper: ReadonlySet<string>
}

const ingenFiltere: OppgaveFiltre = {
  områder: new Set(),
  saksbehandlere: new Set(),
  gjelderVerdier: new Set(),
  behandlingstyper: new Set(),
}

export function useOppgaveFiltre(): OppgaveFiltre {
  const { data } = useSWRImmutable<OppgaveFiltre>('/api/oppgaver/filtre', async (url: string) => {
    const result = await http.get<OppgaveFiltreResponse>(url)
    return {
      områder: new Set(result.områder),
      saksbehandlere: new Set(result.saksbehandlere),
      gjelderVerdier: new Set(result.gjelderVerdier),
      behandlingstyper: new Set(result.behandlingstyper),
    }
  })
  return data ?? ingenFiltere
}
