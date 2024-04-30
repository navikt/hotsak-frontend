import { RefObject, useEffect, useRef, useState } from 'react'

export function useOnScreen(ref: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), {
      threshold: 1.0,
    })
  }, [])

  useEffect(() => {
    if (observerRef && observerRef.current && ref.current) {
      observerRef.current.observe(ref.current)
    }
    return () => {
      if (observerRef && observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [ref])

  return isOnScreen
}
