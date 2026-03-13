import { SettPåVentModal } from './SettPåVentModal.tsx'
import { type Oppgave } from './oppgaveTypes.ts'
import { EndreBehandlingstemaModal } from './EndreBehandlingstemaModal.tsx'
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
      <EndreBehandlingstemaModal oppgave={oppgave} />
      <OverførTilMedarbeiderModal sakId={oppgave.sakId?.toString() ?? ''} />
    </>
  )
}
