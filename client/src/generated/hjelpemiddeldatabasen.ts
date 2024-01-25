export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  LocalDate: any
  LocalDateTime: string
}

export interface HMDBAvtalepost {
  __typename?: 'Avtalepost'
  beskrivelse: Scalars['String']
  id: Scalars['String']
  navn: Scalars['String']
  nummer: Scalars['String']
}

export interface HMDBBestillingsordning {
  __typename?: 'Bestillingsordning'
  erIBestillingsordning: Scalars['Boolean']
  hmsnr: Scalars['String']
}

export interface HMDBGodkjenningskurs {
  __typename?: 'Godkjenningskurs'
  isokode: Scalars['String']
  kursId: Scalars['Int']
  tittel: Scalars['String']
}

export interface HMDBKategori {
  __typename?: 'Kategori'
  navn: Scalars['String']
  produkter: Array<HMDBProdukt>
}

export interface HMDBLeverandor {
  __typename?: 'Leverandor'
  adresse?: Maybe<Scalars['String']>
  epost?: Maybe<Scalars['String']>
  generertAv: Scalars['String']
  generertDato: Scalars['LocalDateTime']
  id: Scalars['ID']
  landkode?: Maybe<Scalars['String']>
  leverandorId: Scalars['String']
  leverandornavn?: Maybe<Scalars['String']>
  postnummer?: Maybe<Scalars['String']>
  poststed?: Maybe<Scalars['String']>
  telefon?: Maybe<Scalars['String']>
  www?: Maybe<Scalars['String']>
}

export interface HMDBPaakrevdGodkjenningskursDto {
  __typename?: 'PaakrevdGodkjenningskursDTO'
  isokode: Scalars['String']
  kursId: Scalars['Int']
  tittel: Scalars['String']
}

/** Kombinasjon av produkt/produktserie, artikkel og hjelpemiddel */
export interface HMDBProdukt {
  __typename?: 'Produkt'
  artikkelId: Scalars['String']
  artikkelUrl: Scalars['String']
  artikkelbeskrivelse?: Maybe<Scalars['String']>
  artikkelnavn: Scalars['String']
  artikkelnr?: Maybe<Scalars['String']>
  avtalepostId?: Maybe<Scalars['String']>
  avtalepostbeskrivelse?: Maybe<Scalars['String']>
  avtalepostnr?: Maybe<Scalars['String']>
  avtalepostrangering?: Maybe<Scalars['Int']>
  avtaleposttittel?: Maybe<Scalars['String']>
  blobType?: Maybe<Scalars['String']>
  blobUrlLite?: Maybe<Scalars['String']>
  blobUrlStort?: Maybe<Scalars['String']>
  blobUse?: Maybe<Scalars['String']>
  erIBestillingsordning: Scalars['Boolean']
  generertAv: Scalars['String']
  generertDato: Scalars['LocalDateTime']
  harNavAvtale: Scalars['Boolean']
  hmsnr?: Maybe<Scalars['String']>
  id: Scalars['ID']
  isokode: Scalars['String']
  isokortnavn?: Maybe<Scalars['String']>
  isotekst: Scalars['String']
  isotittel: Scalars['String']
  kategori?: Maybe<Scalars['String']>
  leverandor?: Maybe<HMDBLeverandor>
  leverandorId?: Maybe<Scalars['String']>
  /** @deprecated Bruk pakrevdGodkjenningskurs, replace with pakrevdGodkjenningskurs */
  paakrevdGodkjenningskurs?: Maybe<HMDBPaakrevdGodkjenningskursDto>
  pakrevdGodkjenningskurs?: Maybe<HMDBGodkjenningskurs>
  produktId: Scalars['String']
  produktUrl: Scalars['String']
  produktbeskrivelse: Scalars['String']
  produktnavn: Scalars['String']
  produkttype?: Maybe<HMDBProdukttype>
  rammeavtaleId?: Maybe<Scalars['String']>
  rammeavtaleSlutt?: Maybe<Scalars['LocalDate']>
  rammeavtaleStart?: Maybe<Scalars['LocalDate']>
  tekniskeData: Array<HMDBTekniskeDataTriple>
  tekniskeDataSomTekst: Scalars['String']
  tilgjengeligForDigitalSoknad: Scalars['Boolean']
}

export interface HMDBProduktPage {
  __typename?: 'ProduktPage'
  hasMore: Scalars['Boolean']
  items: Array<HMDBProdukt>
  numberOfItems: Scalars['Int']
}

