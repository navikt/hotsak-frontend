import styled from 'styled-components/macro'

import { Button } from '@navikt/ds-react'

import { Card } from './Card'
import { CardTitle } from './CardTitle'

interface PeriodeCardProps {
  saksnr: string
}

const ButtonContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
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
  return (
    <Card>
      <CardTitle>DOKUMENTBESKRIVELSE</CardTitle>
      <ButtonContainer>
        <Knapp variant={'action'} size={'s'} onClick={() => {alert(`Invilger søknad med saksnummer ${saksnr}`)}}>
          Invilg søknaden
        </Knapp>
        <Knapp variant={'primary'} size={'s'} onClick={() => {alert(`Sender søknad med saksnummer ${saksnr} til gode gamle Gosys`)}}>
          Overfør til Gosys
        </Knapp>
      </ButtonContainer>
    </Card>
  )
}
