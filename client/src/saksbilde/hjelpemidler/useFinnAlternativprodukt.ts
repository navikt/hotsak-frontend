import { gql, request } from 'graphql-request'
import { useEffect, useState } from 'react'
import { AlternativeProduct, Query, QueryAlternativeProductsArgs } from '../../generated/finnAlternativprodukt'

const query = gql`
  query FinnAlternativer($hmsnrs: [String!]!) {
    alternativeProducts(hmsnrs: $hmsnrs) {
      hmsArtNr
      id
      title
      articleName
      supplier {
        id
        name
      }
      isoCategory
      alternativeFor
      hasAgreement
      agreements {
        title
        rank
        postNr
      }
      media {
        uri
        text
        type
        priority
      }
      wareHouseStock {
        location
        available
        updated
        reserved
        minmax
      }
    }
  }
`
type AlternativeProdukterMap = Record<string, AlternativeProduct[]>
interface AlternativeProdukterResponse {
  alternativeProdukter: AlternativeProdukterMap
  loading: boolean
}

export function useFinnAlternativprodukt(hmsnrs: string[]): AlternativeProdukterResponse {
  const [alternativeProdukter, setAlternativeProdukter] = useState<AlternativeProdukterMap>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unikeHmsnrs = [...new Set(hmsnrs)]
    if (unikeHmsnrs.length === 0) {
      setAlternativeProdukter({})
      return
    }

    setLoading(true)

    request<Query, QueryAlternativeProductsArgs>(
      new URL('/finnalternativprodukt-api/graphql', window.location.href).toString(),
      query,
      {
        hmsnrs: unikeHmsnrs,
      }
    )
      .then((data) => {
        const alternativeProdukterForHmsnr = data.alternativeProducts.reduce<AlternativeProdukterMap>(
          (produktMap, produkt) => {
            produkt.alternativeFor.forEach((hmsnr) => {
              if (!produktMap[hmsnr]) {
                produktMap[hmsnr] = []
              }
              produktMap[hmsnr].push(produkt)
            })

            return produktMap
          },
          {}
        )

        setAlternativeProdukter(alternativeProdukterForHmsnr)
        console.log(`Henter produkter for HMS-nr: ${unikeHmsnrs.join(', ')}`)
        console.log(`Data: ${alternativeProdukterForHmsnr}`)
      })
      .catch((err) => {
        console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${unikeHmsnrs.join(', ')}`, err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [hmsnrs])

  return {
    alternativeProdukter,
    loading,
  }
}
