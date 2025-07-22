import { gql } from 'graphql-request'
import { useMemo } from 'react'

import type {
  HMDBFinnHjelpemiddelprodukterQuery,
  HMDBFinnHjelpemiddelprodukterQueryVariables,
} from '../../generated/grunndata.ts'
import type { Produkt } from '../../types/types.internal'
import { unique } from '../../utils/array.ts'
import { useGraphQLQuery } from '../../graphql/useGraphQL.ts'
import { grunndataClient } from '../../grunndata/grunndataClient.ts'

const finnHjelpemiddelprodukterQuery = gql`
  query FinnHjelpemiddelprodukter($hmsnrs: [String!]!) {
    products(hmsnrs: $hmsnrs) {
      id
      articleName
      hmsArtNr
      isoCategoryTitleShort
      agreements {
        postTitle
      }
      productVariantURL
    }
  }
`

const ingenProdukter: Produkt[] = []

export function useHjelpemiddelprodukter(hmsnrs: string[]): Produkt[] {
  const { data, error } = useGraphQLQuery<
    HMDBFinnHjelpemiddelprodukterQuery,
    HMDBFinnHjelpemiddelprodukterQueryVariables
  >(grunndataClient.grunndata, () => ({
    document: finnHjelpemiddelprodukterQuery,
    variables: { hmsnrs: unique(hmsnrs) },
  }))

  return useMemo(() => {
    if (error) {
      console.warn(`Kunne ikke hente hjelpemiddelprodukter fra grunndata-search:`, error)
      return ingenProdukter
    }
    if (data) {
      return data.products.map((produkt) => ({
        isotittel: produkt.isoCategoryTitleShort || '',
        posttitler: produkt.agreements?.map((agreement) => agreement?.postTitle || '') || [],
        produkturl: produkt.productVariantURL || '',
        artikkelnavn: produkt.articleName,
        hmsnr: produkt.hmsArtNr || '',
      }))
    }
    return ingenProdukter
  }, [data, error])
}
