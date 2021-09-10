import styled from 'styled-components/macro'

import { Button } from '@navikt/ds-react'

import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Input } from 'nav-frontend-skjema';
import React from 'react';
import { putVedtak } from '../../io/http';
import { StatusType } from '../../types/types.internal';
interface PeriodeCardProps {
  saksnr: string
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

export const SkjemaCard = ({ saksnr }: PeriodeCardProps) => {
const [dokumentbeskrivelse, setDokumentbeskrivelse] = React.useState('')

const opprettVedtak = () => {
    putVedtak(saksnr, dokumentbeskrivelse, StatusType.INNVILGET)
}

  return (
    <Card>
      <CardTitle>DOKUMENTBESKRIVELSE</CardTitle>
      <Input mini label="Søknad om:" description="Skriv inn hjelpemidler feks. rullator, seng." value={dokumentbeskrivelse} onChange={(event) => setDokumentbeskrivelse(event.target.value)} />
      <ButtonContainer>
        <Knapp variant={'action'} size={'s'} onClick={() => opprettVedtak()}>
          Invilg søknaden
        </Knapp>
        <Knapp variant={'primary'} size={'s'} onClick={() => {alert(`Sender søknad med saksnummer ${saksnr} til gode gamle Gosys`)}}>
          Overfør til Gosys
        </Knapp>
      </ButtonContainer>
    </Card>
  )
}
