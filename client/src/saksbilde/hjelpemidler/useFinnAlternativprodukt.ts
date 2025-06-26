import { gql, request } from 'graphql-request'
import { useEffect, useState } from 'react'
import { AlternativeProduct, Query, QueryAlternativeProductsArgs } from '../../generated/finnAlternativprodukt'
import { useErOmbrukPilot, useTilgangContext } from '../../tilgang/useTilgang'
import { oebs_enheter } from './endreHjelpemiddel/oebsMapping'

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
  alleAlternativeProdukter: AlternativeProdukterMap
  loading: boolean
  mutate: () => Promise<void>
}

export function useFinnAlternativprodukt(hmsnrs: string[]): AlternativeProdukterResponse {
  const [alternativeProdukter, setAlternativeProdukter] = useState<AlternativeProdukterMap>({})
  const [alleAlternativeProdukter, setAlleAlternativeProdukter] = useState<AlternativeProdukterMap>({})
  const { innloggetAnsatt } = useTilgangContext()
  const [loading, setLoading] = useState(false)
  const erOmbrukPilot = useErOmbrukPilot()
  const gjeldendeEnhetsnummer = innloggetAnsatt.gjeldendeEnhet.nummer

  const oebsEnhet = oebs_enheter.find((enhet) => enhet.enhetsnummer === gjeldendeEnhetsnummer)
  const lagerlokasjonsnavn = oebsEnhet?.lagerlokasjoner?.map((lokasjon) => lokasjon.lokasjon.toLowerCase()) || []

  function harProduktPåLager(produkt: AlternativeProduct): boolean {
    const lagerstatusForEnhet =
      produkt.wareHouseStock?.filter((lagerstatus) => {
        return lagerstatus?.location && lagerlokasjonsnavn.includes(lagerstatus.location.toLocaleLowerCase())
      }) || []
    const harPåLager = lagerstatusForEnhet?.filter((lagerstatus) => lagerstatus?.available && lagerstatus.available > 0)
    return harPåLager.length > 0
  }

  async function hentAlternativeProdukter(hmsnrs: string[]) {
    setLoading(true)

    try {
      console.log('Henter alternative produkter på nytt mot Finn Gjernbruksprodukt')

      const data = await request<Query, QueryAlternativeProductsArgs>(
        new URL('/finnalternativprodukt-api/graphql', window.location.href).toString(),
        query,
        { hmsnrs: hmsnrs }
      )

      const alleAlternativer = data.alternativeProducts.reduce<AlternativeProdukterMap>((produktMap, produkt) => {
        produkt.alternativeFor.forEach((hmsnr) => {
          if (!produktMap[hmsnr]) {
            produktMap[hmsnr] = []
          }
          const filtrertProdukt: AlternativeProduct = {
            ...produkt,
            wareHouseStock:
              produkt.wareHouseStock?.filter((lagerstatus) => {
                return lagerstatus?.location && lagerlokasjonsnavn.includes(lagerstatus.location.toLocaleLowerCase())
              }) ?? [],
          }
          produktMap[hmsnr].push(filtrertProdukt)
        })
        return produktMap
      }, {})

      setAlleAlternativeProdukter(alleAlternativer)

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
                    return (
                      lagerstatus?.location && lagerlokasjonsnavn.includes(lagerstatus.location.toLocaleLowerCase())
                    )
                  }) ?? [],
              }
              produktMap[hmsnr].push(filtrertProdukt)
            }
          })
          return produktMap
        }, {})
      setAlternativeProdukter(alternativeProdukterForHmsnr)
    } catch (err) {
      console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${hmsnrs.join(', ')}`, err)
    } finally {
      setLoading(false)
    }
  }

  const mutate = async () => {
    const unikeHmsnrs = [...new Set(hmsnrs)]

    if (unikeHmsnrs.length === 0 || !oebsEnhet) {
      setAlternativeProdukter({})
      return
    }
    if (erOmbrukPilot) {
      await hentAlternativeProdukter(unikeHmsnrs)
    }
  }

  useEffect(() => {
    mutate()
  }, [hmsnrs])

  return {
    alternativeProdukter,
    alleAlternativeProdukter,
    loading,
    mutate,
  }
}
