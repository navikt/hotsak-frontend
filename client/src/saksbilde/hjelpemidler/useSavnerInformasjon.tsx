import { useState } from 'react'

import { SpørreundersøkelseId } from '../../innsikt/spørreundersøkelser'
import { postSavnerInformasjon } from '../../io/http'
import { HjelpemiddelType } from '../../types/types.internal'
import { SavnerInformasjonModalProps } from '../SavnerInformasjonModal'

export function useSavnerInformasjon(
  sakId: string,
  spørreundersøkelseId: SpørreundersøkelseId,
  hjelpemiddel: HjelpemiddelType
): SavnerInformasjonModalProps & {
  onOpen(): void
} {
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
    async onBesvar(spørreundersøkelse, besvarelse, svar) {
      setLoading(true)
      try {
        await postSavnerInformasjon(sakId, spørreundersøkelse, besvarelse, svar, hjelpemiddel)
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
  }
}
