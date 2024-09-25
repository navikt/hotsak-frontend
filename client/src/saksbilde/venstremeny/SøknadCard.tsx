import { CalendarIcon, FolderIcon, HouseIcon, PhoneIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { BodyShort } from '@navikt/ds-react'

import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { Mellomtittel } from '../../felleskomponenter/typografi.tsx'
import { Bosituasjon, Bruksarena, Sakstype } from '../../types/types.internal'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterTelefonnummer, storForbokstavIAlleOrd } from '../../utils/formater'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'

export interface SøknadCardProps {
  sakId: number | string
  sakstype: Sakstype
  søknadGjelder: string
  mottattDato: string
  bruksarena: Bruksarena | null
  funksjonsnedsettelser: string[]
  bosituasjon: Bosituasjon | null
  telefon?: string | null
}

export function SøknadCard({
  sakstype,
  sakId,
  mottattDato,
  bruksarena,
  funksjonsnedsettelser,
  bosituasjon,
  telefon,
}: SøknadCardProps) {
  const bruksarenaTekst = bruksarena && bruksarena !== Bruksarena.UKJENT ? storForbokstavIAlleOrd(bruksarena) : ''
  const bosituasjonTekst = lagBosituasjonTekst(bosituasjon)

  return (
    <VenstremenyCard>
      <VenstremenyCardRow icon={<Oppgaveetikett type={sakstype} />} align="center">
        <Mellomtittel spacing={false}>
          {sakstype === Sakstype.BESTILLING ? 'Bestillingsordningen' : 'Søknad om hjelpemidler'}
        </Mellomtittel>
      </VenstremenyCardRow>
      <BodyShort
        data-tip="Saksnummer"
        data-for="sak"
        size="small"
        textColor="subtle"
        spacing
      >{`Sak: ${sakId}`}</BodyShort>
      <VenstremenyCardRow icon={<CalendarIcon />}>Mottatt: {formaterTidsstempel(mottattDato)}</VenstremenyCardRow>
      {bruksarenaTekst && <VenstremenyCardRow icon={<FolderIcon />}>{bruksarenaTekst}</VenstremenyCardRow>}
      {bosituasjonTekst && <VenstremenyCardRow icon={<HouseIcon />}>{bosituasjonTekst}</VenstremenyCardRow>}
      <VenstremenyCardRow icon={<WheelchairIcon title="Funksjonsnedsettelser" />}>
        {storForbokstavIAlleOrd(funksjonsnedsettelser.join(', '))}
      </VenstremenyCardRow>
      {telefon && (
        <VenstremenyCardRow icon={<PhoneIcon />} copyText={telefon} copyKind="formidlers telefon">
          {formaterTelefonnummer(telefon)}
        </VenstremenyCardRow>
      )}
    </VenstremenyCard>
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
