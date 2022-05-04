import React from 'react'

import { formaterDato } from '../../utils/date'
import { capitalize } from '../../utils/stringFormating'

import { IconContainer } from '../../felleskomponenter/IconContainer'
import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { HjemIkon } from '../../felleskomponenter/ikoner/HjemIkon'
import { KalenderIkon } from '../../felleskomponenter/ikoner/KalenderIkon'
import { MappeIkon } from '../../felleskomponenter/ikoner/MappeIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { Tekst } from '../../felleskomponenter/typografi'
import { Bosituasjon, Bruksarena, Oppgavetype } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'

interface PeriodeCardProps {
  søknadGjelder: string
  saksnr: string
  mottattDato: string
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

export const SøknadCard: React.VFC<PeriodeCardProps> = ({
  søknadGjelder,
  saksnr,
  mottattDato,
  bruksarena,
  funksjonsnedsettelse,
  bosituasjon,
}) => {
  return (
    <Card>
      <Grid>
        <IconContainer>
          <Oppgaveetikett type={Oppgavetype.SØKNAD} />
        </IconContainer>
        <CardTitle>SØKNAD OM HJELPEMIDLER</CardTitle>
        <IconContainer />
        <Tekst data-tip="Saksnummer" data-for="sak">{`Sak: ${saksnr}`}</Tekst>
        <IconContainer>
          <KalenderIkon />
        </IconContainer>
        <Tekst>Mottatt: {formaterDato(mottattDato)}</Tekst>
        <IconContainer>
          <MappeIkon />
        </IconContainer>
        <Tekst>{capitalize(bruksarena)}</Tekst>
        <IconContainer>
          <HjemIkon />
        </IconContainer>
        <Tekst>{getTextForBosituasjon(bosituasjon)}</Tekst>
        <IconContainer>
          <RullestolIkon title="Funksjonsnedsettelse" />
        </IconContainer>
        <Tekst>{capitalize(funksjonsnedsettelse.join(', '))}</Tekst>
      </Grid>
    </Card>
  )
}
