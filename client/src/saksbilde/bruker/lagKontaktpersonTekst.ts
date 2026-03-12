import { Kontaktperson as KontaktpersonType, Levering } from '../../types/BehovsmeldingTypes.ts'
import { formaterNavn, formaterTelefonnummer } from '../../utils/formater.ts'

export function lagKontaktpersonTekst(levering: Levering): string {
  const { hjelpemiddelformidler, utleveringKontaktperson, annenKontaktperson } = levering
  switch (utleveringKontaktperson) {
    case KontaktpersonType.HJELPEMIDDELBRUKER:
      return 'Hjelpemiddelbruker'
    case KontaktpersonType.HJELPEMIDDELFORMIDLER:
      return `Formidler (${formaterNavn(hjelpemiddelformidler.navn)})`
    case KontaktpersonType.ANNEN_KONTAKTPERSON:
      return annenKontaktperson
        ? `${formaterNavn(annenKontaktperson.navn)}. Telefon: ${formaterTelefonnummer(annenKontaktperson.telefon)}`
        : ''
    default:
      return 'Ukjent kontaktperson'
  }
}
