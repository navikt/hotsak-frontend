import { VStack } from '@navikt/ds-react'

import { Brødtekst, Tekst } from '../../../../felleskomponenter/typografi'
import { OppgaveStatusType, StegType, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { HøyrekolonnePanel } from '../../../høyrekolonne/HøyrekolonnePanel'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { TotrinnskontrollForm } from './TotrinnskontrollForm'
import { TotrinnskontrollLesevisning } from './TotrinnskontrollLesevisning'
import { useInnloggetAnsatt } from '../../../../tilgang/useTilgang.ts'

export function TotrinnskontrollPanel() {
  const saksbehandler = useInnloggetAnsatt()

  const { sak, error } = useBarnebrillesak()

  if (error || !sak) {
    return (
      <HøyrekolonnePanel tittel="Totrinnskontroll">
        <Tekst>Feil ved henting av sak..</Tekst>
      </HøyrekolonnePanel>
    )
  }

  if (!sak.data.saksbehandler || sak.data.saksbehandler.id === '') {
    return (
      <HøyrekolonnePanel tittel="Totrinnskontroll">
        <Brødtekst>{'Ingen saksbehandler har tatt saken enda. Velg "Ta saken" fra oppgavelisten.'}</Brødtekst>
      </HøyrekolonnePanel>
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
      <HøyrekolonnePanel tittel="Totrinnskontroll">
        <Tekst>En annen saksbehandler har allerede tatt denne saken.</Tekst>
      </HøyrekolonnePanel>
    )
  }

  if (!totrinnskontrollFullført && sak.data.steg !== StegType.GODKJENNE) {
    return (
      <HøyrekolonnePanel tittel="Totrinnskontroll">
        <Tekst>Saken er ikke klar til godkjenning.</Tekst>
      </HøyrekolonnePanel>
    )
  }

  return (
    <HøyrekolonnePanel tittel="Totrinnskontroll">
      <VStack gap="5">
        <Brødtekst>Kontrollér opplysninger og faglige vurderinger som er gjort.</Brødtekst>
        {!totrinnskontrollFullført ? <TotrinnskontrollForm /> : <TotrinnskontrollLesevisning />}
      </VStack>
    </HøyrekolonnePanel>
  )
}
