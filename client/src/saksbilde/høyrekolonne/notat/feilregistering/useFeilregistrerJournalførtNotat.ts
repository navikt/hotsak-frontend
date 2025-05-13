import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { ISvar, Tilbakemelding } from '../../../../innsikt/Besvarelse'
import { SpørreundersøkelseId } from '../../../../innsikt/spørreundersøkelser'
import { baseUrl, post } from '../../../../io/http'
import { useServiceState } from '../../../../service/Service'
import { Notat, NotatType } from '../../../../types/types.internal'

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

  const { execute } = useServiceState()

  const feilregistrerNotat = async (notat: Notat, tilbakemelding?: ISvar[]) => {
    return execute(async () => {
      await post(`${baseUrl}/api/sak/${notat.sakId}/notater/${notat.id}/feilregistrering`, { tilbakemelding })
    })
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
        await mutate(`/api/sak/${notat.sakId}/notater`)
      } finally {
        setOpen(false)
        setLoading(false)
      }
    },
  }
}
