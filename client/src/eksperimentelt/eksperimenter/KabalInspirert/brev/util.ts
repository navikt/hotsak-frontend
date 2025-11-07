import { useLayoutEffect, useRef, useState } from 'react'

export const useRefSize = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ width: number; height: number }>()
  useLayoutEffect(() => {
    const elm = ref.current
    if (!elm) return
    const observer = new ResizeObserver(() => {
      const { width: measuredWidth, height: measuredHeight } = elm.getBoundingClientRect()
      if (!size || size.width != measuredWidth || size.height != measuredHeight)
        setSize({ width: measuredWidth, height: measuredHeight })
    })
    observer.observe(elm)
    return () => {
      observer.disconnect()
    }
  }, [ref, size])
  return { size, ref }
}
