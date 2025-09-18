import { EndretHjelpemiddel, EndretHjelpemiddelBegrunnelse } from '../../../types/types.internal'

export interface EndreArtikkelData {
  endretProdukt: string[]
  produktMangler: boolean
  endreBegrunnelse: EndretHjelpemiddelBegrunnelse | ''
  endreBegrunnelseFritekst: string | ''
}

export enum EndreHjelpemiddelType {
  ENDRE_HMS_NUMMER = 'ENDRE_HMS_NUMMER',
  ALTERNATIVT_PRODUKT = 'ALTERNATIVT_PRODUKT',
}

export interface EndretHjelpemiddelRequest extends EndretHjelpemiddel {
  hmsArtNr: string
}
