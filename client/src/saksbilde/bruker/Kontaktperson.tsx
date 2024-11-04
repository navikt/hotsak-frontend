import { CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Kontaktperson as KontaktpersonType, Levering } from '../../types/BehovsmeldingTypes'
import { formaterNavn } from '../../utils/formater'

export interface KontaktpersonProps {
  levering: Levering
}

export function Kontaktperson({ levering }: KontaktpersonProps) {
  if (!levering.utleveringKontaktperson) return null
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)
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

export function lagKontaktpersonTekst(levering: Levering): string {
  const { hjelpemiddelformidler, utleveringKontaktperson, annenKontaktperson } = levering
  switch (utleveringKontaktperson) {
    case KontaktpersonType.HJELPEMIDDELBRUKER:
      return 'Hjelpemiddelbruker'
    case KontaktpersonType.HJELPEMIDDELFORMIDLER:
      return `Formidler (${formaterNavn(hjelpemiddelformidler.navn)})`
    case KontaktpersonType.ANNEN_KONTAKTPERSON:
      return annenKontaktperson
        ? `${formaterNavn(annenKontaktperson.navn)}. Telefon: ${annenKontaktperson.telefon}`
        : ''
    case undefined:
      return 'Ukjen kontaktperson'
  }
}
