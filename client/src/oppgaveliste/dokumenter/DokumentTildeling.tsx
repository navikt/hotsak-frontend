import { EllipsisCell } from '../../felleskomponenter/table/Celle'

import { DokumentOppgave } from '../../types/types.internal'
import { DokumentIkkeTildelt } from './DokumentIkkeTildelt'

interface DokumentTildelingProps {
  dokumentOppgave: DokumentOppgave
}

export const DokumentTildeling = ({ dokumentOppgave }: DokumentTildelingProps) =>
  dokumentOppgave.saksbehandler ? (
    <EllipsisCell
      value={dokumentOppgave.saksbehandler.navn}
      minLength={15}
      id={`tildelt-${dokumentOppgave.journalpostID}`}
    />
  ) : (
    <DokumentIkkeTildelt journalpostID={dokumentOppgave.journalpostID} gåTilSak={true} />
  )
