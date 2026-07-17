import { useCallback, useEffect, useRef } from 'react'

export function useSerienummer(brevId: string | undefined, serienummer: number | undefined) {
  const brevIdRef = useRef(brevId)
  const serienummerRef = useRef(serienummer ?? 0)

  useEffect(() => {
    if (brevId !== brevIdRef.current) {
      brevIdRef.current = brevId
      serienummerRef.current = serienummer ?? 0
    } else if (serienummer != null && serienummer > serienummerRef.current) {
      serienummerRef.current = serienummer
    }
  }, [brevId, serienummer])

  return useCallback(() => {
    serienummerRef.current += 1
    return serienummerRef.current
  }, [])
}
