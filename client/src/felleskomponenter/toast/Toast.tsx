import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Alert, Box, HStack, Loader } from '@navikt/ds-react'

import { BrytbarBrødtekst, Tekst } from '../typografi'

export { ToastProvider, useToast as useToastContext } from './ToastContext'

// TODO: Flytte denne og rename. Dette er ikke en Toast med en loding indikator
export function Toast({ children }: { children: ReactNode }) {
  return (
    <Box.New
      background="brand-blue-softA"
      padding="space-12"
      borderColor="brand-blue-subtle"
      borderWidth="1"
      marginInline="space-20 0"
      borderRadius="large"
      shadow="dialog"
      style={{ width: 'max-content', position: 'fixed', top: '14rem' }}
    >
      <HStack gap="space-12" align="center">
        <Tekst>{children}</Tekst>
        <Loader variant="inverted" title="Systemet laster" size="xsmall" />
      </HStack>
    </Box.New>
  )
}

interface SuccessToastProps {
  children: ReactNode
  onRemove: () => void
}

export function SuccessToast({ children, onRemove }: SuccessToastProps) {
  return (
    <ToastAlert variant="success" size="small" closeButton={true} onClose={onRemove} aria-live="polite">
      <BrytbarBrødtekst>{children}</BrytbarBrødtekst>
    </ToastAlert>
  )
}

const ToastAlert = styled(Alert)`
  cursor: pointer;
  width: 100%;
  animation: 0.5s ease-in-out 0s 1 bounceInRight;

  @keyframes bounceInRight {
    from,
    60%,
    75%,
    90%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    from {
      opacity: 0;
      transform: translate3d(3000px, 0, 0) scaleX(3);
    }

    60% {
      opacity: 1;
      transform: translate3d(-25px, 0, 0) scaleX(1);
    }

    75% {
      transform: translate3d(10px, 0, 0) scaleX(0.98);
    }

    90% {
      transform: translate3d(-5px, 0, 0) scaleX(0.995);
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }
`
