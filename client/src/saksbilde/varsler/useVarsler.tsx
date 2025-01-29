import { Utleveringsmåte } from '../../types/BehovsmeldingTypes'
import { Varsel, VarselFor } from '../../types/types.internal'
import { useBehovsmelding } from '../useBehovsmelding'

interface VarslerDataResponse {
  harAnnenLeveringsadresse: boolean
  harBeskjedTilKommune: boolean
  harAnnenKontaktperson: boolean
  harVarsler: boolean
  varsler: Varsel[]
  isLoading: boolean
  isError: any
}

export function useSøknadsVarsler(): VarslerDataResponse {
  const { behovsmelding } = useBehovsmelding()

  const varslerFor: VarselFor[] = []
  const beskrivelser: string[] = []

  const harAnnenLeveringsadresse = behovsmelding?.levering.utleveringsmåte === Utleveringsmåte.ANNEN_BRUKSADRESSE
  const harBeskjedTilKommune = !!behovsmelding?.levering.utleveringMerknad
  const harAnnenKontaktperson = !!behovsmelding?.levering.annenKontaktperson

  if (harAnnenLeveringsadresse) {
    varslerFor.push(VarselFor.ANNEN_ADRESSE)
    beskrivelser.push('Det er levering til en annen adresse. Denne må registreres.')
  }

  if (harBeskjedTilKommune) {
    varslerFor.push(VarselFor.BESKJED_TIL_KOMMUNE)
    beskrivelser.push(
      'Det er en beskjed til kommunen. Du må sjekke at beskjeden ikke inneholder personopplysninger eller annen sensitiv informasjon, og legge den inn på SF i OeBS.'
    )
  }

  if (harAnnenKontaktperson) {
    varslerFor.push(VarselFor.ANNEN_KONTAKTPERSON)
    beskrivelser.push('Det er en annen kontaktperson enn hjelpemiddelformidler. Denne må registreres.')
  }

  const varsler = [{ tittel: 'Du må fullføre SF i OeBS. Følgende må gjøres:', varslerFor, beskrivelse: beskrivelser }]

  return {
    harAnnenLeveringsadresse,
    harBeskjedTilKommune,
    harAnnenKontaktperson,
    varsler,
    harVarsler: varsler.length > 0,
    isLoading: false,
    isError: undefined,
  }
}
