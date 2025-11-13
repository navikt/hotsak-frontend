export interface EndretProdukt {
  hjelpemiddelId: string
  hmsArtNr: string
  navn: string
}

// TODO bedre navn på denne
export interface HjelpemiddelEndring {
  id: string
  hmsArtNr: string
  artikkelnavn: string
  antall: number
  endretHjelpemiddel?: EndretHjelpemiddel
  finnesIOebs: boolean
}

export interface EndretHjelpemiddel {
  hjelpemiddelId: string
  begrunnelse: EndretHjelpemiddelBegrunnelse
  begrunnelseFritekst?: string
  artikkelnavn?: string
}

export enum EndretHjelpemiddelBegrunnelse {
  LAGERVARE = 'LAGERVARE',
  ANNET = 'ANNET',
  ALTERNATIV_PRODUKT_LAGERVARE = 'ALTERNATIV_PRODUKT_LAGERVARE',
  ALTERNATIV_PRODUKT_ANNET = 'ALTERNATIV_PRODUKT_ANNET',
}

export const EndretHjelpemiddelBegrunnelseLabel = new Map<string, string>([
  [EndretHjelpemiddelBegrunnelse.LAGERVARE, 'Tilgjengelig på lager'],
  [EndretHjelpemiddelBegrunnelse.ANNET, 'Annet'],
  [EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_LAGERVARE, 'Tilgjengelig på lager'],
  [EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET, 'Annet'],
])
