export interface ArtikkellinjeSak {
  id: string
  hmsArtNr: string
  artikkelnavn: string
  antall: number
  finnesIOebs: boolean
  endretArtikkel?: EndretArtikkel
  type: 'HJELPEMIDDEL' | 'TILBEHØR'
}

export interface EndretArtikkel {
  id: string
  begrunnelse: EndretArtikkelBegrunnelse
  begrunnelseFritekst?: string
}

export enum EndretArtikkelBegrunnelse {
  LAGERVARE = 'LAGERVARE',
  ANNET = 'ANNET',
  ALTERNATIV_PRODUKT_LAGERVARE = 'ALTERNATIV_PRODUKT_LAGERVARE',
  ALTERNATIV_PRODUKT_ANNET = 'ALTERNATIV_PRODUKT_ANNET',
}

export const EndretArtikkelBegrunnelseLabel: Record<EndretArtikkelBegrunnelse, string> = {
  ALTERNATIV_PRODUKT_ANNET: 'Annet',
  ALTERNATIV_PRODUKT_LAGERVARE: 'Tilgjengelig på lager',
  ANNET: 'Annet',
  LAGERVARE: 'Tilgjengelig på lager',
}
