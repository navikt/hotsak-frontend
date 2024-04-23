import { sak_overført_gosys_v1 } from './sak_overført_gosys_v1'
import { barnebrillesak_overført_gosys_v1 } from './barnebrillesak_overført_gosys_v1'

export interface ISpørsmål {
  type: 'enkeltvalg' | 'flervalg' | 'fritekst' | 'oppfølgingsspørsmål'
  tekst: string
  beskrivelse?: string
  påkrevd?: boolean
}

export interface IEnkeltvalg extends ISpørsmål {
  type: 'enkeltvalg'
  svar: ReadonlyArray<string | IOppfølgingsspørsmål>
}

export interface IFlervalg extends ISpørsmål {
  type: 'flervalg'
  svar: ReadonlyArray<string | IOppfølgingsspørsmål>
}

export interface IFritekst extends ISpørsmål {
  type: 'fritekst'
}

export interface IOppfølgingsspørsmål extends ISpørsmål {
  type: 'oppfølgingsspørsmål'
  spørsmål: ReadonlyArray<IEnkeltvalg | IFlervalg | IFritekst>
}

export interface ISpørreundersøkelse {
  skjema: string
  tittel: string
  beskrivelse?: { header: string; body: string }
  spørsmål: ReadonlyArray<IEnkeltvalg | IFlervalg | IFritekst>
}

export const spørreundersøkelser = {
  sak_overført_gosys_v1,
  barnebrillesak_overført_gosys_v1,
}

export type SpørreundersøkelseId = keyof typeof spørreundersøkelser
