import { useContext } from 'react'
import { TilgangContext } from '../tilgang/TilgangContext.ts'
import type { Adressebeskyttelse } from '../types/types.internal.ts'

export enum Gruppe {
  TEAMDIGIHOT = 'TEAMDIGIHOT',
  HOTSAK_BRUKERE = 'HOTSAK_BRUKERE',
  HOTSAK_NASJONAL = 'HOTSAK_NASJONAL',
  HOTSAK_SAKSBEHANDLER = 'HOTSAK_SAKSBEHANDLER',
  BRILLEADMIN_BRUKERE = 'BRILLEADMIN_BRUKERE',
}

const Enhet = {
  NAV_VIKAFOSSEN: '2103',
  NAV_HJELPEMIDDELSENTRAL_AGDER: '4710',
  NAV_HJELPEMIDDELSENTRAL_MØRE_OG_ROMSDAL: '4715',
  NAV_HJELPEMIDDELSENTRAL_TRØNDELAG: '4716',
  NAV_HJELPEMIDDELSENTRAL_ROGALAND: '4711',
  IT_AVDELINGEN: '2970',
}

const notatPilotEnheter = [Enhet.NAV_HJELPEMIDDELSENTRAL_MØRE_OG_ROMSDAL, Enhet.NAV_HJELPEMIDDELSENTRAL_TRØNDELAG]
const kunTilbehørPilotEnheter = [Enhet.NAV_HJELPEMIDDELSENTRAL_ROGALAND]

export type NavIdent = string

export interface InnloggetSaksbehandler {
  readonly id: NavIdent
  readonly navn: string
  readonly epost: string
  readonly grupper: Gruppe[]
  readonly enheter: Array<{
    id: string
    nummer: string
    navn: string
    gjeldende: boolean
  }>
  readonly gradering: Adressebeskyttelse[]
  readonly enhetsnumre: string[]
  readonly erInnlogget?: boolean
}

export function useInnloggetSaksbehandler(): InnloggetSaksbehandler {
  return useContext(TilgangContext).innloggetSaksbehandler
}

export function useSaksbehandlerTilhørerEnhet(...enhet: string[]): boolean {
  const { enhetsnumre } = useInnloggetSaksbehandler()
  return enhet.some((it) => enhetsnumre.includes(it))
}

export function useVisOppgavelisteTabs(): boolean {
  const { grupper, enhetsnumre } = useInnloggetSaksbehandler()
  return (
    window.appSettings.MILJO !== 'prod-gcp' ||
    grupper.includes(Gruppe.TEAMDIGIHOT) ||
    grupper.includes(Gruppe.BRILLEADMIN_BRUKERE) ||
    enhetsnumre.includes(Enhet.NAV_VIKAFOSSEN)
  )
}

export function useErNotatPilot(): boolean {
  const { enhetsnumre, grupper } = useInnloggetSaksbehandler()
  const erBarnebrilleSaksbehandler = grupper.includes(Gruppe.BRILLEADMIN_BRUKERE)
  return (
    window.appSettings.MILJO !== 'prod-gcp' ||
    notatPilotEnheter.some((it) => enhetsnumre.includes(it)) ||
    erBarnebrilleSaksbehandler
  )
}

export function useErKunTilbehørPilot(): boolean {
  const { enhetsnumre } = useInnloggetSaksbehandler()
  return window.appSettings.MILJO !== 'prod-gcp' || kunTilbehørPilotEnheter.some((it) => enhetsnumre.includes(it))
}
