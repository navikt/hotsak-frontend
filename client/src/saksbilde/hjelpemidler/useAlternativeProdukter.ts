import { gql } from 'graphql-request'
import { useMemo, useState } from 'react'

import { calculateOffset, PageResponse } from '../../felleskomponenter/Page.ts'
import type {
  FinnAlternativeProdukterSideQuery,
  FinnAlternativeProdukterSideQueryVariables,
  HentProduktInfoQuery,
  HentProduktInfoQueryVariables,
} from '../../generated/alternativprodukter.ts'
import { useGraphQLQuery } from '../../graphql/useGraphQL.ts'
import { grunndataClient } from '../../grunndata/grunndataClient.ts'
import { unique } from '../../utils/array.ts'
import { pushEvent } from '../../utils/faro.ts'
import { useGjeldendeOebsEnhet } from './endreHjelpemiddel/oebsMapping.ts'

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
const hentProduktInfo = gql`
  query HentProduktInfo($hmsnrs: [String!]!) {
    fetchAlternativeProducts(hmsnrs: $hmsnrs) {
      hmsArtNr
      id
      wareHouseStock {
        location
        minmax
      }
    }
  }
`

export type AlternativeProduct = FinnAlternativeProdukterSideQuery['alternativeProductsPage']['content'][0]
export type AlternativeProdukterByHmsArtNr = Record<string, AlternativeProduct[]>
export type Produktinfo = HentProduktInfoQuery['fetchAlternativeProducts'][0]
export type ProduktinfoByHmsArtNr = Record<string, Produktinfo>
type ProduktLagerinfo = NonNullable<Produktinfo['wareHouseStock']>

/**
 * Hvis argumentet `$size` eller feltet `total` i query `FinnAlternativeProdukterSide` er mindre eller lik enn denne
 * verdien, vil feltet `wareHouseStock` inneholde oppdatert lagerstatus.
 */
const MAKS_ANTALL_ALTERNATIVER_SOM_GIR_OPPDATERT_LAGERSTATUS = 10

interface AlternativeProdukter extends PageResponse {
  alternativeProdukterByHmsArtNr: AlternativeProdukterByHmsArtNr
  harOppdatertLagerstatus: boolean
  harPaginering: boolean
  isLoading: boolean
  onPageChange(pageNumber: number): void
}

const ingenAlternativeProdukter: AlternativeProdukter = {
  alternativeProdukterByHmsArtNr: {},
  harOppdatertLagerstatus: false,
  harPaginering: false,
  isLoading: false,
  onPageChange() {},
  pageNumber: 1,
  pageSize: 1000,
  totalElements: 0,
}

export const ingenAlternativeProdukterForHmsArtNr: AlternativeProduct[] = []

export function useProduktLagerInfo(hmsnrs: string[]): Lagerinfo {
  const { data, error, isLoading } = useGraphQLQuery<HentProduktInfoQuery, HentProduktInfoQueryVariables>(
    grunndataClient.alternativprodukter,
    () =>
      hmsnrs.length > 0
        ? {
            document: hentProduktInfo,
            variables: { hmsnrs: unique(hmsnrs) },
          }
        : null
  )

  const { lagerlokasjoner } = useGjeldendeOebsEnhet()

  const lagerstatusForEnhet = (produkt: Produktinfo): ProduktLagerinfo =>
    produkt.wareHouseStock?.filter(
      (lagerstatus) => lagerstatus?.location && lagerlokasjoner.includes(lagerstatus.location.toLocaleLowerCase())
    ) ?? []

  function produktinfoByHmsArtNr(produkter: Produktinfo[]): ProduktinfoByHmsArtNr {
    return Object.fromEntries(
      produkter.map((produkt) => [produkt.hmsArtNr, { ...produkt, wareHouseStock: lagerstatusForEnhet(produkt) }])
    )
  }

  return useMemo(() => {
    if (error) {
      console.warn(`Kunne ikke hente produktinfo produkter:`, error)
    }
    if (!data) {
      return { produkter: {}, isLoading }
    }

    const produkterByHmsArtNr = produktinfoByHmsArtNr(data.fetchAlternativeProducts)

    return {
      produkter: produkterByHmsArtNr,
      isLoading,
    }
  }, [data, error, isLoading])
}

export function useAlternativeProdukter(
  hmsnrs: string[],
  pageSize: number = 1000,
  kunProdukterPåLager: boolean = true
): AlternativeProdukter {
  const [pageNumber, setPageNumber] = useState(1)
  const { data, error, isLoading } = useGraphQLQuery<
    FinnAlternativeProdukterSideQuery,
    FinnAlternativeProdukterSideQueryVariables
  >(grunndataClient.alternativprodukter, () =>
    hmsnrs.length > 0
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
    const harOppdatertLagerstatus =
      pageSize <= MAKS_ANTALL_ALTERNATIVER_SOM_GIR_OPPDATERT_LAGERSTATUS ||
      totalElements <= MAKS_ANTALL_ALTERNATIVER_SOM_GIR_OPPDATERT_LAGERSTATUS

    pushEvent('alternative_produkter_hentet', 'ombruk', {
      alternativerFor: hmsnrs.join(','),
      pageSize: pageSize.toString(),
      totalElements: totalElements.toString(),
    })

    return {
      alternativeProdukterByHmsArtNr: Object.fromEntries(
        Object.entries(produkterByHmsArtNr).map(([hmsArtNr, produkter]) => [
          hmsArtNr,
          harOppdatertLagerstatus && kunProdukterPåLager ? produkter.filter(harProduktPåLager) : produkter,
        ])
      ),
      harOppdatertLagerstatus,
      harPaginering: totalElements > pageSize,
      isLoading,
      pageNumber,
      pageSize,
      totalElements,
      onPageChange: setPageNumber,
    }
  }, [data, error, isLoading, pageNumber, pageSize, kunProdukterPåLager])
}

export interface Lagerinfo {
  isLoading: boolean
  produkter: ProduktinfoByHmsArtNr
}
