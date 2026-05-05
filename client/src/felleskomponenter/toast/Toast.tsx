import type { ReactNode } from 'react'

import { Alert, Box, HStack, Loader } from '@navikt/ds-react'

import { BrytbarBrødtekst, Tekst } from '../typografi'
import classes from './Toast.module.css'

// TODO: Flytte denne og rename. Dette er ikke en Toast med en loding indikator
export function Toast({ children }: { children: ReactNode }) {
  return (
    <Box
      background="brand-blue-softA"
      padding="space-12"
      borderColor="brand-blue-subtle"
      borderWidth="1"
      marginInline="space-20 space-0"
      borderRadius="8"
      shadow="dialog"
      style={{ width: 'max-content', position: 'fixed', top: '14rem' }}
    >
      <HStack gap="space-12" align="center">
        <Tekst>{children}</Tekst>
        <Loader variant="inverted" title="Systemet laster" size="xsmall" />
      </HStack>
    </Box>
  )
}

interface SuccessToastProps {
  children: ReactNode
  onRemove: () => void
}

export function SuccessToast({ children, onRemove }: SuccessToastProps) {
  return (
    <Alert
      className={classes.toastAlert}
      variant="success"
      size="small"
      closeButton={true}
      onClose={onRemove}
      aria-live="polite"
    >
      <BrytbarBrødtekst>{children}</BrytbarBrødtekst>
    </Alert>
  )
}
