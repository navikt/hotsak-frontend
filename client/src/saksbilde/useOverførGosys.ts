import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { putSendTilGosys } from '../io/http'
import type { OverførGosysModalProps } from './OverførGosysModal'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'

export function useOverførGosys(
  sakId: string,
  spørreundersøkelseId: SpørreundersøkelseId
): OverførGosysModalProps & { onOpen(): void } {
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { oppgaveId, versjon } = useOppgaveContext()
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
