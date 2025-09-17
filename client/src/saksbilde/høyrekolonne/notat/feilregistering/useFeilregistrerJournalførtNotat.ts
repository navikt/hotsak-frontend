import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { useActionState } from '../../../../action/Actions.ts'
import type { ISvar, Tilbakemelding } from '../../../../innsikt/Besvarelse.ts'
import type { SpørreundersøkelseId } from '../../../../innsikt/spørreundersøkelser.ts'
import { http } from '../../../../io/HttpClient.ts'
import { Notat, NotatType } from '../../../../types/types.internal.ts'
import { useToast } from '../../../../felleskomponenter/toast/ToastContext.tsx'

export interface FeilregistrerJournalførtNotatModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId
  notat: Notat
  onBekreft(tilbakemelding: Tilbakemelding): void | Promise<void>
  onClose(): void
}

export function useFeilregistrerJournalførtNotat(
  notat: Notat
): FeilregistrerJournalførtNotatModalProps & { onOpen(): void } {
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showSuccessToast } = useToast()
  const { execute } = useActionState()

  const feilregistrerNotat = async (notat: Notat, tilbakemelding?: ISvar[]) => {
    return execute(() => http.post(`/api/sak/${notat.sakId}/notater/${notat.id}/feilregistrering`, { tilbakemelding }))
  }

  const spørreundersøkelseId =
    notat.type === NotatType.JOURNALFØRT ? 'journalført_notat_feilregistrert_v1' : 'internt_notat_feilregistrert_v1'
  return {
    open,
    loading,
    spørreundersøkelseId,
    notat,
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
        showSuccessToast('Notatet er feilregistrert')
        await mutate(`/api/sak/${notat.sakId}/notater`)
      } finally {
        setOpen(false)
        setLoading(false)
      }
    },
  }
}
