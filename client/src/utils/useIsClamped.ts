import { useEffect, useState } from 'react'

export function useIsClamped(tekst: string, tekstRef: React.RefObject<HTMLDivElement>) {
  const [isClamped, setIsClamped] = useState(false)

  useEffect(() => {
    const checkClamping = () => {
      const element = tekstRef.current

      if (element) {
        const currentStyle = window.getComputedStyle(element)
        const lineClamp = parseInt(currentStyle.getPropertyValue('-webkit-line-clamp'), 10)

        if (lineClamp > 0 && currentStyle.getPropertyValue('overflow') === 'hidden') {
          setIsClamped(element.scrollHeight > element.clientHeight)
        } else {
          setIsClamped(false)
        }
      }
    }

    checkClamping()

    window.addEventListener('resize', checkClamping)
    return () => window.removeEventListener('resize', checkClamping)
  }, [tekst])

  return isClamped
}
