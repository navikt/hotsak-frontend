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

export interface Media {
  __typename?: 'Media'
  priority?: Maybe<Scalars['Int']['output']>
  text: Scalars['String']['output']
  type: Scalars['String']['output']
  uri: Scalars['String']['output']
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
  productStock: ProductStock
}

export interface QueryAlternativeProductsArgs {
  hmsnrs: Array<Scalars['String']['input']>
}

export interface QueryProductStockArgs {
  hmsnr: Scalars['String']['input']
}

export interface Supplier {
  __typename?: 'Supplier'
  id: Scalars['String']['output']
  name: Scalars['String']['output']
}

export interface WareHouseStock {
  __typename?: 'WareHouseStock'
  available?: Maybe<Scalars['Int']['output']>
  location: Scalars['String']['output']
  minmax: Scalars['Boolean']['output']
  needNotified?: Maybe<Scalars['Int']['output']>
  reserved?: Maybe<Scalars['Int']['output']>
  updated: Scalars['String']['output']
}

export type FinnAlternativerQueryVariables = Exact<{
  hmsnrs: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type FinnAlternativerQuery = {
  __typename?: 'Query'
  alternativeProducts: Array<{
    __typename?: 'AlternativeProduct'
    hmsArtNr: string
    id: string
    title: string
    articleName: string
    isoCategory: string
    alternativeFor: Array<string>
    hasAgreement: boolean
    supplier: { __typename?: 'Supplier'; id: string; name: string }
    agreements?: Array<{ __typename?: 'Agreement'; title: string; rank: number; postNr?: number | null } | null> | null
    media: Array<{ __typename?: 'Media'; uri: string; text: string; type: string; priority?: number | null }>
    wareHouseStock?: Array<{
      __typename?: 'WareHouseStock'
      location: string
      available?: number | null
      updated: string
      reserved?: number | null
      minmax: boolean
    } | null> | null
  }>
}
