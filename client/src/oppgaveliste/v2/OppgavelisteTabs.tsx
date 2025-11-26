import { Tabs } from '@navikt/ds-react'
import { useLocation, useNavigate } from 'react-router'

export function OppgavelisteTabs() {
  const location = useLocation()
  const navigate = useNavigate()

  const valgtFane = location.pathname.split('/').pop() || 'mine'

  return (
    <>
      <Tabs
        value={valgtFane}
        defaultValue="mine"
        onChange={(value) => {
          navigate(`/${value}`)
        }}
        loop
      >
        <Tabs.List>
          <Tabs.Tab value="mine" label="Mine oppgaver" />
          <Tabs.Tab value="ko" label="Enhetens oppgaver" />
          <Tabs.Tab value="medarbeiders" label="Medarbeiders oppgaver" />
        </Tabs.List>
      </Tabs>
    </>
  )
}
