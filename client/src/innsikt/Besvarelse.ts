import { finnSpørsmål, ISpørreundersøkelse, Spørsmålstype } from './spørreundersøkelser'

export interface ISvarUtenOppfølgingsspørsmål {
  svar: string | string[]
}

export interface ISvarMedOppfølgingsspørsmål extends ISvarUtenOppfølgingsspørsmål {
  oppfølgingsspørsmål: IBesvarelse
}

export type Svar = ISvarUtenOppfølgingsspørsmål | ISvarMedOppfølgingsspørsmål

export interface IBesvarelse extends Record<string, Svar> {}

export function join(...segments: Array<string | undefined>): string {
  return segments.filter((segment) => !!segment).join('.')
}

export function sanitize(segment: string): string {
  return segment.replaceAll('.', '_')
}

export function desanitize(segment: string): string {
  return segment.replaceAll('_', '.')
}

export interface ISvar {
  type: Spørsmålstype | ''
  nivå: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  spørsmål: string
  svar?: string
}

function svarToArray(type: ISvar['type'], nivå: ISvar['nivå'], spørsmål: string, svar: Svar): ISvar[] {
  return (Array.isArray(svar.svar) ? svar.svar : [svar.svar]).map((svar) => ({
    type,
    nivå,
    spørsmål,
    svar,
  }))
}

export function besvarelseToArray(
  spørreundersøkelse: ISpørreundersøkelse,
  besvarelse: IBesvarelse,
  nivå: ISvar['nivå'] = 0
): ISvar[] {
  const svar = Object.entries(besvarelse)
  return svar.flatMap(([name, svar]) => {
    const spørsmål = desanitize(name)
    const type = finnSpørsmål(spørreundersøkelse, spørsmål)?.type || ''
    if ((svar as ISvarMedOppfølgingsspørsmål).oppfølgingsspørsmål) {
      return [
        ...svarToArray(type, nivå, spørsmål, svar),
        ...besvarelseToArray(
          spørreundersøkelse,
          (svar as ISvarMedOppfølgingsspørsmål).oppfølgingsspørsmål,
          (nivå + 1) as ISvar['nivå']
        ),
      ]
    } else {
      return svarToArray(type, nivå, spørsmål, svar)
    }
  })
}
