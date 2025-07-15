import { formatISO } from 'date-fns'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { usePost } from '../../../../io/usePost'

import { BeregnSatsRequest, BeregnSatsResponse, Brilleseddel } from '../../../../types/types.internal'

export function useBeregning(): BeregnSatsResponse | undefined {
  const { watch } = useFormContext<{ bestillingsdato?: Date; brilleseddel: Brilleseddel }>()

  const høyreSfære = watch('brilleseddel.høyreSfære')
  const høyreSylinder = watch('brilleseddel.høyreSylinder')
  const venstreSfære = watch('brilleseddel.venstreSfære')
  const venstreSylinder = watch('brilleseddel.venstreSylinder')

  const bestillingsdatoDate = watch('bestillingsdato')
  const bestillingsdato = formatISO(bestillingsdatoDate || Date.now(), { representation: 'date' })

  const { post, data, reset } = usePost<BeregnSatsRequest, BeregnSatsResponse>('/brille-api/api/brillesedler')

  useEffect(() => {
    if (høyreSfære && høyreSylinder && venstreSfære && venstreSylinder) {
      post({
        høyreSfære: Math.abs(Number(høyreSfære)),
        høyreSylinder: Math.abs(Number(høyreSylinder)),
        venstreSfære: Math.abs(Number(venstreSfære)),
        venstreSylinder: Math.abs(Number(venstreSylinder)),
        bestillingsdato,
      }).catch((e) => {
        console.error(e)
        reset()
      })
    } else if (data) {
      reset()
    }
  }, [høyreSfære, høyreSylinder, venstreSfære, venstreSylinder, bestillingsdato])

  return data
}
