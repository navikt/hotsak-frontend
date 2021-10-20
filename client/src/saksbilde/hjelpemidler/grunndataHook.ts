import useSwr from 'swr'

import { httpGet } from '../../io/http'
import { GrunndataProdukt } from '../../types/types.external'
import { Produkt } from '../../types/types.internal'

interface DataResponse {
  produkt: Produkt | undefined
  isLoading: boolean
  isError: any
}

export function useGrunndata(hmsnummer: string): DataResponse {
  const { data, error } = useSwr<{ data: GrunndataProdukt[] }>(`grunndata-api/artikkel/${hmsnummer}`, httpGet)

  const grunndataProdukt = data?.data[0]
  const produkt = grunndataProdukt
    ? {
        isokode: grunndataProdukt.produkt.isocode,
        isotittel: grunndataProdukt.produkt.isotitle,
        posttittel: grunndataProdukt.produkt.aposttitle,
        rammeavtalePostId: grunndataProdukt.produkt.apostnr,
        produktid: grunndataProdukt.prodid,
      }
    : undefined

  return {
    produkt,
    isLoading: !error && !data,
    isError: error,
  }
}
