import { sak_overført_gosys_v1 } from './sak_overført_gosys_v1'
import { barnebrillesak_overført_gosys_v1 } from './barnebrillesak_overført_gosys_v1'

export type Spørsmålstype = 'enkeltvalg' | 'flervalg' | 'fritekst' | 'oppfølgingsspørsmål'

export interface ISpørsmål {
  type: Spørsmålstype
  tekst: string
  beskrivelse?: string
  påkrevd?: boolean
}

export interface IAlternativer {
  alternativer: ReadonlyArray<string | IOppfølgingsspørsmål>
}

export interface IEnkeltvalg extends ISpørsmål, IAlternativer {
  type: 'enkeltvalg'
}

export interface IFlervalg extends ISpørsmål, IAlternativer {
  type: 'flervalg'
}

export interface IFritekst extends ISpørsmål {
  type: 'fritekst'
}

export interface IHarSpørsmål {
  spørsmål: ReadonlyArray<IEnkeltvalg | IFlervalg | IFritekst>
}

export interface IOppfølgingsspørsmål extends ISpørsmål, IHarSpørsmål {
  type: 'oppfølgingsspørsmål'
}

export interface ISpørreundersøkelse extends IHarSpørsmål {
  skjema: string
  tittel: string
  beskrivelse?: { header: string; body: string }
}

export const spørreundersøkelser = {
  sak_overført_gosys_v1,
  barnebrillesak_overført_gosys_v1,
}

export type SpørreundersøkelseId = keyof typeof spørreundersøkelser

function spørreundersøkelseToArray(harSpørsmål: IHarSpørsmål): ISpørsmål[] {
  return harSpørsmål.spørsmål.flatMap((spørsmål) => {
    if ((spørsmål as IAlternativer).alternativer) {
      const oppfølgingsspørsmål = (spørsmål as IAlternativer).alternativer
        .filter((alternativ): alternativ is IOppfølgingsspørsmål => typeof alternativ !== 'string')
        .flatMap((alternativ) => spørreundersøkelseToArray(alternativ))
      return [spørsmål, ...oppfølgingsspørsmål]
    } else {
      return [spørsmål]
    }
  })
}

export function finnSpørsmål(harSpørsmål: IHarSpørsmål, tekst: string): ISpørsmål | undefined {
  const spørsmål = spørreundersøkelseToArray(harSpørsmål)
  return spørsmål.find((spørsmål) => spørsmål.tekst === tekst)
}
