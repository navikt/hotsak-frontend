import { useState } from 'react'

import { SpørreundersøkelseId } from '../../innsikt/spørreundersøkelser'
import { postInformasjonOmHjelpemiddel } from '../../io/http'
import { HjelpemiddelType } from '../../types/types.internal'
import { InformasjonOmHjelpemiddelModalProps } from '../InformasjonOmHjelpemiddelModal'

export function useInformasjonOmHjelpemiddel(
  sakId: string,
  spørreundersøkelseId: SpørreundersøkelseId,
  hjelpemiddel: HjelpemiddelType
): InformasjonOmHjelpemiddelModalProps & {
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
        await postInformasjonOmHjelpemiddel(sakId, spørreundersøkelse, besvarelse, svar, hjelpemiddel)
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
  }
}
