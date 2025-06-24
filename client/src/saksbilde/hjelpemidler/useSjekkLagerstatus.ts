import { gql, request } from 'graphql-request'
import { useState } from 'react'
import { useTilgangContext } from '../../tilgang/useTilgang'
import { oebs_enheter } from './endreHjelpemiddel/oebsMapping'
import { Query, QueryProductStocksArgs } from '../../generated/finnAlternativprodukt'

const query = gql`
  query SjekkLagerstatus($hmsnrs: [String!]!, $enhetnr: String!) {
    productStocks(hmsnrs: $hmsnrs, enhetnr: $enhetnr) {
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
  sjekkLagerstatus: (hmsnrs: string[]) => Promise<void>
}

export function useSjekkLagerstatus(): LagerstatusResponse {
  const { innloggetAnsatt } = useTilgangContext()
  const [loading, setLoading] = useState(false)
  const gjeldendeEnhetsnummer = innloggetAnsatt.gjeldendeEnhet.nummer

  const oebsEnhet = oebs_enheter.find((enhet) => enhet.enhetsnummer === gjeldendeEnhetsnummer)

  async function sjekkLagerstatus(hmsnrs: string[]) {
    if (hmsnrs.length === 0 || !oebsEnhet) {
      return
    }

    setLoading(true)
    try {
      await Promise.all(
        oebsEnhet.lagerlokasjoner.map(async (lokasjon) => {
          console.log('sjekker lagerstatus for lokasjon:', lokasjon.lokasjon, hmsnrs)
          return await request<Query, QueryProductStocksArgs>(
            new URL('/finnalternativprodukt-api/graphql', window.location.href).toString(),
            query,
            { enhetnr: lokasjon.oebs_enhetsnummer, hmsnrs: hmsnrs }
          )
        })
      )
    } catch (err) {
      console.warn(`Kunne ikke hente alternative produkter for HMS-nr: ${hmsnrs.join(', ')}`, err)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    sjekkLagerstatus,
  }
}
