import React from 'react'

import { HStack } from '@navikt/ds-react'

import { formaterDato } from '../../utils/date'
import { capitalize } from '../../utils/stringFormating'

import { Avstand } from '../../felleskomponenter/Avstand'
import { IconContainer, Ikonplaceholder } from '../../felleskomponenter/IconContainer'
import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { HjemIkon } from '../../felleskomponenter/ikoner/HjemIkon'
import { KalenderIkon } from '../../felleskomponenter/ikoner/KalenderIkon'
import { MappeIkon } from '../../felleskomponenter/ikoner/MappeIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { Tekst } from '../../felleskomponenter/typografi'
import { Bosituasjon, Bruksarena, Sakstype } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'

interface SøknadCardProps {
  sakstype: Sakstype
  søknadGjelder: string
  saksnr: number | string
  mottattDato: string
  bruksarena: Bruksarena | null
  funksjonsnedsettelse: string[]
  bosituasjon: Bosituasjon | null
}

const getTextForBosituasjon = (bosituasjon: Bosituasjon | null) => {
  switch (bosituasjon) {
    case null:
      return null
    case Bosituasjon.HJEMME:
      return 'Hjemmeboende'
    case Bosituasjon.HJEMME_EGEN_BOLIG:
      return 'Hjemmeboende i egen bolig'
    case Bosituasjon.HJEMME_OMSORG_FELLES:
      return 'Hjemmeboende i omsorgsbolig e.l.'
    case Bosituasjon.INSTITUSJON:
      return 'Institusjon'
    default:
      return 'Ukjent bosituasjon'
  }
}

export const SøknadCard: React.FC<SøknadCardProps> = ({
  sakstype,
  saksnr,
  mottattDato,
  bruksarena,
  funksjonsnedsettelse,
  bosituasjon,
}) => {
  const bosituasjonTekst = getTextForBosituasjon(bosituasjon)

  return (
    <Card>
      <HStack align="center" gap="2" wrap={false}>
        <IconContainer>
          <Oppgaveetikett type={sakstype} />
        </IconContainer>
        <CardTitle level="1" size="medium">
          {sakstype === Sakstype.BESTILLING ? 'BESTILLINGSORDNINGEN' : 'SØKNAD OM HJELPEMIDLER'}
        </CardTitle>
      </HStack>
      <Avstand paddingBottom={2} />
      <HStack align="center" gap="2" wrap={false}>
        <Ikonplaceholder />
        <Tekst data-tip="Saksnummer" data-for="sak">{`Sak: ${saksnr}`}</Tekst>
      </HStack>
      <HStack align="center" gap="2" wrap={false}>
        <IconContainer>
          <KalenderIkon />
        </IconContainer>
        <Tekst>Mottatt: {formaterDato(mottattDato)}</Tekst>
      </HStack>
      {bruksarena && bruksarena !== Bruksarena.UKJENT && (
        <HStack align="center" gap="2" wrap={false}>
          <IconContainer>
            <MappeIkon />
          </IconContainer>
          <Tekst>{capitalize(bruksarena)}</Tekst>
        </HStack>
      )}
      {bosituasjonTekst && (
        <HStack align="center" gap="2" wrap={false}>
          <IconContainer>
            <HjemIkon />
          </IconContainer>
          <Tekst>{bosituasjonTekst}</Tekst>
        </HStack>
      )}
      <HStack align="center" gap="2" wrap={false}>
        <IconContainer>
          <RullestolIkon title="Funksjonsnedsettelse" />
        </IconContainer>
        <Tekst>{capitalize(funksjonsnedsettelse.join(', '))}</Tekst>
      </HStack>
    </Card>
  )
}
