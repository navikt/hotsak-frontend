import { EndreGjelderModal } from './EndreGjelderModal.tsx'
import { FortsettBehandlingModal } from './FortsettBehandlingModal.tsx'
import { type Oppgave } from './oppgaveTypes.ts'
import { OverførOppgaveTilGosysModal } from './OverførOppgaveTilGosysModal.tsx'
import { OverførTilMedarbeiderModal } from './OverførTilMedarbeiderModal.tsx'
import { SettPåVentModal } from './SettPåVentModal.tsx'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser.ts'

export interface OppgaveMenuModalsProps {
  oppgave: Oppgave
  spørreundersøkelseId?: SpørreundersøkelseId
}

export function OppgaveMenuModals(props: OppgaveMenuModalsProps) {
  const { oppgave, spørreundersøkelseId } = props
  return (
    <>
      <SettPåVentModal oppgave={oppgave} />
      <FortsettBehandlingModal oppgave={oppgave} />
      <EndreGjelderModal oppgave={oppgave} />
      <OverførTilMedarbeiderModal oppgave={oppgave} />
      <OverførOppgaveTilGosysModal oppgave={oppgave} spørreundersøkelseId={spørreundersøkelseId} />
    </>
  )
}
