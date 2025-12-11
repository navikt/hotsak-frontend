import { BehovsmeldingType, Utleveringsmåte } from '../../types/BehovsmeldingTypes'
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

  // TODO:Varsel for brukes ikke lenger og kan kanskje fjernes??
  const varslerFor: VarselFor[] = []
  const beskrivelser: string[] = []

  const erSøknad = behovsmelding?.type === BehovsmeldingType.SØKNAD
  const harAnnenLeveringsadresse =
    erSøknad && behovsmelding?.levering.utleveringsmåte === Utleveringsmåte.ANNEN_BRUKSADRESSE
  const harBeskjedTilKommune = erSøknad && !!behovsmelding?.levering.utleveringMerknad
  const harAnnenKontaktperson = erSøknad && !!behovsmelding?.levering.annenKontaktperson
  const harAlleredeUtleveteHjelpemidler =
    erSøknad &&
    behovsmelding?.hjelpemidler.hjelpemidler.some(
      (hjelpemiddel) => hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen
    )

  if (harAnnenLeveringsadresse) {
    varslerFor.push(VarselFor.ANNEN_ADRESSE)
    beskrivelser.push('Det er levering til en annen adresse. Denne må registreres.')
  }

  if (harAnnenKontaktperson) {
    varslerFor.push(VarselFor.ANNEN_KONTAKTPERSON)
    beskrivelser.push('Det er en annen kontaktperson enn hjelpemiddelformidler. Denne må registreres.')
  }

  if (harBeskjedTilKommune) {
    varslerFor.push(VarselFor.BESKJED_TIL_KOMMUNE)
    beskrivelser.push(
      'Det er en beskjed til kommunen. Du må sjekke at beskjeden ikke inneholder personopplysninger eller annen sensitiv informasjon, og legge den inn på SF i OeBS.'
    )
  }

  if (harAlleredeUtleveteHjelpemidler) {
    varslerFor.push(VarselFor.ALLEREDE_UTLEVERT)
    beskrivelser.push(
      'Minst ett hjelpemiddel i saken er allerede utlevert. Gjør nødvendige endringer knyttet til utlevering i OeBS.'
    )
  }

  const varsler = [{ tittel: 'Du må fullføre SF i OeBS. Følgende må gjøres:', varslerFor, beskrivelse: beskrivelser }]

  return {
    harAnnenLeveringsadresse,
    harBeskjedTilKommune,
    harAnnenKontaktperson,
    varsler,
    harVarsler: erSøknad && varslerFor.length > 0,
    isLoading: false,
    isError: undefined,
  }
}
