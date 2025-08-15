import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle.tsx'
import { OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { formaterNavn } from '../../utils/formater'
import { DokumentIkkeTildelt } from './DokumentIkkeTildelt'

export interface DokumentTildelingProps {
  dokumentOppgave: OppgaveV2
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
