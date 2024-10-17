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
  const [error, setError] = useState<string | undefined>(undefined)
  return {
    open,
    loading,
    spørreundersøkelseId,
    error,
    onOpen() {
      setOpen(true)
    },
    onClose() {
      setOpen(false)
      setError(undefined)
    },
    async onBesvar(tilbakemelding) {
      setError(undefined)
      setLoading(true)
      try {
        await postInformasjonOmHjelpemiddel(sakId, tilbakemelding, hjelpemiddel)
        setOpen(false)
      } catch (err: any) {
        console.log(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    },
  }
}
