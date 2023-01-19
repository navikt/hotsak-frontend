import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'

import { FileContent, Task } from '@navikt/ds-icons'
import { Tabs } from '@navikt/ds-react'

const TabContainer = styled.div`
  padding-top: var(--a-spacing-4);
`

export const OppgavelisteTabs: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const valgtTab = location.pathname.split('/').pop() || 'oppgaveliste'
  const navigateTo = valgtTab === 'oppgaveliste' ? '/oppgaveliste/dokumenter' : '/'

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
            icon={<Task focusable="false" aria-hidden="true" role="img" title="oppgaveliste" />}
          />
          <Tabs.Tab
            value="dokumenter"
            label="Dokumenter"
            icon={<FileContent focusable="false" aria-hidden="true" role="img" title="dokumenter" />}
          />
        </Tabs.List>
      </Tabs>
    </TabContainer>
  )
}
