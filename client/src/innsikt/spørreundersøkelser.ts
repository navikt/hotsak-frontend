import { barnebrillesak_overført_gosys_v1 } from './barnebrillesak_overført_gosys_v1'
import { desanitizeName } from './Besvarelse'
import { informasjon_om_hjelpemiddel_v1 } from './informasjon_om_hjelpemiddel_v1'
import { kontaktet_formidler_v1 } from './kontaktet_formidler_v1.ts'
import { sak_overført_gosys_v1 } from './sak_overført_gosys_v1'

export type Spørsmålstype = 'enkeltvalg' | 'flervalg' | 'fritekst' | 'oppfølgingsspørsmål'

export interface ISpørsmål {
  type: Spørsmålstype
  tekst: string
  beskrivelse?: string
  påkrevd?: boolean | string
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
  maksLengde?: number
}

export interface ISpørsmålsliste {
  spørsmål: ReadonlyArray<IEnkeltvalg | IFlervalg | IFritekst>
}

export interface IOppfølgingsspørsmål extends ISpørsmål, ISpørsmålsliste {
  type: 'oppfølgingsspørsmål'
}

export interface ISpørreundersøkelse extends ISpørsmålsliste {
  skjema: string
  tittel: string
  beskrivelse?: { header: string; body: string; helpText?: string }
}

export const spørreundersøkelser = {
  barnebrillesak_overført_gosys_v1,
  informasjon_om_hjelpemiddel_v1,
  kontaktet_formidler_v1,
  sak_overført_gosys_v1,
}

export type SpørreundersøkelseId = keyof typeof spørreundersøkelser

export function isOppfølgingsspørsmål(value: string | IOppfølgingsspørsmål): value is IOppfølgingsspørsmål {
  return value != null && (value as IOppfølgingsspørsmål).type === 'oppfølgingsspørsmål'
}

export interface IHierarkiskSpørsmål extends ISpørsmål {
  sti: string[]
}

function flat(spørsmålsliste: ISpørsmålsliste, sti: string[] = []): IHierarkiskSpørsmål[] {
  return spørsmålsliste.spørsmål.flatMap((spørsmål) => {
    const hierarkiskSpørsmål = { ...spørsmål, sti }
    if ((hierarkiskSpørsmål as IAlternativer).alternativer) {
      const oppfølgingsspørsmål = (hierarkiskSpørsmål as IAlternativer).alternativer
        .filter(isOppfølgingsspørsmål)
        .flatMap((alternativ) => flat(alternativ, [...sti, hierarkiskSpørsmål.tekst]))
      return [hierarkiskSpørsmål, ...oppfølgingsspørsmål]
    } else {
      return [hierarkiskSpørsmål]
    }
  })
}

export function finnSpørsmål(spørsmålsliste: ISpørsmålsliste, tekst: string): IHierarkiskSpørsmål | undefined {
  return flat(spørsmålsliste).find((spørsmål) => spørsmål.tekst === desanitizeName(tekst))
}
