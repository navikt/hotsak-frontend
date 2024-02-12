export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  LocalDate: { input: any; output: any; }
  LocalDateTime: { input: string; output: string; }
}

export interface HMDBAvtalepost {
  __typename?: 'Avtalepost';
  beskrivelse: Scalars['String']['output'];
  id: Scalars['String']['output'];
  navn: Scalars['String']['output'];
  nummer: Scalars['String']['output'];
}

export interface HMDBBestillingsordning {
  __typename?: 'Bestillingsordning';
  erIBestillingsordning: Scalars['Boolean']['output'];
  hmsnr: Scalars['String']['output'];
}

export interface HMDBGodkjenningskurs {
  __typename?: 'Godkjenningskurs';
  isokode: Scalars['String']['output'];
  kursId: Scalars['Int']['output'];
  tittel: Scalars['String']['output'];
}

export interface HMDBKategori {
  __typename?: 'Kategori';
  navn: Scalars['String']['output'];
  produkter: Array<HMDBProdukt>;
}

export interface HMDBLeverandor {
  __typename?: 'Leverandor';
  adresse?: Maybe<Scalars['String']['output']>;
  epost?: Maybe<Scalars['String']['output']>;
  generertAv: Scalars['String']['output'];
  generertDato: Scalars['LocalDateTime']['output'];
  id: Scalars['ID']['output'];
  landkode?: Maybe<Scalars['String']['output']>;
  leverandorId: Scalars['String']['output'];
  leverandornavn?: Maybe<Scalars['String']['output']>;
  postnummer?: Maybe<Scalars['String']['output']>;
  poststed?: Maybe<Scalars['String']['output']>;
  telefon?: Maybe<Scalars['String']['output']>;
  www?: Maybe<Scalars['String']['output']>;
}

export interface HMDBPaakrevdGodkjenningskursDto {
  __typename?: 'PaakrevdGodkjenningskursDTO';
  isokode: Scalars['String']['output'];
  kursId: Scalars['Int']['output'];
  tittel: Scalars['String']['output'];
}

/** Kombinasjon av produkt/produktserie, artikkel og hjelpemiddel */
export interface HMDBProdukt {
  __typename?: 'Produkt';
  artikkelId: Scalars['String']['output'];
  artikkelUrl: Scalars['String']['output'];
  artikkelbeskrivelse?: Maybe<Scalars['String']['output']>;
  artikkelnavn: Scalars['String']['output'];
  artikkelnr?: Maybe<Scalars['String']['output']>;
  avtalepostId?: Maybe<Scalars['String']['output']>;
  avtalepostbeskrivelse?: Maybe<Scalars['String']['output']>;
  avtalepostnr?: Maybe<Scalars['String']['output']>;
  avtalepostrangering?: Maybe<Scalars['Int']['output']>;
  avtaleposttittel?: Maybe<Scalars['String']['output']>;
  blobType?: Maybe<Scalars['String']['output']>;
  blobUrlLite?: Maybe<Scalars['String']['output']>;
  blobUrlStort?: Maybe<Scalars['String']['output']>;
  blobUse?: Maybe<Scalars['String']['output']>;
  erIBestillingsordning: Scalars['Boolean']['output'];
  generertAv: Scalars['String']['output'];
  generertDato: Scalars['LocalDateTime']['output'];
  harNavAvtale: Scalars['Boolean']['output'];
  hmsnr?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isokode: Scalars['String']['output'];
  isokortnavn?: Maybe<Scalars['String']['output']>;
  isotekst: Scalars['String']['output'];
  isotittel: Scalars['String']['output'];
  kategori?: Maybe<Scalars['String']['output']>;
  leverandor?: Maybe<HMDBLeverandor>;
  leverandorId?: Maybe<Scalars['String']['output']>;
  /** @deprecated Bruk pakrevdGodkjenningskurs, replace with pakrevdGodkjenningskurs */
  paakrevdGodkjenningskurs?: Maybe<HMDBPaakrevdGodkjenningskursDto>;
  pakrevdGodkjenningskurs?: Maybe<HMDBGodkjenningskurs>;
  produktId: Scalars['String']['output'];
  produktUrl: Scalars['String']['output'];
  produktbeskrivelse: Scalars['String']['output'];
  produktnavn: Scalars['String']['output'];
  produkttype?: Maybe<HMDBProdukttype>;
  rammeavtaleId?: Maybe<Scalars['String']['output']>;
  rammeavtaleSlutt?: Maybe<Scalars['LocalDate']['output']>;
  rammeavtaleStart?: Maybe<Scalars['LocalDate']['output']>;
  tekniskeData: Array<HMDBTekniskeDataTriple>;
  tekniskeDataSomTekst: Scalars['String']['output'];
  tilgjengeligForDigitalSoknad: Scalars['Boolean']['output'];
}

export interface HMDBProduktPage {
  __typename?: 'ProduktPage';
  hasMore: Scalars['Boolean']['output'];
  items: Array<HMDBProdukt>;
  numberOfItems: Scalars['Int']['output'];
}

