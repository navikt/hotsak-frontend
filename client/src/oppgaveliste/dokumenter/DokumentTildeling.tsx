import { EllipsisCell } from '../../felleskomponenter/table/Celle'

import { OppgaveV2 } from '../../types/types.internal'
import { DokumentIkkeTildelt } from './DokumentIkkeTildelt'

interface OppgaveTildelingProps {
  dokumentOppgave: OppgaveV2
}

export const OppgaveTildeling = ({ dokumentOppgave }: OppgaveTildelingProps) =>
  dokumentOppgave.saksbehandler ? (
    <EllipsisCell
      value={dokumentOppgave.saksbehandler.navn}
      minLength={15}
      id={`tildelt-${dokumentOppgave.journalpostId}`}
    />
  ) : (
    // TODO: Fix typer e.l. slik at journalpost ikke er null hvis det er en journalføringsoppgaver
    <DokumentIkkeTildelt journalpostID={dokumentOppgave.journalpostId!} gåTilSak={true} />
  )
