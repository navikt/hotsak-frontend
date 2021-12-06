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

export interface HMDBProdukt {
  __typename?: 'Produkt'
  artikkelId?: Maybe<Scalars['String']>
  artikkelUrl: Scalars['String']
  artikkelbeskrivelse?: Maybe<Scalars['String']>
  artikkelnavn?: Maybe<Scalars['String']>
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
  generertAv: Scalars['String']
  generertDato: Scalars['LocalDateTime']
  harNavAvtale: Scalars['Boolean']
  hmsnr?: Maybe<Scalars['String']>
  id: Scalars['ID']
  isokode?: Maybe<Scalars['String']>
  isokortnavn?: Maybe<Scalars['String']>
  isotekst?: Maybe<Scalars['String']>
  isotittel?: Maybe<Scalars['String']>
  kategori?: Maybe<Scalars['String']>
  produktId?: Maybe<Scalars['String']>
  produktUrl: Scalars['String']
  produktbeskrivelse?: Maybe<Scalars['String']>
  produktnavn?: Maybe<Scalars['String']>
  rammeavtaleSlutt?: Maybe<Scalars['LocalDate']>
  rammeavtaleStart?: Maybe<Scalars['LocalDate']>
  tekniskeData: Array<HMDBTekniskeDataTriple>
  tilgjengeligForDigitalSoknad: Scalars['Boolean']
  versjon: Scalars['Int']
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
  /** Finn produkter basert på søkeord */
  finnProdukter: HMDBProduktPage
  /** Hent produkter */
  hentAlleProdukter: HMDBProduktPage
  /** Hent produkter med hmsnr */
  hentProdukterMedHmsnr: Array<HMDBProdukt>
  /** Hent produkter med hmsnrs */
  hentProdukterMedHmsnrs: Array<HMDBProdukt>
}

export interface HMDBQueryFinnProdukterArgs {
  filter: HMDBProduktfilterInput
  sokeord: Scalars['String']
}

export interface HMDBQueryHentAlleProdukterArgs {
  filter: HMDBProduktfilterInput
}

export interface HMDBQueryHentProdukterMedHmsnrArgs {
  hmsnr: Scalars['String']
}

export interface HMDBQueryHentProdukterMedHmsnrsArgs {
  hmsnrs: Array<Scalars['String']>
}

export interface HMDBTekniskeDataTriple {
  __typename?: 'TekniskeDataTriple'
  enhet?: Maybe<Scalars['String']>
  tekst?: Maybe<Scalars['String']>
  verdi?: Maybe<Scalars['String']>
  visningstekst: Scalars['String']
}

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
    produktnavn?: string | null | undefined
    isotittel?: string | null | undefined
    isokode?: string | null | undefined
    avtaleposttittel?: string | null | undefined
    avtalepostnr?: string | null | undefined
  }>
}
