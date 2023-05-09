import React from 'react'
import styled from 'styled-components'

import { Panel } from '@navikt/ds-react'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { useInnloggetSaksbehandler } from '../../../../state/authentication'
import { OppgaveStatusType, StegType, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { TotrinnskontrollForm } from './TotrinnskontrollForm'
import { TotrinnskontrollLesevisning } from './TotrinnskontrollLesevisning'

export const TotrinnskontrollPanel: React.FC = () => {
  const saksbehandler = useInnloggetSaksbehandler()

  const { sak, isError } = useBrillesak()

  if (isError || !sak) {
    return <Container>Feil ved henting av sak</Container>
  }

  if (!sak.saksbehandler || sak.saksbehandler.objectId === '') {
    return <Container>{'Ingen saksbehandler har tatt saken enda. Velg "Ta saken" fra oppgavelisten.'}</Container>
  }

  const totrinnskontrollFullført =
    sak.totrinnskontroll?.resultat === TotrinnskontrollVurdering.RETURNERT ||
    sak.totrinnskontroll?.resultat === TotrinnskontrollVurdering.GODKJENT

  if (
    !totrinnskontrollFullført &&
    sak.status !== OppgaveStatusType.VEDTAK_FATTET &&
    sak.saksbehandler &&
    sak.saksbehandler.objectId !== saksbehandler.objectId
  ) {
    return (
      <Container>
        <Brødtekst>En annen saksbehandler har allerede tatt denne saken.</Brødtekst>
      </Container>
    )
  }

  if (!totrinnskontrollFullført && sak.steg !== StegType.GODKJENNE) {
    return <Container>Lesevisning eller tomt resultat hvis ingen totrinnskontroll ennå.</Container>
  }

  return (
    <Container>
      <Etikett>TOTRINNSKONTROLL</Etikett>
      <Avstand paddingTop={4} />
      <Brødtekst>Kontrollér opplysninger og faglige vurderinger som er gjort.</Brødtekst>
      <Avstand paddingTop={6} />
      {!totrinnskontrollFullført ? <TotrinnskontrollForm /> : <TotrinnskontrollLesevisning />}
    </Container>
  )
}

const Container = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
  min-height: 100vh;
`