export interface HMDBProdukterFilterInput {
  artikkelId?: InputMaybe<Array<Scalars['String']['input']>>;
  avtalepostId?: InputMaybe<Array<Scalars['String']['input']>>;
  erIBestillingsordning?: InputMaybe<Scalars['Boolean']['input']>;
  hmsnr?: InputMaybe<Array<Scalars['String']['input']>>;
  isokode?: InputMaybe<Array<Scalars['String']['input']>>;
  kategori?: InputMaybe<Array<Scalars['String']['input']>>;
  produktId?: InputMaybe<Array<Scalars['String']['input']>>;
  tilgjengeligForDigitalSoknad?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface HMDBProdukterPaginertFilterInput {
  filter?: InputMaybe<HMDBProdukterFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}

export interface HMDBProduktfilterInput {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}

export enum HMDBProdukttype {
  Del = 'Del',
  Hovedprodukt = 'Hovedprodukt',
  Tilbehoer = 'Tilbehoer'
}

export interface HMDBQuery {
  __typename?: 'Query';
  avtaleposter: Array<HMDBAvtalepost>;
  /**
   * Sjekk om et tilbehør er prisforhandlet
   * @deprecated Bruk prisforhandletTilbehor
   */
  erPrisforhandletTilbehoer: Scalars['Boolean']['output'];
  /**
   * Hent alle produkter
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  hentAlleProdukter: HMDBProduktPage;
  /**
   * Sjekk om et produkt/tilbehør er på bestillingsordning
   * @deprecated Bruk produkter med erIBestillingsordning = true
   */
  hentErIBestillingsOrdning: Array<HMDBBestillingsordning>;
  /**
   * Hent produkter med hmsnr
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  hentProdukterMedHmsnr: Array<HMDBProdukt>;
  /**
   * Hent produkter med hmsnrs
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  hentProdukterMedHmsnrs: Array<HMDBProdukt>;
  kategorier: Array<HMDBKategori>;
  /** Finn produkter */
  produkter: Array<HMDBProdukt>;
  /** Finn produkter (paginert) */
  produkterPaginert: HMDBProduktPage;
  /**
   * Hent produkter som er tilgjengelige for digital søknad
   * @deprecated Bruk produkter i stedet, replace with produkter(filter)
   */
  sortiment: Array<HMDBProdukt>;
  tilbehor: Array<HMDBTilbehor>;
}


export interface HMDBQueryErPrisforhandletTilbehoerArgs {
  hmsnr: Scalars['String']['input'];
  leverandorId: Scalars['String']['input'];
  rammeavtaleId: Scalars['String']['input'];
}


export interface HMDBQueryHentAlleProdukterArgs {
  filter?: InputMaybe<HMDBProduktfilterInput>;
}


export interface HMDBQueryHentErIBestillingsOrdningArgs {
  hmsnrs: Array<Scalars['String']['input']>;
}


export interface HMDBQueryHentProdukterMedHmsnrArgs {
  hmsnr: Scalars['String']['input'];
}


export interface HMDBQueryHentProdukterMedHmsnrsArgs {
  hmsnrs: Array<Scalars['String']['input']>;
}


export interface HMDBQueryKategorierArgs {
  navn?: InputMaybe<Array<Scalars['String']['input']>>;
}


export interface HMDBQueryProdukterArgs {
  filter?: InputMaybe<HMDBProdukterFilterInput>;
}


export interface HMDBQueryProdukterPaginertArgs {
  filter?: InputMaybe<HMDBProdukterPaginertFilterInput>;
}


export interface HMDBQueryTilbehorArgs {
  filter?: InputMaybe<HMDBTilbehorFilterInput>;
}

/** Teknisk datum med ledetekst, verdi og evt. enhet */
export interface HMDBTekniskeDataTriple {
  __typename?: 'TekniskeDataTriple';
  enhet?: Maybe<Scalars['String']['output']>;
  tekst?: Maybe<Scalars['String']['output']>;
  verdi?: Maybe<Scalars['String']['output']>;
  visningstekst: Scalars['String']['output'];
}


/** Teknisk datum med ledetekst, verdi og evt. enhet */
export interface HMDBTekniskeDataTripleVisningstekstArgs {
  separator?: InputMaybe<Scalars['String']['input']>;
}

export interface HMDBTilbehor {
  __typename?: 'Tilbehor';
  hmsnr?: Maybe<Scalars['String']['output']>;
  leverandorId?: Maybe<Scalars['String']['output']>;
  rammeavtaleId?: Maybe<Scalars['String']['output']>;
}

export interface HMDBTilbehorFilterInput {
  hmsnr?: InputMaybe<Array<Scalars['String']['input']>>;
  leverandorId?: InputMaybe<Array<Scalars['String']['input']>>;
  rammeavtaleId?: InputMaybe<Array<Scalars['String']['input']>>;
}

export type HMDBHentProduktQueryVariables = Exact<{
  hmsnr: Scalars['String']['input'];
}>;


export type HMDBHentProduktQuery = { __typename?: 'Query', produkter: Array<{ __typename?: 'Produkt', artikkelUrl: string, produktUrl: string, produktnavn: string, isotittel: string, isokode: string, avtaleposttittel?: string | null, avtalepostnr?: string | null, artikkelnavn: string }> };
