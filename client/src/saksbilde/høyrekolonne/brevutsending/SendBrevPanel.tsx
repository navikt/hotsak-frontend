import { Heading, Skeleton, VStack } from '@navikt/ds-react'
import { memo } from 'react'

import { Tekst } from '../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../../oppgave/useOppgaveregler.ts'
import { SidebarPanel } from '../../../sak/v2/sidebars/SidebarPanel.tsx'
import { useSakId } from '../../useSak.ts'
import { UtgåendeBrev } from './UtgåendeBrev'

export interface SendBrevProps {
  oppgave?: Saksbehandlingsoppgave
  loading?: boolean
}

export const SendBrevPanel = memo((props: SendBrevProps) => {
  const { oppgave, loading } = props
  const sakId = useSakId(oppgave)

  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  if (!oppgaveErUnderBehandlingAvInnloggetAnsatt) {
    return (
      <>
        <SidebarPanel tittel="Send brev">
          <Tekst>Saken må være under behandling og du må være tildelt saken for å kunne sende brev.</Tekst>
        </SidebarPanel>
        <UtgåendeBrev sakId={sakId} />
      </>
    )
  }

  // fixme
  if (loading) {
    return (
      <SidebarPanel tittel="Send brev">
        <Heading level="2" as={Skeleton} size="small" spacing>
          Placeholder
        </Heading>
        <VStack gap="space-16">
          <Skeleton variant="rectangle" width="80%" height={30} />
          <Skeleton variant="rectangle" width="80%" height={90} />
        </VStack>
      </SidebarPanel>
    )
  }

  return (
    <>
      <SidebarPanel tittel="Send brev">{oppgave && <SendBrevForm oppgave={oppgave} />}</SidebarPanel>
      <UtgåendeBrev sakId={sakId} />
    </>
  )
})
