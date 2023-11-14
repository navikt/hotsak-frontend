import React from 'react'
import styled from 'styled-components'

import { Alert, Loader } from '@navikt/ds-react'

import { Tekst } from './typografi'
import { hotsakRegistrerSøknadHøyreKolonne } from '../GlobalStyles'

const ToastView = styled.div`
  //position: fixed;
  top: 10rem;
  left: 11%;
  display: flex;
  align-items: center;
  min-height: 1rem;
  padding: 14px 16px;
  border-radius: 4px;
  background: var(--a-text-default);
  color: white;
  width: max-content;
  margin: 1rem;
  box-shadow:
    0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14),
    0 1px 18px 0 rgba(0, 0, 0, 0.12);

  > p:first-child {
    padding-right: 0.5rem;
  }
`

const InfoToastWrapper = styled.div`
  position: fixed;
  bottom: 300px;
  right: 10px;
  z-index: 999999;

  align-items: center;
  border-radius: 4px;
  width: ${hotsakRegistrerSøknadHøyreKolonne};
`

interface ToastProps {
  children: React.ReactNode
}

export const Toast: React.FC<ToastProps> = ({ children }) => {
  return (
    <ToastView aria-live="polite">
      <Tekst>{children}</Tekst> <Loader variant="inverted" title="Systemet laster" size="xsmall" />
    </ToastView>
  )
}

export const InfoToast: React.FC<ToastProps> = ({ children }) => {
  return (
    <InfoToastWrapper aria-live="polite">
      <Alert variant="success">
        <Tekst>{children}</Tekst>
      </Alert>
    </InfoToastWrapper>
  )
}
