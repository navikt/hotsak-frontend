import { useDebugValue, useEffect } from 'react'
import { logDebug } from './logDebug'

export function useDebug(value: any): void {
  useDebugValue(value)
  useEffect(() => {
    logDebug(value)
  }, [value])
}
