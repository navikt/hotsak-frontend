import { BehovsmeldingType, LeveringTilleggsinfo, Utleveringsmåte } from '../../types/BehovsmeldingTypes'
import { Varsel } from '../../types/types.internal'
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

  const beskrivelser: string[] = []

  const erSøknad = behovsmelding?.type === BehovsmeldingType.SØKNAD
  const harAnnenLeveringsadresse =
    erSøknad && behovsmelding?.levering.utleveringsmåte === Utleveringsmåte.ANNEN_BRUKSADRESSE
  const harBeskjedTilKommune = erSøknad && !!behovsmelding?.levering.utleveringMerknad
  const harAnnenKontaktperson = erSøknad && !!behovsmelding?.levering.annenKontaktperson

  const skalHentesPåHjelpemiddelsentralen =
    erSøknad && behovsmelding?.levering.utleveringsmåte === Utleveringsmåte.HJELPEMIDDELSENTRALEN

  const harAlleredeUtleveteHjelpemidler =
    erSøknad &&
    behovsmelding?.hjelpemidler.hjelpemidler.some(
      (hjelpemiddel) => hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen
    )

  const alleHjelpemidlerErUtlevert =
    erSøknad &&
    behovsmelding.levering.automatiskUtledetTilleggsinfo.includes(LeveringTilleggsinfo.ALLE_HJELPEMIDLER_ER_UTLEVERT)

  if (harAnnenLeveringsadresse) {
    beskrivelser.push('Det er levering til en annen adresse. Denne må registreres.')
  }

  if (skalHentesPåHjelpemiddelsentralen) {
    beskrivelser.push(
      'Det er valgt at hjelpemidlene skal hentes på hjelpemiddelsentralen. Gjør nødvendige endringer knyttet til utlevering i OeBS.'
    )
  }

  if (harAnnenKontaktperson) {
    beskrivelser.push('Det er en annen kontaktperson enn hjelpemiddelformidler. Denne må registreres.')
  }

  if (harBeskjedTilKommune) {
    beskrivelser.push(
      'Det er en beskjed til kommunen. Du må sjekke at beskjeden ikke inneholder personopplysninger eller annen sensitiv informasjon, og legge den inn på SF i OeBS.'
    )
  }

  if (harAlleredeUtleveteHjelpemidler) {
    if (alleHjelpemidlerErUtlevert) {
      beskrivelser.push(
        'Alle hjelpemidler i saken er allerede utlevert. Gjør nødvendige endringer knyttet til utlevering i OeBS.'
      )
    } else {
      beskrivelser.push(
        'Minst ett hjelpemiddel i saken er allerede utlevert. Gjør nødvendige endringer knyttet til utlevering i OeBS.'
      )
    }
  }

  const varsler = [{ tittel: 'Du må fullføre SF i OeBS. Følgende må gjøres:', beskrivelse: beskrivelser }]

  return {
    harAnnenLeveringsadresse,
    harBeskjedTilKommune,
    harAnnenKontaktperson,
    varsler,
    harVarsler: erSøknad && beskrivelser.length > 0,
    isLoading: false,
    isError: undefined,
  }
}
