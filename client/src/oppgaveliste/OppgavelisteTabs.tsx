import { useLocation, useNavigate } from 'react-router'

import { FileContent, Task } from '@navikt/ds-icons'
import { Tabs } from '@navikt/ds-react'

export const OppgavelisteTabs: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const valgtTab = location.pathname.split('/').pop() || 'oppgaveliste'
  const navigateTo = valgtTab === 'oppgaveliste' ? '/oppgaveliste/dokumenter' : '/'

  return (
    <Tabs
      defaultValue="oppgaveliste"
      value={valgtTab}
      loop
      size="small"
      onChange={() => {
        navigate(navigateTo)
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="oppgaveliste" label="Oppgaveliste" icon={<Task title="oppgaveliste" />} />
        <Tabs.Tab value="dokumenter" label="Dokumenter" icon={<FileContent title="dokumenter" />} />
      </Tabs.List>
    </Tabs>
  )
}
