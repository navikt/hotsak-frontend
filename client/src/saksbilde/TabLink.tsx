import React, { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

import { TabButton } from './TabButton'

const Content = styled.span`
  color: transparent;
  position: relative;

  &:after {
    content: attr(title);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: var(--a-text-default);
  }
`

const TabLinkButton = styled(TabButton)`
  height: 48px;

  ${(props) =>
    props.active &&
    `
      > span:after {
        font-weight: 600;
      }
    `}
`

const IconContainer = styled.span`
  margin-right: 0.5rem;
`

interface TabLinkProps {
  children: ReactNode
  to: string
  title?: string
  icon?: ReactNode
}

export const TabLink: React.FC<TabLinkProps> = ({ children, to, title, icon }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const active = location.pathname === to
  return (
    <TabLinkButton
      role="tab"
      data-href={to}
      onClick={() => {
        navigate(to)
        logAmplitudeEvent(amplitude_taxonomy.SAKSBILDE_BYTT_TAB, { tab: title })
      }}
      active={active}
      aria-selected={active}
    >
      {icon && <IconContainer>{icon}</IconContainer>}
      <Content className="content" title={title}>
        {children}
      </Content>
    </TabLinkButton>
  )
}
