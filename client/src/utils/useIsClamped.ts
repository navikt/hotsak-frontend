import { type RefObject, useEffect, useState } from 'react'

export function useIsClamped(tekst: string, tekstRef: RefObject<HTMLDivElement | null>) {
  const [isClamped, setIsClamped] = useState(false)

  useEffect(() => {
    const element = tekstRef.current
    if (!element) return

    const checkClamping = () => {
      const currentStyle = window.getComputedStyle(element)
      const lineClamp = parseInt(currentStyle.getPropertyValue('-webkit-line-clamp'), 10)

      if (lineClamp > 0 && currentStyle.getPropertyValue('overflow') === 'hidden') {
        setIsClamped(element.scrollHeight > element.clientHeight)
      } else {
        setIsClamped(false)
      }
    }

    checkClamping()

    const resizeObserver = new ResizeObserver(checkClamping)
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [tekst, tekstRef])

  return isClamped
}
