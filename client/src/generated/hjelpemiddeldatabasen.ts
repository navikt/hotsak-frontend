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
  /** class java.time.LocalDate */
  LocalDate: any
  /** class java.time.LocalDateTime */
  LocalDateTime: string
}

export interface HMDBBestillingsordning {
  __typename?: 'Bestillingsordning'
  erIBestillingsordning: Scalars['Boolean']
  hmsnr: Scalars['String']
}

export interface HMDBGodkjenningskursDto {
  __typename?: 'GodkjenningskursDTO'
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
  leverandorId?: Maybe<Scalars['String']>
  paakrevdGodkjenningskurs?: Maybe<HMDBGodkjenningskursDto>
  produktId: Scalars['String']
  produktUrl: Scalars['String']
  produktbeskrivelse: Scalars['String']
  produktnavn: Scalars['String']
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

export interface HMDBProduktfilterInput {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export interface HMDBQuery {
  __typename?: 'Query'
  /** Sjekk om et tilbehør er prisforhandlet */
  erPrisforhandletTilbehoer: Scalars['Boolean']
  /** Hent produkter */
  hentAlleProdukter: HMDBProduktPage
  /** Sjekk om et produkt/tilbehør er på bestillingsordning */
  hentErIBestillingsOrdning: Array<HMDBBestillingsordning>
  /** Hent produkter med hmsnr */
  hentProdukterMedHmsnr: Array<HMDBProdukt>
  /** Hent produkter med hmsnrs */
  hentProdukterMedHmsnrs: Array<HMDBProdukt>
  /** Hent produkter som er tilgjengelige for digital søknad */
  sortiment: Array<HMDBProdukt>
}

export interface HMDBQueryErPrisforhandletTilbehoerArgs {
  hmsnr: Scalars['String']
  leverandorId: Scalars['String']
  rammeavtaleId: Scalars['String']
}

export interface HMDBQueryHentAlleProdukterArgs {
  filter: HMDBProduktfilterInput
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
    avtaleposttittel?: string | null | undefined
    avtalepostnr?: string | null | undefined
  }>
}
