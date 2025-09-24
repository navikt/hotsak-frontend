import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { http } from '../../../io/HttpClient.ts'
import { Hjelpemiddel as BehovsmeldingHjelpemiddel } from '../../../types/BehovsmeldingTypes'
import { useArtiklerForSak } from '../useArtiklerForSak'
import { useHjelpemiddel } from './useHjelpemiddel'
import { EndretHjelpemiddelRequest } from './endreHjelpemiddelTypes.ts'
import { useToast } from '../../../felleskomponenter/toast/ToastContext.tsx'

export function useEndreHjelpemiddel(sakId: string, hjelpemiddel: BehovsmeldingHjelpemiddel) {
  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()
  const { artikler, mutate: mutateBestilling } = useArtiklerForSak(sakId)
  const { showSuccessToast } = useToast()

  const endreHjelpemiddel = async (endreHjelpemiddel: EndretHjelpemiddelRequest) => {
    await http
      .put(`/api/sak/${sakId}/hjelpemidler`, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        mutateBestilling()
        mutate(`/api/sak/${sakId}/historikk`)
        showSuccessToast(`Endret hjelpemiddel til ${endreHjelpemiddel.hmsArtNr}`)
      })
    setVisEndreProdukt(false)
  }

  const endretHjelpemiddel = artikler.find(
    (it) => it.endretHjelpemiddel && it.endretHjelpemiddel.hjelpemiddelId === hjelpemiddel.hjelpemiddelId
  )

  const { hjelpemiddel: endretHjelpemiddelProdukt } = useHjelpemiddel(
    endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : undefined
  )

  const nåværendeHmsnr = endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : hjelpemiddel.produkt.hmsArtNr

  return {
    visEndreProdukt,
    setVisEndreProdukt,
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddel,
    endretHjelpemiddelProdukt,
  }
}
