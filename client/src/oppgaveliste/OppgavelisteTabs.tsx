import { FileTextIcon, TasklistIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'
import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'

import { useVisOppgavelisteTabs } from '../tilgang/useTilgang.ts'

const TabContainer = styled.div`
  padding-top: var(--ax-space-16);
`

export function OppgavelisteTabs() {
  const location = useLocation()
  const navigate = useNavigate()
  const visOppgavelisteTabs = useVisOppgavelisteTabs()

  const valgtFane = location.pathname.split('/').pop() || 'oppgaveliste'

  function navigateToPath(nyTab?: string) {
    switch (nyTab) {
      case 'journalforing':
        return '/journalforing'
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
        value={valgtFane}
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
            value="journalforing"
            label="Journalføring"
            icon={<FileTextIcon focusable="false" aria-hidden="true" role="img" title="dokumenter" />}
          />
        </Tabs.List>
      </Tabs>
    </TabContainer>
  )
}
