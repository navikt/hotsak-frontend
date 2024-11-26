import { EllipsisCell } from '../../felleskomponenter/table/Celle'
import { OppgaveApiOppgave } from '../../types/experimentalTypes'

import { formaterNavn } from '../../utils/formater'
import { DokumentIkkeTildelt } from './DokumentIkkeTildelt'

export interface DokumentTildelingProps {
  dokumentOppgave: OppgaveApiOppgave
}

export function DokumentTildeling({ dokumentOppgave }: DokumentTildelingProps) {
  return dokumentOppgave.tildeltSaksbehandler ? (
    <EllipsisCell value={formaterNavn(dokumentOppgave.tildeltSaksbehandler.navn)} minLength={15} />
  ) : (
    <DokumentIkkeTildelt
      oppgaveId={dokumentOppgave.oppgaveId}
      journalpostID={dokumentOppgave.journalpostId!}
      gåTilSak={true}
    />
  )
}
