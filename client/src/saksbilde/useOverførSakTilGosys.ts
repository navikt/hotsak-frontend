import { useState } from 'react'

import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'
import { mutateSak } from './mutateSak.ts'
import type { OverførSakTilGosysModalProps } from './OverførSakTilGosysModal.tsx'
import { useSakActions } from './useSakActions.ts'

export function useOverførSakTilGosys(
  sakId: string,
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
        await mutateSak(sakId)
      } finally {
        setOpen(false)
      }
    },
  }
}
