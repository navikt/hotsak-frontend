import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle'
import { OppgaveApiOppgave } from '../../types/experimentalTypes'

import { formaterNavn } from '../../utils/formater'
import { DokumentIkkeTildelt } from './DokumentIkkeTildelt'

export interface DokumentTildelingProps {
  dokumentOppgave: OppgaveApiOppgave
  lesevisning?: boolean
}

export function DokumentTildeling({ dokumentOppgave, lesevisning }: DokumentTildelingProps) {
  if (lesevisning) {
    return <TekstCell value="-" />
  }

  return dokumentOppgave.tildeltSaksbehandler ? (
    <EllipsisCell value={formaterNavn(dokumentOppgave.tildeltSaksbehandler.navn)} minLength={15} />
  ) : (
    <DokumentIkkeTildelt
      oppgaveId={dokumentOppgave.oppgaveId}
      journalpostId={dokumentOppgave.journalpostId!}
      gåTilSak={true}
    />
  )
}
