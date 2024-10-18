import { useState } from 'react'
import { putSendTilGosys } from '../io/http'
import { useSWRConfig } from 'swr'
import type { OverførGosysModalProps } from './OverførGosysModal'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export function useOverførGosys(
  sakId: string,
  spørreundersøkelseId: SpørreundersøkelseId
): OverførGosysModalProps & {
  onOpen(): void
} {
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  return {
    open,
    loading,
    spørreundersøkelseId,
    onOpen() {
      setOpen(true)
    },
    onClose() {
      setOpen(false)
    },
    async onBekreft(tilbakemelding) {
      setLoading(true)
      try {
        await putSendTilGosys(sakId, tilbakemelding.svar)
        await mutate(`api/sak/${sakId}`, `api/sak/${sakId}/historikk`)
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
  }
}
