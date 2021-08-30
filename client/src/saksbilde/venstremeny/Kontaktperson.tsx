import { KontaktPerson, KontaktPersonType, Formidler} from "../../types/types.internal"
import { BodyShort } from '@navikt/ds-react'

interface KontaktpersonProps {
    kontaktperson?: KontaktPerson
    formidler: Formidler
  }

export const Kontaktperson: React.FC<KontaktpersonProps> = ({ kontaktperson, formidler }) => {
    if(!kontaktperson) return null
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
  
    return <BodyShort size="s">{kontaktpersonTekst}</BodyShort>
  }
  