import { Tabs } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'

export interface TabLinkProps {
  children?: string | ReactNode
  to: string
  icon?: ReactNode
}

export function TabLink({ children, to, icon }: TabLinkProps) {
  const navigate = useNavigate()
  const { search } = useLocation()
  return (
    <Tabs.Tab
      value={to}
      label={children}
      icon={icon}
      data-href={to}
      onClick={() => {
        navigate({
          pathname: to,
          search,
        })
      }}
    />
  )
}
