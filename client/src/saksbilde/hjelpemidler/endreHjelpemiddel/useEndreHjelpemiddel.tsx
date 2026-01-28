import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { useToast } from '../../../felleskomponenter/toast/ToastContext.tsx'
import { http } from '../../../io/HttpClient.ts'
import { useArtiklerForSak } from '../../../sak/useArtiklerForSak.ts'
import { type EndreHjelpemiddelRequest, type EndretProdukt } from './endreHjelpemiddelTypes.ts'
import { useHjelpemiddel } from './useHjelpemiddel'

export function useEndreHjelpemiddel(sakId: string, endretProdukt: EndretProdukt) {
  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()
  const { artikler, mutate: mutateBestilling } = useArtiklerForSak(sakId)
  const { showSuccessToast } = useToast()
  const { id: hjelpemiddelId, hmsArtNr } = endretProdukt

  // TODO, sende med navn også
  const endreHjelpemiddel = async (endreHjelpemiddel: EndreHjelpemiddelRequest) => {
    await http
      .put(`/api/sak/${sakId}/hjelpemidler`, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        mutateBestilling()
        mutate(`/api/sak/${sakId}/historikk`)
        mutate(`/api/sak/${sakId}/serviceforesporsel`)
        showSuccessToast(`Endret hjelpemiddel til ${endreHjelpemiddel.hmsArtNr}`)
      })
    setVisEndreProdukt(false)
  }

  const endretHjelpemiddel = artikler.find((it) => it.endretArtikkel && it.endretArtikkel.id === hjelpemiddelId)

  const { hjelpemiddel: endretHjelpemiddelProdukt } = useHjelpemiddel(
    endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : undefined
  )

  const nåværendeHmsnr = endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : hmsArtNr

  return {
    visEndreProdukt,
    setVisEndreProdukt,
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddel,
    endretHjelpemiddelProdukt,
  }
}
