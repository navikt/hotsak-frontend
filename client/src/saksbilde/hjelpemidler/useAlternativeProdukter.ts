import { gql } from 'graphql-request'
import { useMemo } from 'react'

import { useErOmbrukPilot } from '../../tilgang/useTilgang'
import { useGjeldendeOebsEnhet } from './endreHjelpemiddel/oebsMapping'
import type {
  FinnAlternativeProdukterSideQuery,
  FinnAlternativeProdukterSideQueryVariables,
} from '../../generated/alternativprodukter.ts'
import { grunndataClient } from '../../grunndata/grunndataClient.ts'
import { unique } from '../../utils/array.ts'
import { useGraphQLQuery } from '../../graphql/useGraphQL.ts'

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

interface AlternativeProdukter {
  alternativeProdukter: AlternativeProdukterByHmsArtNr
  alleAlternativeProdukter: AlternativeProdukterByHmsArtNr
}

const ingenAlternativeProdukter: AlternativeProdukter = {
  alleAlternativeProdukter: {},
  alternativeProdukter: {},
}

export function useAlternativeProdukter(hmsnrs: string[]): AlternativeProdukter {
  const erOmbrukPilot = useErOmbrukPilot()
  const { data, error } = useGraphQLQuery<
    FinnAlternativeProdukterSideQuery,
    FinnAlternativeProdukterSideQueryVariables
  >(grunndataClient.alternativprodukter, () => {
    return erOmbrukPilot ? { document: finnAlternativeProdukterSideQuery, variables: { hmsnrs: unique(hmsnrs) } } : null
  })

  const { grupperPåHmsArtNr, harProduktPåLager } = useGjeldendeOebsEnhet()

  return useMemo(() => {
    if (error) {
      console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${hmsnrs.join(', ')}`, error)
      return ingenAlternativeProdukter
    }
    if (data) {
      const alleAlternativeProdukter = grupperPåHmsArtNr(data.alternativeProductsPage.content)
      return {
        alleAlternativeProdukter,
        alternativeProdukter: Object.fromEntries(
          Object.entries(alleAlternativeProdukter).map(([hmsArtNr, produkter]) => [
            hmsArtNr,
            produkter.filter(harProduktPåLager),
          ])
        ),
      }
    }

    return ingenAlternativeProdukter
  }, [data, error, hmsnrs])
}
