import React from 'react'

import { BodyShort } from '@navikt/ds-react'

import { norskTimestamp } from '../../utils/date'
import { capitalize } from '../../utils/stringFormating'
import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { Bosituasjon, Bruksarena, Sakstype } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { CardRow } from './CardRow'
import { CalendarIcon, FolderIcon, HouseIcon, WheelchairIcon } from '@navikt/aksel-icons'

export interface SøknadCardProps {
  sakId: number | string
  sakstype: Sakstype
  søknadGjelder: string
  mottattDato: string
  bruksarena: Bruksarena | null
  funksjonsnedsettelser: string[]
  bosituasjon: Bosituasjon | null
}

export function SøknadCard({
  sakstype,
  sakId,
  mottattDato,
  bruksarena,
  funksjonsnedsettelser,
  bosituasjon,
}: SøknadCardProps) {
  const bruksarenaTekst = bruksarena && bruksarena !== Bruksarena.UKJENT ? capitalize(bruksarena) : ''
  const bosituasjonTekst = lagBosituasjonTekst(bosituasjon)

  return (
    <Card>
      <CardRow icon={<Oppgaveetikett type={sakstype} />} align="center">
        <CardTitle level="1" size="medium">
          {sakstype === Sakstype.BESTILLING ? 'Bestillingsordningen' : 'Søknad om hjelpemidler'}
        </CardTitle>
      </CardRow>
      <BodyShort
        data-tip="Saksnummer"
        data-for="sak"
        size="small"
        textColor="subtle"
        spacing
      >{`Sak: ${sakId}`}</BodyShort>
      <CardRow icon={<CalendarIcon />}>Mottatt: {norskTimestamp(mottattDato)}</CardRow>
      {bruksarenaTekst && <CardRow icon={<FolderIcon />}>{bruksarenaTekst}</CardRow>}
      {bosituasjonTekst && <CardRow icon={<HouseIcon />}>{bosituasjonTekst}</CardRow>}
      <CardRow icon={<WheelchairIcon title="Funksjonsnedsettelser" />}>
        {capitalize(funksjonsnedsettelser.join(', '))}
      </CardRow>
    </Card>
  )
}

function lagBosituasjonTekst(bosituasjon: Bosituasjon | null) {
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
