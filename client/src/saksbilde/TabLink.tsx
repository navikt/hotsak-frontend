import { ReactNode } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

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
    color: var(--navds-semantic-color-text);
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
  disabled?: boolean
  icon?: ReactNode
}

export const TabLink = ({ children, to, title, icon }: TabLinkProps) => {
  const location = useLocation()
  const history = useHistory()
  const active = location.pathname === to
  return (
    <TabLinkButton
      role="tab"
      data-href={to}
      onClick={() => {
        history.push(to)
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
