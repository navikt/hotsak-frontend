import React from 'react'
import styled from 'styled-components'

import { Loader } from '@navikt/ds-react'

import { Tekst } from './typografi'

const ToastView = styled.div`
  position: fixed;
  top: 10rem;
  left: 11%;
  display: flex;
  align-items: center;
  min-height: 1rem;
  padding: 14px 16px;
  border-radius: 4px;
  background: var(--navds-semantic-color-text);
  color: white;
  width: max-content;
  margin: 1rem;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);

  > p:first-child {
    padding-right: 0.5rem;
  }
`

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ToastProps {}

export const Toast: React.FC<ToastProps> = ({ children }) => {
  return (
    <ToastView aria-live="polite">
      <Tekst>{children}</Tekst> <Loader title="Henter oppgaver" size="xsmall" />
    </ToastView>
  )
}
