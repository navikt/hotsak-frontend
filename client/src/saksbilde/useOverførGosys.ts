import { useState } from 'react'
import { useSWRConfig } from 'swr'

import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'
import { putSendTilGosys } from '../io/http'
import { useRequiredOppgaveContext } from '../oppgave/OppgaveContext.ts'
import type { OverførGosysModalProps } from './OverførGosysModal'

export function useOverførGosys(
  sakId: string,
  spørreundersøkelseId: SpørreundersøkelseId
): OverførGosysModalProps & { onOpen(): void } {
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { oppgaveId, versjon } = useRequiredOppgaveContext()
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
        await putSendTilGosys(sakId, { oppgaveId, versjon }, tilbakemelding.svar)
        await mutate(`api/sak/${sakId}`, `api/sak/${sakId}/historikk`)
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
  }
}
