import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { TabButton } from './TabButton'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

const Content = styled.span`
  color: transparent;
  position: relative;

  &:after {
    content: attr(title);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: var(--navds-color-text-primary);
  }
`

const TabLinkButton = styled(TabButton)`
  height: 48px;

  ${(props) =>
    props.active &&
    css`
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

  return (
    <TabLinkButton
      role="link"
      data-href={to}
      onClick={() => {
        history.push(to)
        logAmplitudeEvent(amplitude_taxonomy.SAKSBILDE_BYTT_TAB, { tab: title })
      }}
      active={location.pathname === to}
    >
      {icon && <IconContainer>{icon}</IconContainer>}
      <Content className="content" title={title}>
        {children}
      </Content>
    </TabLinkButton>
  )
}
