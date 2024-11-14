import { CalendarIcon, PhoneIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { BodyShort } from '@navikt/ds-react'

import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { Mellomtittel } from '../../felleskomponenter/typografi.tsx'
import { Sakstype } from '../../types/types.internal'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterTelefonnummer, storForbokstavIAlleOrd } from '../../utils/formater'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'

export interface SøknadCardProps {
  sakId: number | string
  sakstype: Sakstype
  søknadGjelder: string
  søknadMottatt: string
  funksjonsnedsettelser: string[]
  telefon?: string | null
}

export function SøknadCard({ sakstype, sakId, søknadMottatt, funksjonsnedsettelser, telefon }: SøknadCardProps) {
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
      <VenstremenyCardRow icon={<CalendarIcon />}>Mottatt: {formaterTidsstempel(søknadMottatt)}</VenstremenyCardRow>
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
