import { Tekst } from '../../felleskomponenter/typografi'
import { Levering, Utleveringsmåte } from '../../types/BehovsmeldingTypes'
import { formaterAdresse } from '../../utils/formater'

export interface LeveringsmåteProps {
  levering: Levering
  adresseBruker: string
}

export function Leveringsmåte({ levering, adresseBruker }: LeveringsmåteProps) {
  const leveringsmåteTekst = lagLeveringsmåteTekst(levering, adresseBruker)
  return <Tekst>{leveringsmåteTekst}</Tekst>
}

function lagLeveringsmåteTekst({ utleveringsmåte, annenUtleveringsadresse }: Levering, adresseBruker: string): string {
  switch (utleveringsmåte) {
    case Utleveringsmåte.ALLEREDE_UTLEVERT_AV_NAV:
      return 'Allerede levert'
    case Utleveringsmåte.ANNEN_BRUKSADRESSE:
      return `${formaterAdresse(annenUtleveringsadresse)} (Annen adresse)`
    case Utleveringsmåte.FOLKEREGISTRERT_ADRESSE:
      return `${adresseBruker} (Folkeregistert adresse)`
    case Utleveringsmåte.HJELPEMIDDELSENTRALEN:
      return 'Hentes på hjelpemiddelsentralen'
    case undefined:
      return 'Ukjent leveringsmåte'
  }
}
