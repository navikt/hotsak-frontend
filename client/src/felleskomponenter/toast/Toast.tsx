import type { ReactNode } from 'react'

import { Alert, Box, HStack, Loader } from '@navikt/ds-react'

import { BrytbarBrødtekst, Tekst } from '../typografi'
import classes from './Toast.module.css'
import { ToastType } from './ToastContext'

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
      className={classes.container}
    >
      <HStack gap="space-12" align="center">
        <Tekst>{children}</Tekst>
        <Loader variant="inverted" title="Systemet laster" size="xsmall" />
      </HStack>
    </Box>
  )
}

interface GeneriskToastProps {
  children: ReactNode
  variant: ToastType
  onRemove: () => void
}

export function GeneriskToast({ children, variant, onRemove }: GeneriskToastProps) {
  return (
    <Alert
      className={classes.toastAlert}
      variant={variant}
      size="small"
      closeButton={true}
      onClose={onRemove}
      aria-live="polite"
    >
      <BrytbarBrødtekst>{children}</BrytbarBrødtekst>
    </Alert>
  )
}
