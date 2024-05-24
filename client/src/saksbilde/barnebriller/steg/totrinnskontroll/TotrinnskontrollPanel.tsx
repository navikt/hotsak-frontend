import styled from 'styled-components'

import { Panel } from '@navikt/ds-react'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Mellomtittel } from '../../../../felleskomponenter/typografi'
import { useInnloggetSaksbehandler } from '../../../../state/authentication'
import { OppgaveStatusType, StegType, TotrinnskontrollVurdering } from '../../../../types/types.internal'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { TotrinnskontrollForm } from './TotrinnskontrollForm'
import { TotrinnskontrollLesevisning } from './TotrinnskontrollLesevisning'

export function TotrinnskontrollPanel() {
  const saksbehandler = useInnloggetSaksbehandler()

  const { sak, isError } = useBarnebrillesak()

  if (isError || !sak) {
    return <Container>Feil ved henting av sak.</Container>
  }

  if (!sak.data.saksbehandler || sak.data.saksbehandler.id === '') {
    return <Container>{'Ingen saksbehandler har tatt saken enda. Velg "Ta saken" fra oppgavelisten.'}</Container>
  }

  const totrinnskontrollFullført =
    sak.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.RETURNERT ||
    sak.data.totrinnskontroll?.resultat === TotrinnskontrollVurdering.GODKJENT

  if (
    !totrinnskontrollFullført &&
    sak.data.status !== OppgaveStatusType.VEDTAK_FATTET &&
    sak.data.saksbehandler &&
    sak.data.saksbehandler.id !== saksbehandler.id
  ) {
    return (
      <Container>
        <Brødtekst>En annen saksbehandler har allerede tatt denne saken.</Brødtekst>
      </Container>
    )
  }

  if (!totrinnskontrollFullført && sak.data.steg !== StegType.GODKJENNE) {
    return <Container>Lesevisning eller tomt resultat hvis ingen totrinnskontroll ennå.</Container>
  }

  return (
    <Container>
      <Mellomtittel>Totrinnskontroll</Mellomtittel>
      <Brødtekst>Kontrollér opplysninger og faglige vurderinger som er gjort.</Brødtekst>
      <Avstand paddingTop={6}>
        {!totrinnskontrollFullført ? <TotrinnskontrollForm /> : <TotrinnskontrollLesevisning />}
      </Avstand>
    </Container>
  )
}

const Container = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
  min-height: 100vh;
`
