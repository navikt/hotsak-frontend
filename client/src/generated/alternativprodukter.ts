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

export interface Agreement {
  __typename?: 'Agreement'
  expired?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  label?: Maybe<Scalars['String']['output']>
  postId: Scalars['String']['output']
  postNr?: Maybe<Scalars['Int']['output']>
  postTitle: Scalars['String']['output']
  published?: Maybe<Scalars['String']['output']>
  rank: Scalars['Int']['output']
  refNr: Scalars['String']['output']
  title: Scalars['String']['output']
}

export interface AlternativeProduct {
  __typename?: 'AlternativeProduct'
  agreements?: Maybe<Array<Maybe<Agreement>>>
  alternativeFor: Array<Scalars['String']['output']>
  articleName: Scalars['String']['output']
  hasAgreement: Scalars['Boolean']['output']
  hmsArtNr: Scalars['String']['output']
  id: Scalars['String']['output']
  isoCategory: Scalars['String']['output']
  media: Array<Media>
  seriesId: Scalars['String']['output']
  supplier: Supplier
  title: Scalars['String']['output']
  wareHouseStock?: Maybe<Array<Maybe<WareHouseStock>>>
}

export interface AlternativeProductPage {
  __typename?: 'AlternativeProductPage'
  content: Array<AlternativeProduct>
  from: Scalars['Int']['output']
  size: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export interface HmsArtnrMapping {
  __typename?: 'HmsArtnrMapping'
  created: Scalars['String']['output']
  id: Scalars['String']['output']
  sourceHmsArtnr: Scalars['String']['output']
  targetHmsArtnr: Scalars['String']['output']
}

export interface HmsArtnrMappingInput {
  sourceHmsArtnr: Scalars['String']['input']
  targetHmsArtnr: Scalars['String']['input']
}

export interface Media {
  __typename?: 'Media'
  priority?: Maybe<Scalars['Int']['output']>
  text: Scalars['String']['output']
  type: Scalars['String']['output']
  uri: Scalars['String']['output']
}

export interface Mutation {
  __typename?: 'Mutation'
  createHmsArtnrMapping: Array<HmsArtnrMapping>
  deleteHmsArtnrMapping: Scalars['Boolean']['output']
  updateHmsArtnrMapping: HmsArtnrMapping
}

export interface MutationCreateHmsArtnrMappingArgs {
  input: HmsArtnrMappingInput
}

export interface MutationDeleteHmsArtnrMappingArgs {
  input: HmsArtnrMappingInput
}

export interface MutationUpdateHmsArtnrMappingArgs {
  id: Scalars['String']['input']
  input: HmsArtnrMappingInput
}

export interface ProductStock {
  __typename?: 'ProductStock'
  hmsArtNr: Scalars['String']['output']
  id: Scalars['String']['output']
  status: Scalars['String']['output']
  updated: Scalars['String']['output']
  warehouseStock: Array<WareHouseStock>
}

export interface Query {
  __typename?: 'Query'
  alternativeProducts: Array<AlternativeProduct>
  alternativeProductsPage: AlternativeProductPage
  fetchAlternativeProducts: Array<AlternativeProduct>
  getHmsArtnrMappingBySourceHmsArtnr: Array<HmsArtnrMapping>
  getHmsArtnrMappingsById?: Maybe<HmsArtnrMapping>
  productStock: ProductStock
  productStocks: Array<ProductStock>
  productStocksAllLocations: Array<ProductStock>
}

export interface QueryAlternativeProductsArgs {
  hmsnrs: Array<Scalars['String']['input']>
}

export interface QueryAlternativeProductsPageArgs {
  from?: InputMaybe<Scalars['Int']['input']>
  hmsnrs: Array<Scalars['String']['input']>
  size?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryFetchAlternativeProductsArgs {
  hmsnrs: Array<Scalars['String']['input']>
}

export interface QueryGetHmsArtnrMappingBySourceHmsArtnrArgs {
  sourceHmsArtnr: Scalars['String']['input']
}

export interface QueryGetHmsArtnrMappingsByIdArgs {
  id: Scalars['String']['input']
}

export interface QueryProductStockArgs {
  hmsnr: Scalars['String']['input']
}

export interface QueryProductStocksArgs {
  enhetnr: Scalars['String']['input']
  hmsnrs: Array<Scalars['String']['input']>
}

export interface QueryProductStocksAllLocationsArgs {
  hmsnrs: Array<Scalars['String']['input']>
}

export interface Supplier {
  __typename?: 'Supplier'
  id: Scalars['String']['output']
  name: Scalars['String']['output']
}

export interface WareHouseStock {
  __typename?: 'WareHouseStock'
  amountInStock: Scalars['Int']['output']
  available: Scalars['Int']['output']
  backOrders: Scalars['Int']['output']
  inStock: Scalars['Boolean']['output']
  intRequest: Scalars['Int']['output']
  location: Scalars['String']['output']
  locationId: Scalars['Int']['output']
  minmax: Scalars['Boolean']['output']
  needNotified: Scalars['Int']['output']
  orders: Scalars['Int']['output']
  physical: Scalars['Int']['output']
  request: Scalars['Int']['output']
  reserved: Scalars['Int']['output']
  updated: Scalars['String']['output']
}

export type FinnAlternativeProdukterSideQueryVariables = Exact<{
  hmsnrs: Array<Scalars['String']['input']> | Scalars['String']['input']
  from?: InputMaybe<Scalars['Int']['input']>
  size?: InputMaybe<Scalars['Int']['input']>
}>

export type FinnAlternativeProdukterSideQuery = {
  __typename?: 'Query'
  alternativeProductsPage: {
    __typename?: 'AlternativeProductPage'
    total: number
    from: number
    size: number
    content: Array<{
      __typename?: 'AlternativeProduct'
      id: string
      hmsArtNr: string
      title: string
      articleName: string
      isoCategory: string
      alternativeFor: Array<string>
      supplier: { __typename?: 'Supplier'; id: string; name: string }
      media: Array<{ __typename?: 'Media'; uri: string; type: string; priority?: number | null; text: string }>
      wareHouseStock?: Array<{
        __typename?: 'WareHouseStock'
        location: string
        updated: string
        amountInStock: number
      } | null> | null
    }>
  }
}

export type HentProduktInfoQueryVariables = Exact<{
  hmsnrs: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type HentProduktInfoQuery = {
  __typename?: 'Query'
  fetchAlternativeProducts: Array<{
    __typename?: 'AlternativeProduct'
    hmsArtNr: string
    id: string
    wareHouseStock?: Array<{ __typename?: 'WareHouseStock'; location: string; minmax: boolean } | null> | null
  }>
}
