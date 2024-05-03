import React from 'react'

import { capitalize, capitalizeName, formatName } from '../../utils/stringFormating'
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

// tooltip / title -> Kopier formidler navn
// tooltip / title -> Kopier formidler stilling
// tooltip / title -> Kopier telefonnummer

export function FormidlerCard({ tittel, formidlerNavn, kommune, formidlerTelefon, stilling }: FormidlerCardProps) {
  return (
    <Card>
      <CardTitle level="1" size="medium">
        {tittel}
      </CardTitle>
      <CardRow
        icon={<PersonIcon />}
        copyText={formatName(formidlerNavn)}
      >{`${capitalizeName(formidlerNavn)} - ${capitalize(kommune)}`}</CardRow>
      <CardRow icon={<BriefcaseIcon />} copyText={stilling}>{`${capitalize(stilling)}`}</CardRow>
      <CardRow icon={<PhoneIcon />} copyText={formidlerTelefon}>
        {formidlerTelefon}
      </CardRow>
    </Card>
  )
}
