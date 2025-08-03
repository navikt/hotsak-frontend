import { memo } from 'react'

import { EllipsisCell } from '../felleskomponenter/table/Celle'
import type { OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { OppgaveIkkeTildelt } from './OppgaveIkkeTildelt'

interface OppgavetildelingProps {
  oppgave: OppgaveV2
}

export const Oppgavetildeling = memo(({ oppgave }: OppgavetildelingProps) => {
  if (oppgave.tildeltSaksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.tildeltSaksbehandler.navn} />
  } else {
    return <OppgaveIkkeTildelt oppgave={oppgave} />
  }
})
