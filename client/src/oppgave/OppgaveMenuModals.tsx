import { type SpørreundersøkelseId } from '../innsikt/spørreundersøkelser.ts'
import { EndreOppgaveFraOppgave } from './EndreOppgaveFraOppgave.tsx'
import { type Oppgave } from './oppgaveTypes.ts'
import { OverførOppgaveTilGosysModal } from './OverførOppgaveTilGosysModal.tsx'

export interface OppgaveMenuModalsProps {
  oppgave: Oppgave
  spørreundersøkelseId?: SpørreundersøkelseId
}

export function OppgaveMenuModals(props: OppgaveMenuModalsProps) {
  const { oppgave, spørreundersøkelseId } = props
  return (
    <>
      <EndreOppgaveFraOppgave oppgave={oppgave} />
      <OverførOppgaveTilGosysModal oppgave={oppgave} spørreundersøkelseId={spørreundersøkelseId} />
    </>
  )
}
