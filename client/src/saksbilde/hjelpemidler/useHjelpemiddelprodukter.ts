import { gql } from 'graphql-request'
import { useMemo } from 'react'

import type {
  HMDBFinnHjelpemiddelprodukterQuery,
  HMDBFinnHjelpemiddelprodukterQueryVariables,
  HMDBMediaDoc,
} from '../../generated/grunndata.ts'
import { useGraphQLQuery } from '../../graphql/useGraphQL.ts'
import { grunndataClient } from '../../grunndata/grunndataClient.ts'
import type { Produkt } from '../../types/types.internal'
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
      supplier {
        name
      }
      media {
        uri
        type
        source
        priority
      }
      productVariantURL
    }
  }
`

const ingenProdukter: Produkt[] = []
const imageProxyUrl = window.appSettings.IMAGE_PROXY_URL
const HMSNR_LENGDE = 6

interface ProduktResponse {
  data: Produkt | undefined
  error: Error | undefined
  isLoading: boolean
}

interface ProdukterResponse {
  data: Produkt[]
  error: Error | undefined
  isLoading: boolean
}

export function useHjelpemiddelprodukt(hmsnr?: string): ProduktResponse {
  const produktResponse = useHjelpemiddelprodukter(hmsnr ? [hmsnr] : [])

  if (produktResponse.data.length === 0) {
    return { data: undefined, error: produktResponse.error, isLoading: produktResponse.isLoading }
  }

  return { data: produktResponse.data[0], error: produktResponse.error, isLoading: produktResponse.isLoading }
}

export function useHjelpemiddelprodukter(hmsnrs: string[]): ProdukterResponse {
  const gyldigeHmsnrs = unique(hmsnrs).filter((hmsnr) => hmsnr.length === HMSNR_LENGDE)

  const { data, error, isLoading } = useGraphQLQuery<
    HMDBFinnHjelpemiddelprodukterQuery,
    HMDBFinnHjelpemiddelprodukterQueryVariables
  >(grunndataClient.grunndata, () => {
    if (gyldigeHmsnrs.length === 0) {
      return null
    }
    return {
      document: finnHjelpemiddelprodukterQuery,
      variables: { hmsnrs: gyldigeHmsnrs },
    }
  })

  return useMemo(() => {
    if (error) {
      console.warn(`Kunne ikke hente hjelpemiddelprodukter fra grunndata-search:`, error)
      return { data: ingenProdukter, isLoading, error }
    }

    if (data) {
      return {
        data: data.products.map((produkt) => ({
          isotittel: produkt.isoCategoryTitleShort || '',
          posttitler: produkt.agreements?.map((agreement) => agreement?.postTitle || '') || [],
          produkturl: produkt.productVariantURL || '',
          artikkelnavn: produkt.articleName,
          leverandør: produkt.supplier.name,
          produktbildeUri: produktbilde(produkt.media || []),
          hmsnr: produkt.hmsArtNr || '',
        })),
        isLoading,
        error,
      }
    }
    return { data: ingenProdukter, isLoading, error }
  }, [data, error, isLoading])
}

function produktbilde(media: HMDBMediaDoc[]): Maybe<string> {
  const image = media
    .filter((m) => m.type === 'IMAGE')
    .sort((a, b) => (Number(a.priority) ?? 0) - (Number(b.priority) ?? 0))[0]
  if (!image || !image.uri) {
    return undefined
  }
  return `${imageProxyUrl}/${image.uri}`
}
