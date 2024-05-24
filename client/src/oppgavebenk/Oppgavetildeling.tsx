import { memo } from 'react'

import { EllipsisCell } from '../felleskomponenter/table/Celle'
import { OppgaveV2 } from '../types/types.internal'
import { OppgaveIkkeTildelt } from './OppgaveIkkeTildelt'

interface OppgavetildelingProps {
  oppgave: OppgaveV2
}

export const Oppgavetildeling = memo(({ oppgave }: OppgavetildelingProps) => {
  if (oppgave.saksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />
  } else {
    return <OppgaveIkkeTildelt oppgave={oppgave} gåTilSak={true} />
  }
})
