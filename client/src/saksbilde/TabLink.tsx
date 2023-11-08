import React, { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'
import { Tabs } from '@navikt/ds-react'

export interface TabLinkProps {
  children?: string
  to: string
  title?: string
  icon?: ReactNode
}

export const TabLink: React.FC<TabLinkProps> = ({ children, to, title, icon }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const active = location.pathname === to
  return (
    <Tabs.Tab
      value={to}
      label={children}
      icon={icon}
      data-href={to}
      aria-selected={active}
      onClick={() => {
        navigate(to)
        logAmplitudeEvent(amplitude_taxonomy.SAKSBILDE_BYTT_TAB, { tab: title })
      }}
    />
  )
}
