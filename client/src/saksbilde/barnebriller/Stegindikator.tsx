import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'

import { Tabs } from '@navikt/ds-react'

const TabContainer = styled.div`
  padding-top: var(--a-spacing-4);
`

export const Stegindikator: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  //const valgtTab = location.pathname.split('/').pop() || 'registrer'
  const valgtTab = 'registrer'
  //const navigateTo = valgtTab === 'oppgaveliste' ? '/oppgaveliste/dokumenter' : '/'

  return (
    <TabContainer>
      <Tabs
        defaultValue="registrer"
        value={valgtTab}
        loop
        /*onChange={() => {
          navigate(navigateTo)
        }}*/
      >
        <Tabs.List>
          <Tabs.Tab value="registrer" label="1. Registrer søknad" />
          <Tabs.Tab value="vilkårsvurdering" label="2. Vilkårsvurdering" />
          <Tabs.Tab value="vedtak" label="3. Vedtak" />
        </Tabs.List>
      </Tabs>
    </TabContainer>
  )
}
