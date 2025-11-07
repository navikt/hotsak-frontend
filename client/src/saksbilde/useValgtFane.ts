import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { HøyrekolonneTabs } from '../types/types.internal.ts'

const valgtFaneName = 'fane'

export function useValgtFane(valgtFaneInitial: HøyrekolonneTabs): [HøyrekolonneTabs, (valgtFane: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const [valgtFane, setValgtFane] = useState<HøyrekolonneTabs>(() => {
    const valgtFaneParam = searchParams.get(valgtFaneName)?.toUpperCase()
    if (isHøyrekolonneTabs(valgtFaneParam)) {
      return valgtFaneParam
    } else {
      return valgtFaneInitial
    }
  })

  return [
    valgtFane,
    (valgtFane) => {
      if (isHøyrekolonneTabs(valgtFane)) {
        setSearchParams((previous) => {
          const params = new URLSearchParams(previous)
          params.set(valgtFaneName, valgtFane)
          return params
        })
        setValgtFane(valgtFane)
      }
    },
  ]
}

function isHøyrekolonneTabs(value: unknown): value is HøyrekolonneTabs {
  return Object.values(HøyrekolonneTabs).includes(value as HøyrekolonneTabs)
}
