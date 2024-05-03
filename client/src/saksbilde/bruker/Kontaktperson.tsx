import React from 'react'

import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Formidler, Kontaktperson as IKontaktperson, KontaktpersonType } from '../../types/types.internal'
import { formaterNavn } from '../../utils/formater'
import { CopyButton, HStack, Tooltip } from '@navikt/ds-react'

export interface KontaktpersonProps {
  formidler: Formidler
  kontaktperson?: IKontaktperson
}

export function Kontaktperson({ formidler, kontaktperson }: KontaktpersonProps) {
  if (!kontaktperson) return null
  const kontaktpersonTekst = lagKontaktpersonTekst(formidler, kontaktperson)
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

export function lagKontaktpersonTekst(formidler: Formidler, kontaktperson?: IKontaktperson): string {
  switch (kontaktperson?.kontaktpersonType) {
    case KontaktpersonType.HJELPEMIDDELBRUKER:
      return 'Hjelpemiddelbruker'
    case KontaktpersonType.HJELPEMIDDELFORMIDLER:
      return `Formidler (${formaterNavn(formidler.navn)})`
    case KontaktpersonType.ANNEN_KONTAKTPERSON:
      return `${kontaktperson.navn}. Telefon: ${kontaktperson.telefon}`
  }
  return ''
}
