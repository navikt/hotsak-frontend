import { formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import type { Navn } from '../../types/types.internal'
import { CardRow } from './CardRow'
import { BriefcaseIcon, PersonIcon, PhoneIcon } from '@navikt/aksel-icons'

export interface FormidlerCardProps {
  tittel: string
  formidlerNavn: string | Navn
  stilling: string
  kommune: string
  formidlerTelefon: string
}

// tooltip / title -> Kopier formidlers navn
// tooltip / title -> Kopier formidlers stilling
// tooltip / title -> Kopier telefonnummer

export function FormidlerCard({ tittel, formidlerNavn, kommune, formidlerTelefon, stilling }: FormidlerCardProps) {
  const formidlerNavnFormatert = formaterNavn(formidlerNavn)
  return (
    <Card>
      <CardTitle level="1" size="medium">
        {tittel}
      </CardTitle>
      <CardRow
        icon={<PersonIcon />}
        copyText={formidlerNavnFormatert}
        copyKind="formidlers navn"
      >{`${formidlerNavnFormatert} - ${storForbokstavIAlleOrd(kommune)}`}</CardRow>
      <CardRow
        icon={<BriefcaseIcon />}
        copyText={stilling}
        copyKind="formidlers stilling"
      >{`${storForbokstavIAlleOrd(stilling)}`}</CardRow>
      <CardRow icon={<PhoneIcon />} copyText={formidlerTelefon} copyKind="formidlers telefon">
        {formidlerTelefon}
      </CardRow>
    </Card>
  )
}
