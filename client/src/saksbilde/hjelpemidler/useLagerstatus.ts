import { gql } from 'graphql-request'
import { useState } from 'react'

import type {
  SjekkLagerstatusForProduktQuery,
  SjekkLagerstatusForProduktQueryVariables,
  SjekkLagerstatusQuery,
  SjekkLagerstatusQueryVariables,
} from '../../generated/alternativprodukter.ts'
import { useAlternativprodukterExecute } from '../../grunndata/useGrunndata.ts'

const sjekkLagerstatusForProduktQuery = gql`
  query SjekkLagerstatusForProdukt($hmsnr: String!) {
    productStock(hmsnr: $hmsnr) {
      id
      hmsArtNr
      warehouseStock {
        location
        amountInStock
        updated
      }
    }
  }
`

const sjekkLagerstatusQuery = gql`
  query SjekkLagerstatus($hmsnrs: [String!]!) {
    productStocksAllLocations(hmsnrs: $hmsnrs) {
      id
      hmsArtNr
      warehouseStock {
        location
        amountInStock
        updated
      }
    }
  }
`
interface LagerstatusResponse {
  loading: boolean
  harOppdatertLagerstatus: boolean
  sjekkLagerstatusForProdukt(hmsnr: string): Promise<void>
  sjekkLagerstatusFor(hmsnrs: string[]): Promise<boolean>
}

export function useLagerstatus(): LagerstatusResponse {
  const [harOppdatertLagerstatus, setHarOppdatertLagerstatus] = useState(false)

  const { loading: sjekkerLagerstatusForProdukt, execute: sjekkLagerstatusForProdukt } = useAlternativprodukterExecute<
    SjekkLagerstatusForProduktQuery,
    SjekkLagerstatusForProduktQueryVariables
  >(sjekkLagerstatusForProduktQuery)

  const { loading: sjekkerLagerstatus, execute: sjekkLagerstatus } = useAlternativprodukterExecute<
    SjekkLagerstatusQuery,
    SjekkLagerstatusQueryVariables
  >(sjekkLagerstatusQuery)

  /**
   * Denne funksjonen sjekker lagerstatus for en liste av HMS-nr mot alle lagerlokasjoner i OeBS for gjeldende enhet og
   * er et ganske krevende kall for OeBS. Vi bør være litt forsiktige med hvor ofte denne kalles og kun kalle den hvis listen
   * med HMS-nr er ganske kort (< 8).
   */
  const MAX_HMSNR_FOR_Å_SJEKKE_LAGERSTATUS_I_BULK = 8

  return {
    loading: sjekkerLagerstatusForProdukt || sjekkerLagerstatus,
    async sjekkLagerstatusFor(hmsnrs: string[]) {
      if (harOppdatertLagerstatus) {
        console.log('Ikke behov for å hente ny lagerstatus, vi har allerede en som en ganske fersk')
        return false
      }
      if (hmsnrs.length === 0) {
        console.log('Ingen HMS-nr å sjekke lagerstatus for')
        return false
      }
      if (hmsnrs.length > MAX_HMSNR_FOR_Å_SJEKKE_LAGERSTATUS_I_BULK) {
        console.warn(
          `For mange HMS-nr (${hmsnrs.length}) for å sjekke lagerstatus i bulk. Maks er ${MAX_HMSNR_FOR_Å_SJEKKE_LAGERSTATUS_I_BULK}.`
        )
        return false
      }

      console.log('Sjekker lagerstatus live mot OeBS for HMS-nr:', hmsnrs.join(', '))

      await sjekkLagerstatus({ hmsnrs })

      setHarOppdatertLagerstatus(true)

      return true
    },
    async sjekkLagerstatusForProdukt(hmsnr: string) {
      await sjekkLagerstatusForProdukt({ hmsnr })
    },
    harOppdatertLagerstatus,
  }
}
