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

export function useFinnHjelpemiddel(hmsnummer?: string) {
  const [produkt, setProdukt] = useState<Produkt | null>(null)

  const finnhjelpemiddelApiUrl = '/finnhjelpemiddel-api/graphql'

  useEffect(() => {
    ;(async () => {
      try {
        if (!hmsnummer || hmsnummer.length !== 6) {
          setProdukt(null)
        } else {
          const data = await request<HMDBHentProdukterQuery, HMDBHentProdukterQueryVariables>(
            finnhjelpemiddelApiUrl,
            query,
            {
              hmsnrs: [hmsnummer],
            }
          )
          const [produkt] = data.products
          const { isoCategoryTitle, productVariantURL, articleName, agreements } = produkt

          setProdukt({
            //isokode: isokode || '',
            isotittel: isoCategoryTitle || '',
            posttitler: agreements?.map((agreement) => agreement?.postTitle || '') || [''],
            //rammeavtalePostId: avtalepostnr || '',
            produkturl: productVariantURL || '',
            //artikkelurl: artikkelUrl,
            artikkelnavn: articleName,
            hmsnr: hmsnummer,
          })
        }
      } catch (e) {
        setProdukt(null)
      }
    })()
  }, [hmsnummer])

  return produkt
}
