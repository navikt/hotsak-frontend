import { type EffectCallback, useEffect } from 'react'

export function useOncePerSession(key: string, effect: EffectCallback) {
  useEffect(() => {
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, 'true')
      effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
