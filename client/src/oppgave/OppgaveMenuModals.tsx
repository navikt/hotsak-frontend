import { SettPåVentModal } from './SettPåVentModal.tsx'
import { type Oppgave } from './oppgaveTypes.ts'
import { EndreGjelderModal } from './EndreGjelderModal.tsx'
import { OverførTilMedarbeiderModal } from './OverførTilMedarbeiderModal.tsx'
import { FortsettBehandlingModal } from './FortsettBehandlingModal.tsx'

export interface OppgaveMenuModalsProps {
  oppgave: Oppgave
}

export function OppgaveMenuModals(props: OppgaveMenuModalsProps) {
  const { oppgave } = props
  return (
    <>
      <SettPåVentModal />
      <FortsettBehandlingModal />
      <EndreGjelderModal oppgave={oppgave} />
      <OverførTilMedarbeiderModal sakId={oppgave.sakId?.toString() ?? ''} />
    </>
  )
}
