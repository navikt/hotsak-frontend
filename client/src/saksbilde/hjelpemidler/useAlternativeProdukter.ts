import { gql } from 'graphql-request'
import { useMemo, useState } from 'react'

import { useErOmbrukPilot } from '../../tilgang/useTilgang.ts'
import { useGjeldendeOebsEnhet } from './endreHjelpemiddel/oebsMapping.ts'
import type {
  FinnAlternativeProdukterSideQuery,
  FinnAlternativeProdukterSideQueryVariables,
} from '../../generated/alternativprodukter.ts'
import { grunndataClient } from '../../grunndata/grunndataClient.ts'
import { unique } from '../../utils/array.ts'
import { useGraphQLQuery } from '../../graphql/useGraphQL.ts'
import { calculateOffset, PageResponse } from '../../felleskomponenter/Page.ts'

const finnAlternativeProdukterSideQuery = gql`
  query FinnAlternativeProdukterSide($hmsnrs: [String!]!, $from: Int, $size: Int) {
    alternativeProductsPage(hmsnrs: $hmsnrs, from: $from, size: $size) {
      total
      from
      size
      content {
        id
        hmsArtNr
        title
        articleName
        supplier {
          id
          name
        }
        isoCategory
        alternativeFor
        media {
          uri
          type
          priority
          text
        }
        wareHouseStock {
          location
          updated
          amountInStock
        }
      }
    }
  }
`

export type AlternativeProduct = FinnAlternativeProdukterSideQuery['alternativeProductsPage']['content'][0]
export type AlternativeProdukterByHmsArtNr = Record<string, AlternativeProduct[]>

/**
 * Hvis argumentet `$size` eller feltet `total` i query `FinnAlternativeProdukterSide` er mindre eller lik enn denne
 * verdien, vil feltet `wareHouseStock` inneholde oppdatert lagerstatus.
 */
const MAKS_ANTALL_ALTERNATIVER_SOM_GIR_OPPDATERT_LAGERSTATUS = 10

interface AlternativeProdukter extends PageResponse {
  alternativeProdukterByHmsArtNr: AlternativeProdukterByHmsArtNr
  harOppdatertLagerstatus: boolean
  isLoading: boolean
  onPageChange(pageNumber: number): void
}

const ingenAlternativeProdukter: AlternativeProdukter = {
  alternativeProdukterByHmsArtNr: {},
  harOppdatertLagerstatus: false,
  isLoading: false,
  onPageChange() {},
  pageNumber: 1,
  pageSize: 1000,
  totalElements: 0,
}

export const ingenAlternativeProdukterForHmsArtNr: AlternativeProduct[] = []

export function useAlternativeProdukter(
  hmsnrs: string[],
  pageSize: number = 1000,
  filter: boolean = true
): AlternativeProdukter {
  const erOmbrukPilot = useErOmbrukPilot()
  const [pageNumber, setPageNumber] = useState(1)
  const { data, error, isLoading } = useGraphQLQuery<
    FinnAlternativeProdukterSideQuery,
    FinnAlternativeProdukterSideQueryVariables
  >(grunndataClient.alternativprodukter, () =>
    erOmbrukPilot && hmsnrs.length > 0
      ? {
          document: finnAlternativeProdukterSideQuery,
          variables: { hmsnrs: unique(hmsnrs), from: calculateOffset({ pageNumber, pageSize }), size: pageSize },
        }
      : null
  )

  const { grupperPåHmsArtNr, harProduktPåLager } = useGjeldendeOebsEnhet()

  return useMemo(() => {
    if (error) {
      console.warn(`Kunne ikke hente alternative produkter:`, error)
    }
    if (!data) {
      return { ...ingenAlternativeProdukter, isLoading, pageNumber, pageSize }
    }
    const {
      alternativeProductsPage: { total: totalElements, content },
    } = data
    const produkterByHmsArtNr = grupperPåHmsArtNr(content)
    return {
      alternativeProdukterByHmsArtNr: Object.fromEntries(
        Object.entries(produkterByHmsArtNr).map(([hmsArtNr, produkter]) => [
          hmsArtNr,
          filter ? produkter.filter(harProduktPåLager) : produkter,
        ])
      ),
      harOppdatertLagerstatus:
        pageSize <= MAKS_ANTALL_ALTERNATIVER_SOM_GIR_OPPDATERT_LAGERSTATUS ||
        totalElements <= MAKS_ANTALL_ALTERNATIVER_SOM_GIR_OPPDATERT_LAGERSTATUS,
      isLoading,
      pageNumber,
      pageSize,
      totalElements,
      onPageChange: setPageNumber,
    }
  }, [data, error, isLoading, pageNumber, pageSize, filter])
}
