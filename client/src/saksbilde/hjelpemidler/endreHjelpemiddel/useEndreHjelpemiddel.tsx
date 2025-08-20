import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { putEndreHjelpemiddel } from '../../../io/http'
import { useHjelpemiddel } from './useHjelpemiddel'
import { useArtiklerForSak } from '../useArtiklerForSak'
import { Hjelpemiddel as BehovsmeldingHjelpemiddel } from '../../../types/BehovsmeldingTypes'
import { EndretHjelpemiddelRequest } from '../../../types/types.internal'

export const useEndreHjelpemiddel = (sakId: string, hjelpemiddel: BehovsmeldingHjelpemiddel) => {
  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()
  const { artikler, mutate: mutateBestilling } = useArtiklerForSak(sakId)

  const endreHjelpemiddel = async (endreHjelpemiddel: EndretHjelpemiddelRequest) => {
    await putEndreHjelpemiddel(sakId, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        // TODO Klarer vi å hente url til det nye hjelpemidlet?
        // TODO Trenger vi å mutere saken lenger??
        //mutate(`/api/sak/${sakId}`)
        mutateBestilling()
        mutate(`/api/sak/${sakId}/historikk`)
      })
    setVisEndreProdukt(false)
  }

  const endretHjelpemiddel = artikler.find(
    (hjlpm) => hjlpm.endretHjelpemiddel && hjlpm.endretHjelpemiddel.hjelpemiddelId === hjelpemiddel.hjelpemiddelId
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
