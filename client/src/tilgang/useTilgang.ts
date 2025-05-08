import { useContext } from 'react'

import { TilgangContext, TilgangContextType } from './TilgangContext.ts'
import { AnsattGruppe, InnloggetAnsatt } from './Ansatt.ts'
import { Enhet } from './Enhet.ts'

export function useTilgangContext(): TilgangContextType {
  return useContext(TilgangContext)
}

export interface ExtendedInnloggetAnsatt extends InnloggetAnsatt {
  medlemAvGruppe(gruppe: AnsattGruppe): boolean
  tilhørerEnhet(enhetsnummer: string): boolean
}

export function useInnloggetAnsatt(): ExtendedInnloggetAnsatt {
  const innloggetAnsatt = useTilgangContext().innloggetAnsatt
  return {
    ...innloggetAnsatt,
    medlemAvGruppe(gruppe) {
      return innloggetAnsatt.grupper.includes(gruppe)
    },
    tilhørerEnhet(enhetsnummer) {
      return innloggetAnsatt.enhetsnumre.includes(enhetsnummer)
    },
  }
}

const piloter = {
  saksnotat: [Enhet.NAV_HJELPEMIDDELSENTRAL_MØRE_OG_ROMSDAL, Enhet.NAV_HJELPEMIDDELSENTRAL_TRØNDELAG],
  kunTilbehør: [Enhet.NAV_HJELPEMIDDELSENTRAL_ROGALAND],
}

export function useVisOppgavelisteTabs(): boolean {
  const { grupper, tilhørerEnhet } = useInnloggetAnsatt()
  return (
    window.appSettings.MILJO !== 'prod-gcp' ||
    grupper.includes(AnsattGruppe.TEAMDIGIHOT) ||
    grupper.includes(AnsattGruppe.BRILLEADMIN_BRUKERE) ||
    tilhørerEnhet(Enhet.NAV_VIKAFOSSEN)
  )
}

export function useErNotatPilot(): boolean {
  const { enhetsnumre, medlemAvGruppe } = useInnloggetAnsatt()
  const erSaksbehandlerBarnebriller = medlemAvGruppe(AnsattGruppe.BRILLEADMIN_BRUKERE)
  return (
    window.appSettings.MILJO !== 'prod-gcp' ||
    piloter.saksnotat.some((it) => enhetsnumre.includes(it)) ||
    erSaksbehandlerBarnebriller
  )
}

export function useErKunTilbehørPilot(): boolean {
  const { enhetsnumre } = useInnloggetAnsatt()
  return window.appSettings.MILJO !== 'prod-gcp' || piloter.kunTilbehør.some((it) => enhetsnumre.includes(it))
}
