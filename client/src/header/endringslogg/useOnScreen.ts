import { RefObject, useEffect, useState } from 'react'

export function useOnScreen(ref: RefObject<HTMLElement | null>, threshold: number = 0.1, rootMargin: string = '0px') {
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), {
      threshold,
      rootMargin,
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, threshold, rootMargin])

  return isOnScreen
}
