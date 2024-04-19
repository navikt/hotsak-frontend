import { useDebugValue, useEffect } from 'react'

export function useDebug(value: any): void {
  useDebugValue(value)
  useEffect(() => {
    console.log(JSON.stringify(value, null, 2))
  }, [value])
}
