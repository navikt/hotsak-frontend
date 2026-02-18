import { VStack } from '@navikt/ds-react'

import { Tekst } from '../../../../felleskomponenter/typografi'
import { SidebarPanel } from '../../../../sak/v2/sidebars/SidebarPanel.tsx'
import { useInnloggetAnsatt } from '../../../../tilgang/useTilgang.ts'
import { OppgaveStatusType, StegType, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { TotrinnskontrollForm } from './TotrinnskontrollForm'
import { TotrinnskontrollLesevisning } from './TotrinnskontrollLesevisning'

export function TotrinnskontrollPanel() {
  const saksbehandler = useInnloggetAnsatt()

  const { sak, error } = useBarnebrillesak()

  if (error || !sak) {
    return (
      <SidebarPanel tittel="Totrinnskontroll">
        <Tekst>Feil ved henting av sak..</Tekst>
      </SidebarPanel>
    )
  }

  if (!sak.data.saksbehandler || sak.data.saksbehandler.id === '') {
    return (
      <SidebarPanel tittel="Totrinnskontroll">
        <Tekst>{'Ingen saksbehandler har tatt saken enda. Velg "Ta saken" fra oppgavelisten.'}</Tekst>
      </SidebarPanel>
    )
  }

  const totrinnskontrollFullført =
    sak.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.RETURNERT ||
    sak.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.GODKJENT

  if (
    !totrinnskontrollFullført &&
    sak.data.saksstatus !== OppgaveStatusType.VEDTAK_FATTET &&
    sak.data.saksbehandler &&
    sak.data.saksbehandler.id !== saksbehandler.id
  ) {
    return (
      <SidebarPanel tittel="Totrinnskontroll">
        <Tekst>En annen saksbehandler har allerede tatt denne saken.</Tekst>
      </SidebarPanel>
    )
  }

  if (!totrinnskontrollFullført && sak.data.steg !== StegType.GODKJENNE) {
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
