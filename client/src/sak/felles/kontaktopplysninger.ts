import { Kontaktperson, type Levering } from '../../types/BehovsmeldingTypes.ts'
import { formaterNavn } from '../../utils/formater.ts'

export function utledKontaktopplysninger(levering?: Levering): string {
  if (!levering) return ''
  const formidlerNavn = formaterNavn(levering.hjelpemiddelformidler?.navn)
  const formidlerTelefon = levering.hjelpemiddelformidler?.telefon
  const annenKontaktperson = levering.annenKontaktperson

  switch (levering.utleveringKontaktperson) {
    case Kontaktperson.HJELPEMIDDELBRUKER: {
      const kontaktTekst = annenKontaktperson?.telefon
        ? `Kontakt ved levering: Bruker, tlf: ${annenKontaktperson.telefon}`
        : 'Kontakt bruker ved levering.'
      return `Innsender: ${formidlerNavn}, tlf: ${formidlerTelefon}.\n${kontaktTekst}`
    }
    case Kontaktperson.HJELPEMIDDELFORMIDLER:
      return `Innsender: ${formidlerNavn}, tlf: ${formidlerTelefon}`
    case Kontaktperson.ANNEN_KONTAKTPERSON:
      return `Innsender: ${formidlerNavn}, tlf: ${formidlerTelefon}.\nKontakt ved levering: ${formaterNavn(annenKontaktperson?.navn)}, tlf: ${annenKontaktperson?.telefon}`
  }
  return ''
}
