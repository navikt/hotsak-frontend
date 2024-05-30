import { gql, request } from 'graphql-request'
import { useEffect, useState } from 'react'

import { HMDBHentProdukterQuery, HMDBHentProdukterQueryVariables } from '../../generated/finnhjelpemiddel'
import { Produkt } from '../../types/types.internal'

const query = gql`
  query HentProdukter($hmsnrs: [String!]!) {
    products(hmsnrs: $hmsnrs) {
      hmsArtNr # hmsnr
      productVariantURL
      isoCategoryTitle
      articleName
      agreements {
        postTitle
      }
    }
  }
`

export function useFinnHjelpemiddel(hmsnr?: string) {
  const [produkt, setProdukt] = useState<Produkt | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        if (!hmsnr || hmsnr.length !== 6) {
          console.warn(`Kan ikke hente hjelpemiddel fra FinnHjelpemiddel, hmsnr: ${hmsnr}`)
          setProdukt(null)
        } else {
          const data = await request<HMDBHentProdukterQuery, HMDBHentProdukterQueryVariables>(
            new URL('/finnhjelpemiddel-api/graphql', window.location.href).toString(),
            query,
            {
              hmsnrs: [hmsnr],
            }
          )
          const [produkt] = data.products
          const { isoCategoryTitle, productVariantURL, articleName, agreements } = produkt

          setProdukt({
            isotittel: isoCategoryTitle || '',
            posttitler: agreements?.map((agreement) => agreement?.postTitle || '') || [''],
            produkturl: productVariantURL || '',
            artikkelnavn: articleName,
            hmsnr,
          })
        }
      } catch (e) {
        console.warn(`Kunne ikke hente hjelpemiddel fra FinnHjelpemiddel, hmsnr: ${hmsnr}`, e)
        setProdukt(null)
      }
    })()
  }, [hmsnr])

  return produkt
}
