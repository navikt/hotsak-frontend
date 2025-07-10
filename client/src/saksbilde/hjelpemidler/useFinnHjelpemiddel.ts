import { gql, request } from 'graphql-request'
import { useEffect, useState } from 'react'

import { HMDBHentProdukterQuery, HMDBHentProdukterQueryVariables } from '../../generated/finnhjelpemiddel'
import { Produkt } from '../../types/types.internal'

const query = gql`
  query HentProdukter($hmsnrs: [String!]!) {
    products(hmsnrs: $hmsnrs) {
      hmsArtNr # hmsnr
      productVariantURL
      isoCategoryTitleShort
      articleName
      agreements {
        postTitle
      }
    }
  }
`

export function useFinnHjelpemiddel(hmsnrs: string[]) {
  const [produkter, setProdukter] = useState<Produkt[]>([])

  const unikeHmsnrs = [...new Set(hmsnrs)]
  // TODO skriv om til å ikke være async
  useEffect(() => {
    ;(async () => {
      try {
        const data = await request<HMDBHentProdukterQuery, HMDBHentProdukterQueryVariables>(
          new URL('/finnhjelpemiddel-api/graphql', window.location.href).toString(),
          query,
          {
            hmsnrs: unikeHmsnrs,
          }
        )

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
      } catch (e) {
        console.warn(`Kunne ikke hente hjelpemidler fra FinnHjelpemiddel, hmsnrs: ${unikeHmsnrs}`, e)
        setProdukter([])
      }
    })()
  }, unikeHmsnrs)

  return produkter
}
