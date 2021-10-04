import { Tekst } from '../../felleskomponenter/typografi'
import { KontaktPerson, KontaktPersonType, Formidler } from '../../types/types.internal'

interface KontaktpersonProps {
  kontaktperson?: KontaktPerson
  formidler: Formidler
}

export const Kontaktperson: React.FC<KontaktpersonProps> = ({ kontaktperson, formidler }) => {
  if (!kontaktperson) return null
  const { navn, telefon, kontaktpersonType } = kontaktperson

  let kontaktpersonTekst = ''
  switch (kontaktpersonType) {
    case KontaktPersonType.HJELPEMIDDELBRUKER:
      kontaktpersonTekst = 'Hjelpemiddelbruker'
      break
    case KontaktPersonType.HJELPEMIDDELFORMIDLER:
      kontaktpersonTekst = `Formidler (${formidler.navn})`
      break
    case KontaktPersonType.ANNEN_BRUKER:
      kontaktpersonTekst = `${navn}. Telefon: ${telefon}`
      break
  }

  return <Tekst>{kontaktpersonTekst}</Tekst>
}
