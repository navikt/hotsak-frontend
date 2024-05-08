import { useState } from 'react'

import { SpørreundersøkelseId } from '../../innsikt/spørreundersøkelser'
import { postSavnerInformasjonOmHjelpemiddel } from '../../io/http'
import { HjelpemiddelType } from '../../types/types.internal'
import { SavnerInformasjonOmHjelpemiddelModalProps } from '../SavnerInformasjonOmHjelpemiddelModal'

export function useSavnerInformasjonOmHjelpemiddel(
  sakId: string,
  spørreundersøkelseId: SpørreundersøkelseId,
  hjelpemiddel: HjelpemiddelType
): SavnerInformasjonOmHjelpemiddelModalProps & {
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
        await postSavnerInformasjonOmHjelpemiddel(sakId, spørreundersøkelse, besvarelse, svar, hjelpemiddel)
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
  }
}
