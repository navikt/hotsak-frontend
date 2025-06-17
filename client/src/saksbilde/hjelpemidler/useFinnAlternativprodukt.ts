import { gql, request } from 'graphql-request'
import { useEffect, useState } from 'react'
import { AlternativeProduct, Query, QueryAlternativeProductsArgs } from '../../generated/finnAlternativprodukt'
import { useMiljø } from '../../utils/useMiljø'
import { useTilgangContext } from '../../tilgang/useTilgang'

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
  const { innloggetAnsatt } = useTilgangContext()
  const [loading, setLoading] = useState(false)
  const { erIkkeProd } = useMiljø()
  const gjeldendeEnhetsnavn = innloggetAnsatt.gjeldendeEnhet.navn.toLowerCase().replace('nav hjelpemiddelsentral ', '')

  useEffect(() => {
    const unikeHmsnrs = [...new Set(hmsnrs)]
    if (unikeHmsnrs.length === 0) {
      setAlternativeProdukter({})
      return
    }
    console.log(`Henter produkter for HMS-nr: ${unikeHmsnrs.join(', ')}`)
    setLoading(true)

    function harProduktPåLager(produkt: AlternativeProduct): boolean {
      console.log(`Sjekker lagerstatus for produkt: ${produkt.hmsArtNr}`, produkt)
      const lagerstatusForEnhet =
        produkt.wareHouseStock?.filter((lagerstatus) => {
          return (
            lagerstatus?.location?.toLocaleLowerCase().includes(gjeldendeEnhetsnavn) ||
            gjeldendeEnhetsnavn === 'it-avdelingen'
          )
        }) || []

      console.log(`Lagerstatus for enhet ${gjeldendeEnhetsnavn} for produkt ${produkt.hmsArtNr}:`, lagerstatusForEnhet)

      const harPåLager = lagerstatusForEnhet?.filter(
        (lagerstatus) => lagerstatus?.available && lagerstatus.available > 0
      )

      console.log(`Har produkt ${produkt.hmsArtNr} på lager:`, harPåLager.length > 0)

      return harPåLager.length > 0
    }

    if (erIkkeProd) {
      request<Query, QueryAlternativeProductsArgs>(
        new URL('/finnalternativprodukt-api/graphql', window.location.href).toString(),
        query,
        {
          hmsnrs: unikeHmsnrs,
        }
      )
        .then((data) => {
          const alternativeProdukterForHmsnr: AlternativeProdukterMap =
            data.alternativeProducts.reduce<AlternativeProdukterMap>((produktMap, produkt) => {
              produkt.alternativeFor.forEach((hmsnr) => {
                if (harProduktPåLager(produkt)) {
                  if (!produktMap[hmsnr]) {
                    produktMap[hmsnr] = []
                  }
                  const filtrertProdukt: AlternativeProduct = {
                    ...produkt,
                    wareHouseStock:
                      produkt.wareHouseStock?.filter((lagerstatus) => {
                        // I dev har vi mest testdata på "enhet" IT-avdelingen, men det er ikke et reelt lager i OeBS, derfor viser vi alle lager som har produktet på lager
                        console.log('Er vi IT???', gjeldendeEnhetsnavn, gjeldendeEnhetsnavn === 'it-avdelingen')
                        if (gjeldendeEnhetsnavn === 'it-avdelingen') {
                          return lagerstatus?.available && lagerstatus.available > 0
                        }
                        return (
                          lagerstatus?.location?.toLocaleLowerCase().includes(gjeldendeEnhetsnavn) &&
                          lagerstatus.available &&
                          lagerstatus.available > 0
                        )
                      }) ?? [],
                  }
                  produktMap[hmsnr].push(filtrertProdukt)
                } else {
                  console.log(`Produkt ${produkt.hmsArtNr} har ikke på lager for enhet ${gjeldendeEnhetsnavn}`)
                }
              })

              return produktMap
            }, {})

          setAlternativeProdukter(alternativeProdukterForHmsnr)

          console.log(`Data: ${alternativeProdukterForHmsnr}`)
        })
        .catch((err) => {
          console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${unikeHmsnrs.join(', ')}`, err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [hmsnrs])

  return {
    alternativeProdukter,
    loading,
  }
}
