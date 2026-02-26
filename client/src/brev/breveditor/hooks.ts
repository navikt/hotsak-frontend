import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { useSakId } from '../../saksbilde/useSak'
import { useToast } from '../../felleskomponenter/toast/ToastContext'
import { useBehandling } from '../../sak/v2/behandling/useBehandling'
import { useBrevMetadata } from '../useBrevMetadata'
import { useClosePanel } from '../../sak/v2/paneler/usePanelHooks'

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

export const useBeforeUnload = (kreverBekreftelse: boolean, melding: string) => {
  useEffect(() => {
    if (!kreverBekreftelse) return
    const listener = async (ev: BeforeUnloadEvent) => {
      ev.preventDefault()
      return (ev.returnValue = melding)
    }
    window.addEventListener('beforeunload', listener)
    return () => {
      window.removeEventListener('beforeunload', listener)
    }
  }, [kreverBekreftelse, melding])
}

export function useSlettBrevUtkast() {
  const { mutate } = useSWRConfig()
  const sakId = useSakId()
  const { showSuccessToast } = useToast()
  const { mutate: mutateGjeldendeBehandling } = useBehandling()
  const { mutate: mutateBrevMetadata } = useBrevMetadata()
  const closePanel = useClosePanel('brevpanel')

  return async () => {
    await fetch(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, {
      method: 'delete',
    }).then((res) => {
      if (!res.ok) throw new Error(`Brev ikke slettet, statuskode ${res.status}`)
    })
    await mutate(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`)
    showSuccessToast('Brevutkast slettet')
    mutateGjeldendeBehandling()
    mutateBrevMetadata()
    closePanel()
  }
}
