import { gql } from 'graphql-request'
import { useEffect, useMemo, useState } from 'react'

import type {
  HMDBFinnHjelpemiddelprodukterQuery,
  HMDBFinnHjelpemiddelprodukterQueryVariables,
} from '../../generated/grunndata.ts'
import type { Produkt } from '../../types/types.internal'
import { useGrunndataQuery } from '../../grunndata/useGrunndata.ts'
import { unique } from '../../utils/array.ts'

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

export function useHjelpemiddelprodukter(hmsnrs: string[]) {
  const variables = useMemo(() => ({ hmsnrs: unique(hmsnrs) }), [hmsnrs])
  const { data, error } = useGrunndataQuery<
    HMDBFinnHjelpemiddelprodukterQuery,
    HMDBFinnHjelpemiddelprodukterQueryVariables
  >(finnHjelpemiddelprodukterQuery, variables)

  const [produkter, setProdukter] = useState<Produkt[]>([])
  useEffect(() => {
    if (data) {
      const produkter: Produkt[] = data.products.map((produkt) => {
        return {
          isotittel: produkt.isoCategoryTitleShort || '',
          posttitler: produkt.agreements?.map((agreement) => agreement?.postTitle || '') || [],
          produkturl: produkt.productVariantURL || '',
          artikkelnavn: produkt.articleName,
          hmsnr: produkt.hmsArtNr || '',
        }
      })

      setProdukter(produkter ? produkter : [])
    }
    if (error) {
      console.warn(`Kunne ikke hente hjelpemiddelprodukter fra grunndata-search, hmsnrs: ${variables.hmsnrs}`, error)
      setProdukter([])
    }
  }, [data, error, variables.hmsnrs])

  return produkter
}
