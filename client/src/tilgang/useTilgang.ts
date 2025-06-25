import { useContext } from 'react'

import { TilgangContext, TilgangContextType } from './TilgangContext.ts'
import { AnsattGruppe, InnloggetAnsatt } from './Ansatt.ts'
import { Enhet, EnhetsnummerType } from './Enhet.ts'

export function useTilgangContext(): TilgangContextType {
  return useContext(TilgangContext)
}

export interface ExtendedInnloggetAnsatt extends InnloggetAnsatt {
  /**
   * Undersøk om innlogget ansatt er medlem av en av de spesifiserte gruppene.
   */
  erMedlemAvEnAvGrupper(...grupper: AnsattGruppe[]): boolean

  /**
   * Undersøk om innlogget ansatt tilhører en av de spesifiserte enhetene.
   */
  tilhørerEnAvEnheter(...enhetsnumre: EnhetsnummerType[]): boolean

  /**
   * Undersøk om gjeldende enhet er en av de spesifiserte enhetene.
   *
   * @param enhetsnumre
   */
  erGjeldendeEnhetEnAv(...enhetsnumre: EnhetsnummerType[]): boolean
}

export function useInnloggetAnsatt(): ExtendedInnloggetAnsatt {
  const innloggetAnsatt = useTilgangContext().innloggetAnsatt

  const medlemAvGruppe = (gruppe: AnsattGruppe): boolean => innloggetAnsatt.grupper.includes(gruppe)
  const tilhørerEnhet = (enhetsnummer: EnhetsnummerType): boolean => innloggetAnsatt.enhetsnumre.includes(enhetsnummer)

  return {
    ...innloggetAnsatt,
    erMedlemAvEnAvGrupper(...grupper) {
      return grupper.some(medlemAvGruppe)
    },
    tilhørerEnAvEnheter(...enhetsnumre) {
      return enhetsnumre.some(tilhørerEnhet)
    },
    erGjeldendeEnhetEnAv(...enhetsnumre): boolean {
      return enhetsnumre.some((enhetsnummer) => innloggetAnsatt.gjeldendeEnhet.nummer === enhetsnummer)
    },
  }
}

const piloter = {
  saksmeny: [
    Enhet.IT_AVDELINGEN,
    Enhet.NAV_HJELPEMIDDELSENTRAL_MØRE_OG_ROMSDAL,
    Enhet.NAV_HJELPEMIDDELSENTRAL_TRØNDELAG,
  ],
  kunTilbehør: [Enhet.IT_AVDELINGEN, Enhet.NAV_HJELPEMIDDELSENTRAL_ROGALAND],
  ombrukPilot: [
    Enhet.IT_AVDELINGEN,
    Enhet.NAV_HJELPEMIDDELSENTRAL_MØRE_OG_ROMSDAL,
    Enhet.NAV_HJELPEMIDDELSENTRAL_TRØNDELAG,
  ],
}

export function useVisOppgavelisteTabs(): boolean {
  const { erMedlemAvEnAvGrupper, erGjeldendeEnhetEnAv } = useInnloggetAnsatt()
  return (
    erGjeldendeEnhetEnAv(Enhet.IT_AVDELINGEN, Enhet.NAV_VIKAFOSSEN) ||
    erMedlemAvEnAvGrupper(AnsattGruppe.BRILLEADMIN_BRUKERE, AnsattGruppe.TEAMDIGIHOT)
  )
}

export function useErOmbrukPilot(): boolean {
  const { erGjeldendeEnhetEnAv } = useInnloggetAnsatt()
  return erGjeldendeEnhetEnAv(...piloter.ombrukPilot)
}

export function useErSaksmenyPilot(): boolean {
  const { erGjeldendeEnhetEnAv } = useInnloggetAnsatt()
  return erGjeldendeEnhetEnAv(...piloter.saksmeny)
}

export function useErKunTilbehørPilot(): boolean {
  const { erGjeldendeEnhetEnAv } = useInnloggetAnsatt()
  return erGjeldendeEnhetEnAv(...piloter.kunTilbehør)
}
