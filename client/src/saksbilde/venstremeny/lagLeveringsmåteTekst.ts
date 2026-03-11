import { formaterAdresse } from '../../utils/formater.ts'
import { type Levering, Utleveringsmåte } from '../../types/BehovsmeldingTypes.ts'
import type { Bydel, Kommune } from '../../types/types.internal.ts'

export interface LeveringsmåteTekst {
  label: string
  copyText?: string
  kommune?: Kommune
  bydel?: Bydel
}

export function lagLeveringsmåteTekst(
  { utleveringsmåte, annenUtleveringsadresse, annenUtleveringskommune, annenUtleveringsbydel }: Levering,
  adresseBruker: string
): LeveringsmåteTekst {
  const annenAdresse = formaterAdresse(annenUtleveringsadresse)
  switch (utleveringsmåte) {
    case Utleveringsmåte.ANNEN_BRUKSADRESSE:
      return {
        label: `Til annen adresse`,
        copyText: annenAdresse,
        kommune: annenUtleveringskommune,
        bydel: annenUtleveringsbydel,
      }
    case Utleveringsmåte.FOLKEREGISTRERT_ADRESSE:
      return { label: `Til folkeregistert adresse`, copyText: adresseBruker }
    case Utleveringsmåte.HJELPEMIDDELSENTRALEN:
      return { label: 'Hentes på hjelpemiddelsentralen' }
    default:
      return { label: 'Ukjent leveringsmåte' }
  }
}
