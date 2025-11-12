import { useEffect } from 'react'
import { useUmami } from './useUmami'

export function useLogVinduStørrelse() {
  const { logVinduStørrelse } = useUmami()

  useEffect(() => {
    // Logger størrelse på oppstart
    logVinduStørrelse({
      tekst: 'Størrelse ved oppstart',
    })

    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        logVinduStørrelse({
          tekst: 'Størrelse etter resizing',
        })
      }, 1000)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])
}
