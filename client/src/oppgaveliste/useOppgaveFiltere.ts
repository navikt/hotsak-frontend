import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'

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
  const { data } = useSWRImmutable<OppgaveFiltereResponse>('/api/oppgaver/filtere')
  return useMemo(() => {
    if (!data) return ingenFiltere
    return {
      områder: new Set(data.områder),
      saksbehandlere: new Set(data.saksbehandlere),
      gjelderVerdier: new Set(data.gjelderVerdier),
    }
  }, [data])
}
