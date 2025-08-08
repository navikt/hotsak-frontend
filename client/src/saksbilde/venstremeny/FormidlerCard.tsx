import { BriefcaseIcon, PersonIcon, PhoneIcon } from '@navikt/aksel-icons'

import type { Navn } from '../../types/types.internal'
import { formaterNavn, formaterTelefonnummer, storForbokstavIAlleOrd } from '../../utils/formater'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'

export interface FormidlerCardProps {
  tittel: string
  formidlerNavn: string | Navn
  stilling: string
  kommune: string
  formidlerTelefon: string
}

export function FormidlerCard({ tittel, formidlerNavn, kommune, formidlerTelefon, stilling }: FormidlerCardProps) {
  const formidlerNavnFormatert = formaterNavn(formidlerNavn)
  return (
    <VenstremenyCard heading={tittel}>
      <VenstremenyCardRow
        icon={<PersonIcon />}
        copyText={formidlerNavnFormatert}
      >{`${formidlerNavnFormatert}`}</VenstremenyCardRow>
      <VenstremenyCardRow
        icon={<BriefcaseIcon />}
        copyText={stilling}
      >{`${storForbokstavIAlleOrd(stilling)} - ${storForbokstavIAlleOrd(kommune)}`}</VenstremenyCardRow>
      <VenstremenyCardRow icon={<PhoneIcon />} copyText={formidlerTelefon}>
        {formaterTelefonnummer(formidlerTelefon)}
      </VenstremenyCardRow>
    </VenstremenyCard>
  )
}
