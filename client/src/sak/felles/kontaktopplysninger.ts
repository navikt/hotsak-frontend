import { Kontaktperson, type Levering } from '../../types/BehovsmeldingTypes.ts'
import { formaterNavn } from '../../utils/formater.ts'

export const MAKS_LENGDE_KONTAKTOPPLYSNINGER = 150

export function utledKontaktopplysninger(levering?: Levering): string {
  if (!levering) return ''
  const formidlerNavn = formaterNavn(levering.hjelpemiddelformidler?.navn)
  const formidlerTelefon = levering.hjelpemiddelformidler?.telefon
  const annen = levering.annenKontaktperson

  switch (levering.utleveringKontaktperson) {
    case Kontaktperson.HJELPEMIDDELBRUKER: {
      const kontaktTekst = annen?.telefon
        ? `Kontakt ved levering: Bruker, tlf: ${annen.telefon}`
        : 'Kontakt bruker ved levering.'
      return `Innsender: ${formidlerNavn}, tlf: ${formidlerTelefon}.\n${kontaktTekst}`
    }
    case Kontaktperson.HJELPEMIDDELFORMIDLER:
      return annen ? `Innsender: ${formaterNavn(annen.navn)}, tlf: ${annen.telefon}` : formidlerNavn
    case Kontaktperson.ANNEN_KONTAKTPERSON:
      return annen
        ? `Innsender: ${formidlerNavn}, tlf: ${formidlerTelefon}.\nKontakt ved levering: ${formaterNavn(annen.navn)}, tlf: ${annen.telefon}`
        : formidlerNavn
    default:
      return formidlerNavn
  }
}
