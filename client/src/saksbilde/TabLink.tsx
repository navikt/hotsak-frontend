import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { Tabs } from '@navikt/ds-react'

export interface TabLinkProps {
  children?: string | ReactNode
  to: string
  icon?: ReactNode
}

export function TabLink({ children, to, icon }: TabLinkProps) {
  const navigate = useNavigate()
  return (
    <Tabs.Tab
      value={to}
      label={children}
      icon={icon}
      data-href={to}
      onClick={() => {
        navigate(to)
      }}
    />
  )
}
