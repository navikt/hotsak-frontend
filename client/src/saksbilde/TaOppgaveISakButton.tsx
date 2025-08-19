import { useSWRConfig } from 'swr'

import { TaOppgaveButton } from '../oppgave/TaOppgaveButton.tsx'
import { useOppgave } from '../oppgave/useOppgave.ts'

export interface TaOppgaveISakButtonProps {
  sakId: string
}

export function TaOppgaveISakButton({ sakId }: TaOppgaveISakButtonProps) {
  const { oppgave, mutate: mutateOppgave } = useOppgave()
  const { mutate } = useSWRConfig()

  if (!oppgave) {
    return null
  }

  return (
    <TaOppgaveButton
      oppgave={oppgave}
      variant="secondary"
      size="small"
      onOppgavetildeling={async () => {
        await Promise.all([mutateOppgave(), mutate(`api/sak/${sakId}`), mutate(`api/sak/${sakId}/historikk`)])
      }}
    >
      Ta saken
    </TaOppgaveButton>
  )
}
