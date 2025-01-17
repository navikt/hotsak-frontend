import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { useBestilling } from '../hjelpemidler/endreHjelpemiddel/useBestilling'
import { putEndreHjelpemiddel } from '../../io/http'
import { EndretHjelpemiddel } from '../../types/types.internal'
import { useHjelpemiddel } from '../hjelpemidler/useHjelpemiddel'

export const useEndreHjelpemiddel = (sakId: string, hjelpemiddel: any) => {
  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()
  const { bestilling, mutate: mutateBestilling } = useBestilling()

  const endreHjelpemiddel = async (endreHjelpemiddel: EndretHjelpemiddel) => {
    await putEndreHjelpemiddel(sakId, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        // TODO Trenger vi å mutere saken lenger??
        mutate(`api/sak/${sakId}`)
        mutateBestilling()
        mutate(`api/sak/${sakId}/historikk`)
      })
    setVisEndreProdukt(false)
  }

  const endretHjelpemiddel = bestilling?.endredeHjelpemidler.find(
    (hjlpm) => hjlpm.hjelpemiddelId === hjelpemiddel.hjelpemiddelId
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
