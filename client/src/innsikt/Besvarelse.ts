import { finnSpørsmål, IHierarkiskSpørsmål, ISpørreundersøkelse, Spørsmålstype } from './spørreundersøkelser'

export interface ISvarUtenOppfølgingsspørsmål {
  svar: string | string[]
}

export interface ISvarMedOppfølgingsspørsmål extends ISvarUtenOppfølgingsspørsmål {
  oppfølgingsspørsmål: IBesvarelse
}

export type Svar = ISvarUtenOppfølgingsspørsmål | ISvarMedOppfølgingsspørsmål

export interface IBesvarelse {
  [spørsmål: string]: Svar
}

export interface ISvar {
  type: Spørsmålstype | ''
  spørsmål: string
  sti: string[]
  svar: string
}

export interface Tilbakemelding<T = any> {
  skjema: string
  svar: ISvar[]
  data?: T
}

export function joinToName(...segments: Array<string | undefined>): string {
  return segments.filter((segment) => !!segment).join('.')
}

export function sanitizeName(segment: string): string {
  return segment.replaceAll('.', '_')
}

export function desanitizeName(segment: string): string {
  return segment.replaceAll('_', '.')
}

export function besvarelseToSvar(spørreundersøkelse: ISpørreundersøkelse, besvarelse: IBesvarelse): ISvar[] {
  return Object.entries(besvarelse).flatMap<ISvar>(([spørsmål, svar]) => {
    const hierarkiskSpørsmål = finnSpørsmål(spørreundersøkelse, spørsmål)
    if (!hierarkiskSpørsmål) {
      return []
    } else if ((svar as ISvarMedOppfølgingsspørsmål).oppfølgingsspørsmål) {
      return [
        ...lagSvar(hierarkiskSpørsmål, svar),
        ...besvarelseToSvar(spørreundersøkelse, (svar as ISvarMedOppfølgingsspørsmål).oppfølgingsspørsmål),
      ]
    } else {
      return lagSvar(hierarkiskSpørsmål, svar)
    }
  })
}

function lagSvar(spørsmål: IHierarkiskSpørsmål, svar: Svar): ISvar[] {
  return (Array.isArray(svar.svar) ? svar.svar : [svar.svar]).map((svar) => ({
    type: spørsmål.type,
    spørsmål: spørsmål.tekst,
    sti: spørsmål.sti,
    svar,
  }))
}
