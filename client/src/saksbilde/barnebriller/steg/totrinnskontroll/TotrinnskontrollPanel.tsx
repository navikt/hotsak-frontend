import { VStack } from '@navikt/ds-react'

import { Tekst } from '../../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../../../oppgave/useOppgaveregler.ts'
import { SidebarPanel } from '../../../../sak/v2/sidebars/SidebarPanel.tsx'
import { OppgaveStatusType, StegType, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { TotrinnskontrollForm } from './TotrinnskontrollForm'
import { TotrinnskontrollLesevisning } from './TotrinnskontrollLesevisning'

export interface TotrinnskontrollPanelProps {
  oppgave?: Saksbehandlingsoppgave
}

export function TotrinnskontrollPanel({ oppgave }: TotrinnskontrollPanelProps) {
  const { oppgaveErKlarTilBehandling, oppgaveErUnderBehandlingAvAnnenAnsatt } = useOppgaveregler(oppgave)

  const { sak, error } = useBarnebrillesak()
  if (error) {
    return (
      <SidebarPanel tittel="Totrinnskontroll">
        <Tekst>Feil ved henting av sak.</Tekst>
      </SidebarPanel>
    )
  }
  if (!sak) {
    return null
  }

  if (oppgaveErKlarTilBehandling) {
    return (
      <SidebarPanel tittel="Totrinnskontroll">
        <Tekst>Ingen saksbehandler har tatt saken enda. Velg "Ta saken" fra oppgavelisten.</Tekst>
      </SidebarPanel>
    )
  }

  const { saksstatus, steg, totrinnskontroll } = sak.data

  const totrinnskontrollFullført =
    totrinnskontroll?.resultat === TotrinnskontrollVurdering.RETURNERT ||
    totrinnskontroll?.resultat === TotrinnskontrollVurdering.GODKJENT

  if (
    !totrinnskontrollFullført &&
    saksstatus !== OppgaveStatusType.VEDTAK_FATTET &&
    oppgaveErUnderBehandlingAvAnnenAnsatt
  ) {
    return (
      <SidebarPanel tittel="Totrinnskontroll">
        <Tekst>En annen saksbehandler har allerede tatt denne saken.</Tekst>
      </SidebarPanel>
    )
  }

  if (!totrinnskontrollFullført && steg !== StegType.GODKJENNE) {
    return (
      <SidebarPanel tittel="Totrinnskontroll">
        <Tekst>Saken er ikke klar til godkjenning.</Tekst>
      </SidebarPanel>
    )
  }

  return (
    <SidebarPanel tittel="Totrinnskontroll">
      <VStack gap="space-20">
        <Tekst>Kontrollér opplysninger og faglige vurderinger som er gjort.</Tekst>
        {!totrinnskontrollFullført ? <TotrinnskontrollForm /> : <TotrinnskontrollLesevisning />}
      </VStack>
    </SidebarPanel>
  )
}
