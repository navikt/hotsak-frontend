export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export interface HMDBAgreementInfoDoc {
  __typename?: 'AgreementInfoDoc'
  expired: Scalars['String']['output']
  id: Scalars['String']['output']
  identifier?: Maybe<Scalars['String']['output']>
  label: Scalars['String']['output']
  postId?: Maybe<Scalars['String']['output']>
  postIdentifier?: Maybe<Scalars['String']['output']>
  postNr: Scalars['Int']['output']
  postTitle?: Maybe<Scalars['String']['output']>
  rank: Scalars['Int']['output']
  reference: Scalars['String']['output']
  title?: Maybe<Scalars['String']['output']>
}

export interface HMDBAttributesDoc {
  __typename?: 'AttributesDoc'
  bestillingsordning?: Maybe<Scalars['Boolean']['output']>
  compatibleWith?: Maybe<HMDBCompatibleWith>
  digitalSoknad?: Maybe<Scalars['Boolean']['output']>
  hasTender?: Maybe<Scalars['Boolean']['output']>
  keywords?: Maybe<Array<Scalars['String']['output']>>
  manufacturer?: Maybe<Scalars['String']['output']>
  pakrevdGodkjenningskurs?: Maybe<HMDBPakrevdGodkjenningskurs>
  produkttype?: Maybe<HMDBProdukttype>
  series?: Maybe<Scalars['String']['output']>
  shortdescription?: Maybe<Scalars['String']['output']>
  sortimentKategori?: Maybe<Scalars['String']['output']>
  tenderId?: Maybe<Scalars['String']['output']>
  text?: Maybe<Scalars['String']['output']>
  url?: Maybe<Scalars['String']['output']>
}

export interface HMDBBestillingsordning {
  __typename?: 'Bestillingsordning'
  bestillingsordning: Scalars['Boolean']['output']
  hmsnr: Scalars['String']['output']
}

export interface HMDBCompatibleWith {
  __typename?: 'CompatibleWith'
  seriesIds: Array<Scalars['String']['output']>
}

export interface HMDBMediaDoc {
  __typename?: 'MediaDoc'
  priority: Scalars['Int']['output']
  source: HMDBMediaSourceType
  text?: Maybe<Scalars['String']['output']>
  type: HMDBMediaType
  uri: Scalars['String']['output']
}

export enum HMDBMediaSourceType {
  Externalurl = 'EXTERNALURL',
  Hmdb = 'HMDB',
  Import = 'IMPORT',
  Register = 'REGISTER',
  Unknown = 'UNKNOWN',
}

export enum HMDBMediaType {
  Image = 'IMAGE',
  Other = 'OTHER',
  Pdf = 'PDF',
  Video = 'VIDEO',
  Xls = 'XLS',
}

export interface HMDBPakrevdGodkjenningskurs {
  __typename?: 'PakrevdGodkjenningskurs'
  isokode: Scalars['String']['output']
  kursId: Scalars['Int']['output']
  tittel: Scalars['String']['output']
}

export interface HMDBProduct {
  __typename?: 'Product'
  accessory: Scalars['Boolean']['output']
  agreements: Array<HMDBAgreementInfoDoc>
  articleName: Scalars['String']['output']
  attributes: HMDBAttributesDoc
  created: Scalars['String']['output']
  createdBy: Scalars['String']['output']
  data: Array<HMDBTechData>
  dataAsText: Scalars['String']['output']
  expired: Scalars['String']['output']
  filters: HMDBTechDataFilters
  hasAgreement: Scalars['Boolean']['output']
  hmsArtNr?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  identifier: Scalars['String']['output']
  isoCategory: Scalars['String']['output']
  isoCategoryText?: Maybe<Scalars['String']['output']>
  isoCategoryTextShort?: Maybe<Scalars['String']['output']>
  isoCategoryTitle?: Maybe<Scalars['String']['output']>
  isoCategoryTitleShort?: Maybe<Scalars['String']['output']>
  media: Array<HMDBMediaDoc>
  productURL: Scalars['String']['output']
  productVariantURL: Scalars['String']['output']
  seriesId?: Maybe<Scalars['String']['output']>
  sparePart: Scalars['Boolean']['output']
  status: HMDBProductStatus
  supplier: HMDBProductSupplier
  supplierRef: Scalars['String']['output']
  title: Scalars['String']['output']
  updated: Scalars['String']['output']
  updatedBy: Scalars['String']['output']
}

export enum HMDBProductStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Inactive = 'INACTIVE',
}

export interface HMDBProductSupplier {
  __typename?: 'ProductSupplier'
  id: Scalars['String']['output']
  identifier: Scalars['String']['output']
  name: Scalars['String']['output']
}

export enum HMDBProdukttype {
  Del = 'Del',
  Hovedprodukt = 'Hovedprodukt',
  Tilbehoer = 'Tilbehoer',
}

export interface HMDBQuery {
  __typename?: 'Query'
  bestillingsordning: Array<HMDBBestillingsordning>
  /**  Get products by hmsArtNr (max 500 results) */
  products: Array<HMDBProduct>
}

export interface HMDBQueryBestillingsordningArgs {
  hmsnrs: Array<Scalars['String']['input']>
}

export interface HMDBQueryProductsArgs {
  hmsnrs: Array<Scalars['String']['input']>
}

export interface HMDBTechData {
  __typename?: 'TechData'
  key: Scalars['String']['output']
  unit: Scalars['String']['output']
  value: Scalars['String']['output']
}

export interface HMDBTechDataFilters {
  __typename?: 'TechDataFilters'
  beregnetBarn?: Maybe<Scalars['String']['output']>
  breddeCM?: Maybe<Scalars['Int']['output']>
  brukervektMaksKG?: Maybe<Scalars['Int']['output']>
  brukervektMinKG?: Maybe<Scalars['Int']['output']>
  fyllmateriale?: Maybe<Scalars['String']['output']>
  lengdeCM?: Maybe<Scalars['Int']['output']>
  materialeTrekk?: Maybe<Scalars['String']['output']>
  setebreddeMaksCM?: Maybe<Scalars['Int']['output']>
  setebreddeMinCM?: Maybe<Scalars['Int']['output']>
  setedybdeMaksCM?: Maybe<Scalars['Int']['output']>
  setedybdeMinCM?: Maybe<Scalars['Int']['output']>
  setehoydeMaksCM?: Maybe<Scalars['Int']['output']>
  setehoydeMinCM?: Maybe<Scalars['Int']['output']>
  totalVektKG?: Maybe<Scalars['Int']['output']>
}

export type HMDBHentProdukterQueryVariables = Exact<{
  hmsnrs: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type HMDBHentProdukterQuery = {
  __typename?: 'Query'
  products: Array<{
    __typename?: 'Product'
    hmsArtNr?: string | null
    productVariantURL: string
    isoCategoryTitleShort?: string | null
    articleName: string
    agreements: Array<{ __typename?: 'AgreementInfoDoc'; postTitle?: string | null }>
  }>
}
