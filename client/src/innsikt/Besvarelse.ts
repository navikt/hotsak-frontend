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
