import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'

import { FileTextIcon, TasklistIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'

import { useVisOppgavelisteTabs } from '../state/authentication'

const TabContainer = styled.div`
  padding-top: var(--a-spacing-4);
`

export function OppgavelisteTabs() {
  const location = useLocation()
  const navigate = useNavigate()
  const visOppgavelisteTabs = useVisOppgavelisteTabs()

  const valgtTab = location.pathname.split('/').pop() || 'oppgaveliste'
  const navigateTo = valgtTab === 'oppgaveliste' ? '/oppgaveliste/dokumenter' : '/'

  if (!visOppgavelisteTabs) {
    return null
  }

  return (
    <TabContainer>
      <Tabs
        defaultValue="oppgaveliste"
        value={valgtTab}
        loop
        onChange={() => {
          navigate(navigateTo)
        }}
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
        </Tabs.List>
      </Tabs>
    </TabContainer>
  )
}
