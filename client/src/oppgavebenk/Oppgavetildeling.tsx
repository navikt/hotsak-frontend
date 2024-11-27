import { memo } from 'react'

import { EllipsisCell } from '../felleskomponenter/table/Celle'
import { OppgaveApiOppgave } from '../types/experimentalTypes'
import { OppgaveIkkeTildelt } from './OppgaveIkkeTildelt'

interface OppgavetildelingProps {
  oppgave: OppgaveApiOppgave
}

export const Oppgavetildeling = memo(({ oppgave }: OppgavetildelingProps) => {
  if (oppgave.tildeltSaksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.tildeltSaksbehandler.navn} />
  } else {
    return <OppgaveIkkeTildelt oppgave={oppgave} />
  }
})
