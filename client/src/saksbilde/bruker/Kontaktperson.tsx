import React from 'react'

import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Formidler, KontaktPerson, KontaktPersonType } from '../../types/types.internal'
import { formatName } from '../../utils/stringFormating'
import { CopyButton, HStack, Tooltip } from '@navikt/ds-react'

export interface KontaktpersonProps {
  kontaktperson?: KontaktPerson
  formidler: Formidler
}

export function Kontaktperson({ kontaktperson, formidler }: KontaktpersonProps) {
  if (!kontaktperson) return null
  const { navn, telefon, kontaktpersonType } = kontaktperson

  let kontaktpersonTekst = ''
  switch (kontaktpersonType) {
    case KontaktPersonType.HJELPEMIDDELBRUKER:
      kontaktpersonTekst = 'Hjelpemiddelbruker'
      break
    case KontaktPersonType.HJELPEMIDDELFORMIDLER:
      kontaktpersonTekst = `Formidler (${formatName(formidler.navn)})`
      break
    case KontaktPersonType.ANNEN_KONTAKTPERSON:
      kontaktpersonTekst = `${navn}. Telefon: ${telefon}`
      break
  }

  return (
    <>
      <Etikett>Kontaktperson</Etikett>
      <HStack align="center">
        <Tekst>{kontaktpersonTekst}</Tekst>
        <Tooltip content="Kopier kontaktperson" placement="right">
          <CopyButton size="small" copyText={kontaktpersonTekst} />
        </Tooltip>
      </HStack>
    </>
  )
}
