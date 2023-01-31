import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { usePost } from '../../../../io/usePost'

import { BeregnSatsRequest, BeregnSatsResponse, Brilleseddel } from '../../../../types/types.internal'

export function useBeregning(): BeregnSatsResponse | undefined {
  const { watch } = useFormContext<{ brilleseddel: Brilleseddel }>()
  const høyreSfære = watch('brilleseddel.høyreSfære')
  const høyreSylinder = watch('brilleseddel.høyreSylinder')
  const venstreSfære = watch('brilleseddel.venstreSfære')
  const venstreSylinder = watch('brilleseddel.venstreSylinder')

  // const { post, data, reset } = usePost<BeregnSatsRequest, BeregnSatsResponse>('/brillekalkulator-api/brillesedler')
  const { post, data, reset } = usePost<BeregnSatsRequest, BeregnSatsResponse>('/brillekalkulator-api/api/brillesedler')

  useEffect(() => {
    if (høyreSfære && høyreSylinder && venstreSfære && venstreSylinder) {
      post({
        høyreSfære,
        høyreSylinder,
        venstreSfære,
        venstreSylinder,
      }).catch((e) => {
        console.log(e)
        reset()
      })
    } else if (data) {
      reset()
    }
  }, [høyreSfære, høyreSylinder, venstreSfære, venstreSylinder])

  return data
}
