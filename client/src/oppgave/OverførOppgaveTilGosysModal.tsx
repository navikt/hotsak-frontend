import { type Tilbakemelding } from '../innsikt/Besvarelse'
import { SpørreundersøkelseModal } from '../innsikt/SpørreundersøkelseModal'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser.ts'
import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import type { Oppgave } from './oppgaveTypes'
import { useOppgaveActions } from './useOppgaveActions'

export interface OverførOppgaveTilGosysModalProps {
  oppgave: Oppgave
  spørreundersøkelseId?: SpørreundersøkelseId
}

export function OverførOppgaveTilGosysModal(props: OverførOppgaveTilGosysModalProps) {
  const { oppgave, spørreundersøkelseId = 'journalføringsoppgave_barnebriller_overført_gosys_v1' } = props
  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()
  const open = åpenModal === OppgaveModalType.OVERFØR_TIL_GOSYS
  const { overførOppgave } = useOppgaveActions(oppgave)

  async function onBesvar(tilbakemelding: Tilbakemelding) {
    await overførOppgave.trigger({ tilbakemelding })
    lukkModal()
  }

  return (
    <SpørreundersøkelseModal
      open={open}
      loading={false}
      spørreundersøkelseId={spørreundersøkelseId}
      size="small"
      knappetekst="Overfør til Gosys"
      onBesvar={onBesvar}
      onClose={lukkModal}
    />
  )
}
