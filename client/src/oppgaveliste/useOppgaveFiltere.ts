import useSWRImmutable from 'swr/immutable'
import { http } from '../io/HttpClient'

interface OppgaveFiltereResponse {
  områder: string[]
  saksbehandlere: string[]
  gjelderVerdier: string[]
}

export interface OppgaveFiltere {
  områder: ReadonlySet<string>
  saksbehandlere: ReadonlySet<string>
  gjelderVerdier: ReadonlySet<string>
}

const ingenFiltere: OppgaveFiltere = {
  områder: new Set(),
  saksbehandlere: new Set(),
  gjelderVerdier: new Set(),
}

export function useOppgaveFiltere(): OppgaveFiltere {
  const { data } = useSWRImmutable<OppgaveFiltere>('/api/oppgaver/filtere', async (url: string) => {
    const result = await http.get<OppgaveFiltereResponse>(url)
    return {
      områder: new Set(result.områder),
      saksbehandlere: new Set(result.saksbehandlere),
      gjelderVerdier: new Set(result.gjelderVerdier),
    }
  })
  return data ?? ingenFiltere
}
