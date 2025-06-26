import { gql, request } from 'graphql-request'
import { useState } from 'react'
import { Query, QueryProductStockArgs, QueryProductStocksAllLocationsArgs } from '../../generated/finnAlternativprodukt'

const query = gql`
  query SjekkLagerstatus($hmsnrs: [String!]!) {
    productStocksAllLocations(hmsnrs: $hmsnrs) {
      hmsArtNr
      warehouseStock {
        location
        minmax
        available
      }
    }
  }
`

const lagerstatusForProduktQuery = gql`
  query SjekkLagerstatusForProdukt($hmsnr: String!) {
    productStock(hmsnr: $hmsnr) {
      hmsArtNr
      id
      status
      warehouseStock {
        location
        minmax
        available
      }
    }
  }
`
interface LagerstatusResponse {
  loading: boolean
  harOppdatertLagerstatus: boolean
  sjekkLagerstatusFor: (hmsnrs: string[]) => Promise<void>
  sjekkLagerstatusForProdukt: (hmsnr: string) => Promise<void>
}

export function useSjekkLagerstatus(): LagerstatusResponse {
  const [loading, setLoading] = useState(false)
  const [harOppdatertLagerstatus, setHarOppdatertLagerstatus] = useState(false)

  async function sjekkLagerstatusForProdukt(hmsnr: string) {
    setLoading(true)
    try {
      await request<Query, QueryProductStockArgs>(
        new URL('/finnalternativprodukt-api/graphql', window.location.href).toString(),
        lagerstatusForProduktQuery,
        { hmsnr: hmsnr }
      )
    } catch (err) {
      console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${hmsnr}`, err)
    } finally {
      setLoading(false)
    }
  }

  // Denne funksjonen sjekker lagerstatus for en liste av HMS-nr mot alle lagerlokasjoner i OeBS for gjeldende enhet og
  // er et ganske krevende kall for OeBS. Vi bør være litt forsiktige med hvor ofte denne kalle og kun kalle den hvis listen
  // med HMS-nr er ganske kort < 8
  const MAX_HMSNR_FOR_Å_SJEKKE_LAGERSTATUS_I_BULK = 8

  async function sjekkLagerstatusFor(hmsnrs: string[]) {
    if (harOppdatertLagerstatus || hmsnrs.length === 0 || hmsnrs.length > MAX_HMSNR_FOR_Å_SJEKKE_LAGERSTATUS_I_BULK) {
      if (harOppdatertLagerstatus) {
        console.log('Ikke behov  for å henter ny lagerstatus, vi har allerede en som en ganske fersk')
      }
      if (hmsnrs.length === 0) {
        console.log('Ingen HMS-nr å sjekke lagerstatus for')
      }
      if (hmsnrs.length > MAX_HMSNR_FOR_Å_SJEKKE_LAGERSTATUS_I_BULK) {
        console.warn(
          `For mange HMS-nr (${hmsnrs.length}) for å sjekke lagerstatus i bulk. Maks er ${MAX_HMSNR_FOR_Å_SJEKKE_LAGERSTATUS_I_BULK}.`
        )
      }
      return
    }

    console.log('Sjekker lagerstatus live mot OeBS   for HMS-nr:', hmsnrs.join(', '))

    setLoading(true)
    try {
      await request<Query, QueryProductStocksAllLocationsArgs>(
        new URL('/finnalternativprodukt-api/graphql', window.location.href).toString(),
        query,
        { hmsnrs: hmsnrs }
      )

      setHarOppdatertLagerstatus(true)
    } catch (err) {
      console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${hmsnrs.join(', ')}`, err)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    sjekkLagerstatusFor,
    sjekkLagerstatusForProdukt,
    harOppdatertLagerstatus,
  }
}
