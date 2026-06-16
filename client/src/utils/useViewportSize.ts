import { useEffect, useState } from 'react'

interface ViewportSize {
  width: number
  height: number
}

export function useViewportSize(): ViewportSize {
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewportSize
}

export function useIsLargeScreen(breakpoint: number = 1024): boolean {
  const { width } = useViewportSize()
  return width >= breakpoint
}
