import { useState } from 'react'

import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'
import type { OverførSakTilGosysModalProps } from './OverførSakTilGosysModal.tsx'
import { useSakActions } from './useSakActions.ts'

export function useOverførSakTilGosys(
  spørreundersøkelseId: SpørreundersøkelseId
): OverførSakTilGosysModalProps & { onOpen(): void } {
  const [open, setOpen] = useState(false)
  const { overførSakTilGosys, state } = useSakActions()
  return {
    open,
    loading: state.loading,
    spørreundersøkelseId,
    onOpen() {
      setOpen(true)
    },
    onClose() {
      setOpen(false)
    },
    async onBekreft(tilbakemelding) {
      try {
        await overførSakTilGosys(tilbakemelding.svar)
      } finally {
        setOpen(false)
      }
    },
  }
}
