import { Normaltekst } from 'nav-frontend-typografi'

import { formaterDato } from '../../utils/date'
import { capitalize } from '../../utils/stringFormating'

import { HjemIkon } from '../../felleskomponenter/ikoner/HjemIkon'
import { KalenderIkon } from '../../felleskomponenter/ikoner/KalenderIkon'
import { MappeIkon } from '../../felleskomponenter/ikoner/MappeIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { Bosituasjon, Bruksarena, Oppgavetype } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Oppgaveetikett } from './Oppgaveetikett'
import { Grid } from './Grid'
import { IconContainer } from './IconContainer'

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
        <Normaltekst data-tip="Saksnummer" data-for="sak">{`Sak: ${saksnr}`}</Normaltekst>
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
