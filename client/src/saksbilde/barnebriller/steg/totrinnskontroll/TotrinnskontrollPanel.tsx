import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Panel } from '@navikt/ds-react'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { useInnloggetSaksbehandler } from '../../../../state/authentication'
import { StegType, TotrinnsKontrollData } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { TotrinnskontrollForm } from './TotrinnskontrollForm'
import { TotrinnskontrollLesevisning } from './TotrinnskontrollLesevisning'

export const TotrinnskontrollPanel: React.FC = () => {
  const saksbehandler = useInnloggetSaksbehandler()

  const { sak, isError } = useBrillesak()

  if (isError || !sak) {
    return <div>Feil ved henting av sak</div>
  }

  if (!sak.saksbehandler || sak?.saksbehandler.objectId === '') {
    return <div>{`Ingen saksbehandler har tatt saken enda. Velg "Ta saken" fra oppgavelisten`}</div>
  }

  if (sak.saksbehandler && sak?.saksbehandler.objectId !== saksbehandler.objectId) {
    return (
      <div>
        <Brødtekst>En annen saksbehandler har allerede tatt denne saken </Brødtekst>
      </div>
    )
  }

  const totrinnskontrollFullført =
    sak.totrinnskontroll?.godkjenningsstatus === 'REVURDERING' ||
    sak.totrinnskontroll?.godkjenningsstatus === 'GODKJENT'

  if (!totrinnskontrollFullført && sak.steg !== StegType.GODKJENNE) {
    return <div>Lesevisning eller tomt resultat hvis ingen totrinnskontroll enda</div>
  }

  //const totrinnkontrollMulig = sak.steg === StegType.GODKJENNE && sak?.saksbehandler.objectId !== saksbehandler.objectId

  return (
    <Container>
      <Etikett>TOTRINNSKONTROLL</Etikett>
      <Avstand paddingTop={4} />
      <Brødtekst>Kontrollér opplysninger og faglige vurderinger som er gjort</Brødtekst>
      <Avstand paddingTop={6} />
      {!totrinnskontrollFullført ? <TotrinnskontrollForm /> : <TotrinnskontrollLesevisning />}
    </Container>
  )
}

const Container = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
  min-height: 100vh;
`
