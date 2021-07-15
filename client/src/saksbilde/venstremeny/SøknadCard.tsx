import styled from 'styled-components/macro'

import { Normaltekst } from 'nav-frontend-typografi'
import { Tooltip } from '../../felleskomponenter/Tooltip';

import { formaterDato } from '../../utils/date'
import { capitalize } from '../../utils/stringFormating'

import { Clipboard } from '../../felleskomponenter/clipboard'
import { HjemIkon } from '../../felleskomponenter/ikoner/HjemIkon'
import { KalenderIkon } from '../../felleskomponenter/ikoner/KalenderIkon'
import { MappeIkon } from '../../felleskomponenter/ikoner/MappeIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { Bosituasjon, Bruksarena, Oppgavetype } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Oppgaveetikett } from './Oppgaveetikett'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.25rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

const IconContainer = styled.div`
  justify-self: center;
`

interface PeriodeCardProps {
  søknadGjelder: string
  saksnr: string
  motattDato: string
  bruksarena: Bruksarena
  funksjonsnedsettelse: string[]
  bosituasjon: Bosituasjon
}

const getTextForBosituasjon = (bosituasjon: Bosituasjon) => {
  switch (bosituasjon) {
    case Bosituasjon.HJEMME:
      return 'Hjemmeboende'
    case Bosituasjon.INSTITUSJON:
      return 'Bor på institusjon'
    default:
      return 'Ukjent bosituasjon'
  }
}

export const SøknadCard = ({
  søknadGjelder,
  saksnr,
  motattDato,
  bruksarena,
  funksjonsnedsettelse,
  bosituasjon,
}: PeriodeCardProps) => {
  return (
    <Card>
      <Grid>
        <IconContainer>
          <Oppgaveetikett type={Oppgavetype.Søknad} />
        </IconContainer>
        <CardTitle>{`Søknad om ${søknadGjelder}`}</CardTitle>
        <IconContainer />


          <Clipboard preserveWhitespace={false} copyMessage="Saksnummer er kopiert">
            <Normaltekst  data-tip="Saksnummer" data-for="sak">{`${saksnr}`}</Normaltekst>
          </Clipboard><Tooltip id="sak" />

        <IconContainer>
          <KalenderIkon />
        </IconContainer>
        <Normaltekst>{formaterDato(motattDato)}</Normaltekst>
        <IconContainer>
          <MappeIkon />
        </IconContainer>
        <Normaltekst>{capitalize(bruksarena)}</Normaltekst>
        <IconContainer>
          <HjemIkon />
        </IconContainer>
        <Normaltekst>{getTextForBosituasjon(bosituasjon)}</Normaltekst>
        <IconContainer>
          <RullestolIkon />
        </IconContainer>
        <Normaltekst>{capitalize(funksjonsnedsettelse.join(', '))}</Normaltekst>
      </Grid>
    </Card>
  )
}
