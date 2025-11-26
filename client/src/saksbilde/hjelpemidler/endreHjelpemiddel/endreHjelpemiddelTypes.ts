import { type EndretArtikkel, type EndretArtikkelBegrunnelse } from '../../../sak/sakTypes.ts'

export interface EndreArtikkelData {
  endretProdukt: string
  produktMangler: boolean
  endreBegrunnelse: EndretArtikkelBegrunnelse | ''
  endreBegrunnelseFritekst: string | ''
}

export enum EndreHjelpemiddelType {
  ENDRE_HMS_NUMMER = 'ENDRE_HMS_NUMMER',
  ALTERNATIVT_PRODUKT = 'ALTERNATIVT_PRODUKT',
}

export interface EndreHjelpemiddelRequest extends EndretArtikkel {
  hmsArtNr: string
  artikkelnavn?: string
}

export interface EndretProdukt {
  id: string
  hmsArtNr: string
  navn: string
}
