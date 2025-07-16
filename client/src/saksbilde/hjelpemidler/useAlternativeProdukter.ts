import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'

import { useErOmbrukPilot, useTilgangContext } from '../../tilgang/useTilgang'
import { oebs_enheter } from './endreHjelpemiddel/oebsMapping'
import { pushError } from '../../utils/faro.ts'
import {
  FinnAlternativeProdukterSideQuery,
  FinnAlternativeProdukterSideQueryVariables,
} from '../../generated/alternativprodukter.ts'
import { grunndataClient } from '../../grunndata/grunndataClient.ts'
import { unique } from '../../utils/array.ts'

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

type AlternativeProdukterMap = Record<string, AlternativeProduct[]>

interface AlternativeProdukter {
  alternativeProdukter: AlternativeProdukterMap
  alleAlternativeProdukter: AlternativeProdukterMap
  loading: boolean
  mutate(): Promise<void>
}

export function useAlternativeProdukter(hmsnrs: string[]): AlternativeProdukter {
  const { innloggetAnsatt } = useTilgangContext()

  const [alternativeProdukter, setAlternativeProdukter] = useState<AlternativeProdukterMap>({})
  const [alleAlternativeProdukter, setAlleAlternativeProdukter] = useState<AlternativeProdukterMap>({})

  const [loading, setLoading] = useState(false)

  const erOmbrukPilot = useErOmbrukPilot()
  const gjeldendeEnhetsnummer = innloggetAnsatt.gjeldendeEnhet.nummer

  const oebsEnhet = oebs_enheter.find((enhet) => enhet.enhetsnummer === gjeldendeEnhetsnummer)
  const lagerlokasjonsnavn = oebsEnhet?.lagerlokasjoner?.map((lokasjon) => lokasjon.lokasjon.toLowerCase()) || []

  async function hentAlternativeProdukter(hmsnrs: string[]) {
    setLoading(true)

    try {
      const data = await grunndataClient.alternativprodukter.request<
        FinnAlternativeProdukterSideQuery,
        FinnAlternativeProdukterSideQueryVariables
      >(finnAlternativeProdukterSideQuery, { hmsnrs })

      const alleAlternativer = byggProduktMap(data.alternativeProductsPage.content)
      setAlleAlternativeProdukter(alleAlternativer)

      const alternativeProdukterForHmsnr: AlternativeProdukterMap = Object.fromEntries(
        Object.entries(alleAlternativer).map(([hmsnr, produkter]) => [hmsnr, produkter.filter(harProduktPåLager)])
      )
      setAlternativeProdukter(alternativeProdukterForHmsnr)
    } catch (err: unknown) {
      console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${hmsnrs.join(', ')}`, err)
      pushError(err)
    } finally {
      setLoading(false)
    }
  }

  const mutate = async () => {
    const unikeHmsnrs = unique(hmsnrs)

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

  function byggProduktMap(produkter: AlternativeProduct[]): AlternativeProdukterMap {
    return produkter.reduce<AlternativeProdukterMap>((produktMap, produkt) => {
      const filtrertProdukt: AlternativeProduct = {
        ...produkt,
        wareHouseStock:
          produkt.wareHouseStock?.filter((lagerstatus) => {
            return lagerstatus?.location && lagerlokasjonsnavn.includes(lagerstatus.location.toLocaleLowerCase())
          }) ?? [],
      }

      produkt.alternativeFor.forEach((hmsnr) => {
        if (!produktMap[hmsnr]) {
          produktMap[hmsnr] = []
        }
        produktMap[hmsnr].push(filtrertProdukt)
      })
      return produktMap
    }, {})
  }

  function harProduktPåLager(produkt: AlternativeProduct): boolean {
    const lagerstatusForEnhet =
      produkt.wareHouseStock?.filter((lagerstatus) => {
        return lagerstatus?.location && lagerlokasjonsnavn.includes(lagerstatus.location.toLocaleLowerCase())
      }) || []

    const harPåLager = lagerstatusForEnhet?.filter(
      (lagerstatus) => lagerstatus?.amountInStock && lagerstatus.amountInStock > 0
    )
    return harPåLager.length > 0
  }
}
