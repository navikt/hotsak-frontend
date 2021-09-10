import styled from 'styled-components/macro'

import { Button } from '@navikt/ds-react'

import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Input } from 'nav-frontend-skjema'
import React from 'react'
import { putVedtak } from '../../io/http'
import { Sak, StatusType } from '../../types/types.internal'
import { Tekst } from '../../felleskomponenter/typografi'
import { capitalize, capitalizeName } from '../../utils/stringFormating'
import { RundtSjekkikon } from '../../felleskomponenter/ikoner/RundtSjekkikon'
import { Grid } from './Grid'
import {IconContainer} from './IconContainer'
interface VedtakCardProps {
  sak: Sak
}

const ButtonContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-top: 1rem;
  align-self: flex-end;
`

const Knapp = styled(Button)`
  min-height: 0;
  margin: 2px;
  height: 1.8rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
  font-size: var(--navds-font-size-m);
`

export const VedtakCard = ({ sak }: VedtakCardProps) => {
  const { saksid } = sak
  const [dokumentbeskrivelse, setDokumentbeskrivelse] = React.useState(sak.søknadGjelder)

  const opprettVedtak = () => {
    putVedtak(saksid, dokumentbeskrivelse, StatusType.INNVILGET)
  }

  if (sak.status === StatusType.INNVILGET) {
    return (
      <Card>
        <CardTitle>VEDTAK</CardTitle>
        <Grid>
        <IconContainer>
            <RundtSjekkikon/>
            </IconContainer>
        <Tekst>{capitalize(sak.status)} 06.09 2021 av {capitalizeName(sak.saksbehandler.navn)} </Tekst>
        </Grid>
      </Card>
    )
  }

  if (sak.status === StatusType.OVERFØRT_GOSYS) {
    return (
      <Card>
        <CardTitle>DOKUMENTBESKRIVELSE</CardTitle>
        <Tekst>Saken er overført Gosys og behandles videre der. </Tekst>
      </Card>
    )
  } else {
    return (
      <Card>
        <CardTitle>DOKUMENTBESKRIVELSE</CardTitle>
        <Input
          mini
          label="Søknad om:"
          description="Skriv inn hjelpemidler feks. rullator, seng."
          value={dokumentbeskrivelse}
          onChange={(event) => setDokumentbeskrivelse(event.target.value)}
        />
        <ButtonContainer>
          <Knapp variant={'action'} size={'s'} onClick={() => opprettVedtak()}>
            Invilg søknaden
          </Knapp>
          <Knapp
            variant={'primary'}
            size={'s'}
            onClick={() => {
              alert(`Sender søknad med saksnummer ${saksid} til gode gamle Gosys`)
            }}
          >
            Overfør til Gosys
          </Knapp>
        </ButtonContainer>
      </Card>
    )
  }
}
