import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'
import { FileTextIcon, TasklistIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'

import { Eksperiment } from '../felleskomponenter/Eksperiment'
import { useVisOppgavelisteTabs } from '../tilgang/useTilgang.ts'

const TabContainer = styled.div`
  padding-top: var(--a-spacing-4);
`

export function OppgavelisteTabs() {
  const location = useLocation()
  const navigate = useNavigate()
  const visOppgavelisteTabs = useVisOppgavelisteTabs()

  const valgtTab = location.pathname.split('/').pop() || 'oppgaveliste'

  function navigateToPath(nyTab?: string) {
    switch (nyTab) {
      case 'dokumenter':
        return '/oppgaveliste/dokumenter'
      case 'oppgavebenk':
        return '/oppgavebenk'
      default:
        return '/'
    }
  }

  if (!visOppgavelisteTabs) {
    return null
  }

  return (
    <TabContainer>
      <Tabs
        value={valgtTab}
        defaultValue="oppgaveliste"
        onChange={(value) => {
          navigate(navigateToPath(value))
        }}
        loop
      >
        <Tabs.List>
          <Tabs.Tab
            value="oppgaveliste"
            label="Oppgaveliste"
            icon={<TasklistIcon focusable="false" aria-hidden="true" role="img" title="oppgaveliste" />}
          />
          <Tabs.Tab
            value="dokumenter"
            label="Journalføring"
            icon={<FileTextIcon focusable="false" aria-hidden="true" role="img" title="dokumenter" />}
          />
          <Eksperiment>
            <Tabs.Tab value="oppgavebenk" label="Oppgavebenk" />
          </Eksperiment>
        </Tabs.List>
      </Tabs>
    </TabContainer>
  )
}
