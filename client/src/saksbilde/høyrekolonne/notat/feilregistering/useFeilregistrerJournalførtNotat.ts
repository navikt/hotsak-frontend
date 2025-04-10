import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { Tilbakemelding } from '../../../../innsikt/Besvarelse'
import { SpørreundersøkelseId } from '../../../../innsikt/spørreundersøkelser'
import { feilregistrerNotat } from '../../../../io/http'
import { Notat } from '../../../../types/types.internal'

export interface FeilregistrerJournalførtNotatModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId

  onBekreft(tilbakemelding: Tilbakemelding): void | Promise<void>
  onClose(): void
}

export function useFeilregistrerJournalførtNotat(
  notat: Notat,
  spørreundersøkelseId: SpørreundersøkelseId
): FeilregistrerJournalførtNotatModalProps & { onOpen(): void } {
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
        await feilregistrerNotat(notat, tilbakemelding?.svar)
        await mutate(`/api/sak/${notat.sakId}/notater`)
      } finally {
        setOpen(false)
        setLoading(false)
      }
    },
  }
}
