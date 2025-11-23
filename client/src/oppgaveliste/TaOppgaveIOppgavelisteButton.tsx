import { useNavigate } from 'react-router'
import { EllipsisCell } from '../felleskomponenter/table/Celle.tsx'

import { OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../oppgave/TaOppgaveButton.tsx'
import { Sakstype } from '../types/types.internal.ts'

export function TaOppgaveIOppgavelisteButton({ oppgave, kanTildeles }: { oppgave: OppgaveV2; kanTildeles?: boolean }) {
  const navigate = useNavigate()

  if (oppgave.tildeltSaksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.tildeltSaksbehandler.navn} />
  }

  if (!kanTildeles) {
    return '-'
  }

  return (
    <TaOppgaveButton
      oppgave={oppgave}
      size="xsmall"
      variant="tertiary"
      onOppgavetildeling={(oppgaveId) => {
        if (oppgave.sak?.sakstype === Sakstype.BARNEBRILLER || oppgave.sak?.sakstype === Sakstype.TILSKUDD) {
          navigate(`/oppgave/${oppgaveId}`)
        } else {
          navigate(`/oppgave/${oppgaveId}/hjelpemidler`)
        }
      }}
    />
  )
}
