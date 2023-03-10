import styled from 'styled-components'

import { Modal } from '@navikt/ds-react'

type DialogboksProps = {
  width?: string
}

export const DialogBoks = styled(Modal)<DialogboksProps>`
  width: ${(props) => props.width || '745px'};
  padding-right: 1rem;
  padding-left: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`

export const ButtonContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex' }}>
      <ButtonPanel> {children}</ButtonPanel>
    </div>
  )
}

export const ButtonPanel = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
  padding-top: 2rem;
`
