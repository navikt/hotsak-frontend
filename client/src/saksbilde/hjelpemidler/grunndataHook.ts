import { useState, useEffect } from 'react'
import { gql, request } from 'graphql-request'
import { HMDBHentProduktQuery, HMDBHentProduktQueryVariables } from '../../generated/hjelpemiddeldatabasen'
import { Produkt } from '../../types/types.internal'

const query = gql`
  query HentProdukt($hmsnr: String!) {
    produkter: hentProdukterMedHmsnr(hmsnr: $hmsnr) {
      artikkelUrl
      produktUrl
      produktnavn
      isotittel
      isokode
      avtaleposttittel
      avtalepostnr
    }
  }
`

export function useGrunndata(hmsnummer: string) {
  const [produkt, setProdukt] = useState<Produkt | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await request<HMDBHentProduktQuery, HMDBHentProduktQueryVariables>(
          '/grunndata-api/graphql',
          query,
          { hmsnr: hmsnummer }
        )
        const [produkt] = data.produkter
        const { isokode, isotittel, avtaleposttittel, avtalepostnr, produktUrl, artikkelUrl } = produkt
        setProdukt({
          isokode: isokode || '',
          isotittel: isotittel || '',
          posttittel: avtaleposttittel || '',
          rammeavtalePostId: avtalepostnr || '',
          produkturl: produktUrl || '',
          artikkelurl: artikkelUrl,
        })
      } catch (e) {
        setProdukt(null)
      }
    })()
  }, [hmsnummer])

  return produkt
}
