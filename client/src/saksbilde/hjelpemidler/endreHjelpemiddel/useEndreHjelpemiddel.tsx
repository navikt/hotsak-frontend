import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { http } from '../../../io/HttpClient.ts'
import { Hjelpemiddel as BehovsmeldingHjelpemiddel } from '../../../types/BehovsmeldingTypes'
import { EndretHjelpemiddelRequest } from '../../../types/types.internal'
import { useArtiklerForSak } from '../useArtiklerForSak'
import { useHjelpemiddel } from './useHjelpemiddel'

export function useEndreHjelpemiddel(sakId: string, hjelpemiddel: BehovsmeldingHjelpemiddel) {
  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()
  const { artikler, mutate: mutateBestilling } = useArtiklerForSak(sakId)

  const endreHjelpemiddel = async (endreHjelpemiddel: EndretHjelpemiddelRequest) => {
    await http
      .put(`/api/sak/${sakId}/hjelpemidler`, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        // TODO Klarer vi å hente URL til det nye hjelpemiddelet?
        // TODO Trenger vi å mutere saken lenger?
        //mutate(`/api/sak/${sakId}`)
        mutateBestilling()
        mutate(`/api/sak/${sakId}/historikk`)
      })
    setVisEndreProdukt(false)
  }

  const endretHjelpemiddel = artikler.find(
    (it) => it.endretHjelpemiddel && it.endretHjelpemiddel.hjelpemiddelId === hjelpemiddel.hjelpemiddelId
  )

  const { hjelpemiddel: endretHjelpemiddelNavn } = useHjelpemiddel(
    endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : undefined
  )

  const nåværendeHmsnr = endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : hjelpemiddel.produkt.hmsArtNr

  return {
    visEndreProdukt,
    setVisEndreProdukt,
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddel,
    endretHjelpemiddelNavn,
  }
}