export interface HMDBProdukterFilterInput {
  artikkelId?: InputMaybe<Array<Scalars['String']>>
  avtalepostId?: InputMaybe<Array<Scalars['String']>>
  erIBestillingsordning?: InputMaybe<Scalars['Boolean']>
  hmsnr?: InputMaybe<Array<Scalars['String']>>
  isokode?: InputMaybe<Array<Scalars['String']>>
  kategori?: InputMaybe<Array<Scalars['String']>>
  produktId?: InputMaybe<Array<Scalars['String']>>
  tilgjengeligForDigitalSoknad?: InputMaybe<Scalars['Boolean']>
}

export interface HMDBProdukterPaginertFilterInput {
  filter?: InputMaybe<HMDBProdukterFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export interface HMDBProduktfilterInput {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export enum HMDBProdukttype {
  Del = 'Del',
  Hovedprodukt = 'Hovedprodukt',
  Tilbehoer = 'Tilbehoer',
}

export interface HMDBQuery {
  __typename?: 'Query'
  avtaleposter: Array<HMDBAvtalepost>
  /**
   * Sjekk om et tilbehør er prisforhandlet
   * @deprecated Bruk prisforhandletTilbehor
   */
  erPrisforhandletTilbehoer: Scalars['Boolean']
  /**
   * Hent alle produkter
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  hentAlleProdukter: HMDBProduktPage
  /**
   * Sjekk om et produkt/tilbehør er på bestillingsordning
   * @deprecated Bruk produkter med erIBestillingsordning = true
   */
  hentErIBestillingsOrdning: Array<HMDBBestillingsordning>
  /**
   * Hent produkter med hmsnr
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  hentProdukterMedHmsnr: Array<HMDBProdukt>
  /**
   * Hent produkter med hmsnrs
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  hentProdukterMedHmsnrs: Array<HMDBProdukt>
  kategorier: Array<HMDBKategori>
  /** Finn produkter */
  produkter: Array<HMDBProdukt>
  /** Finn produkter (paginert) */
  produkterPaginert: HMDBProduktPage
  /**
   * Hent produkter som er tilgjengelige for digital søknad
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  sortiment: Array<HMDBProdukt>
  tilbehor: Array<HMDBTilbehor>
}

export interface HMDBQueryErPrisforhandletTilbehoerArgs {
  hmsnr: Scalars['String']
  leverandorId: Scalars['String']
  rammeavtaleId: Scalars['String']
}

export interface HMDBQueryHentAlleProdukterArgs {
  filter?: InputMaybe<HMDBProduktfilterInput>
}

export interface HMDBQueryHentErIBestillingsOrdningArgs {
  hmsnrs: Array<Scalars['String']>
}

export interface HMDBQueryHentProdukterMedHmsnrArgs {
  hmsnr: Scalars['String']
}

export interface HMDBQueryHentProdukterMedHmsnrsArgs {
  hmsnrs: Array<Scalars['String']>
}

export interface HMDBQueryKategorierArgs {
  navn?: InputMaybe<Array<Scalars['String']>>
}

export interface HMDBQueryProdukterArgs {
  filter?: InputMaybe<HMDBProdukterFilterInput>
}

export interface HMDBQueryProdukterPaginertArgs {
  filter?: InputMaybe<HMDBProdukterPaginertFilterInput>
}

export interface HMDBQueryTilbehorArgs {
  filter?: InputMaybe<HMDBTilbehorFilterInput>
}

/** Teknisk datum med ledetekst, verdi og evt. enhet */
export interface HMDBTekniskeDataTriple {
  __typename?: 'TekniskeDataTriple'
  enhet?: Maybe<Scalars['String']>
  tekst?: Maybe<Scalars['String']>
  verdi?: Maybe<Scalars['String']>
  visningstekst: Scalars['String']
}

/** Teknisk datum med ledetekst, verdi og evt. enhet */
export interface HMDBTekniskeDataTripleVisningstekstArgs {
  separator?: InputMaybe<Scalars['String']>
}

export interface HMDBTilbehor {
  __typename?: 'Tilbehor'
  hmsnr?: Maybe<Scalars['String']>
  leverandorId?: Maybe<Scalars['String']>
  rammeavtaleId?: Maybe<Scalars['String']>
}

export interface HMDBTilbehorFilterInput {
  hmsnr?: InputMaybe<Array<Scalars['String']>>
  leverandorId?: InputMaybe<Array<Scalars['String']>>
  rammeavtaleId?: InputMaybe<Array<Scalars['String']>>
}

export type HMDBHentProduktQueryVariables = Exact<{
  hmsnr: Scalars['String']
}>

export type HMDBHentProduktQuery = {
  __typename?: 'Query'
  produkter: Array<{
    __typename?: 'Produkt'
    artikkelUrl: string
    produktUrl: string
    produktnavn: string
    isotittel: string
    isokode: string
    avtaleposttittel?: string | null
    avtalepostnr?: string | null
    artikkelnavn: string
  }>
}
