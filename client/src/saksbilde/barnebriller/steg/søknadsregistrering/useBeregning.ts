import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { usePost } from '../../../../io/usePost'

import { BeregnSatsRequest, BeregnSatsResponse, Brilleseddel } from '../../../../types/types.internal'

export function useBeregning(): BeregnSatsResponse | undefined {
  const { watch } = useFormContext<{ brillestyrke: Brilleseddel }>()
  const høyreSfære = watch('brillestyrke.høyreSfære')
  const høyreSylinder = watch('brillestyrke.høyreSylinder')
  const venstreSfære = watch('brillestyrke.venstreSfære')
  const venstreSylinder = watch('brillestyrke.venstreSylinder')

  // const { post, data, reset } = usePost<BeregnSatsRequest, BeregnSatsResponse>('/brillekalkulator-api/brillesedler')
  const { post, data, reset } = usePost<BeregnSatsRequest, BeregnSatsResponse>('/brillekalkulator-api/brillesedler')

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
