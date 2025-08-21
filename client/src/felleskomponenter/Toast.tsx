import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Alert, Box, HStack, Loader } from '@navikt/ds-react'

import { Tekst } from './typografi'
import { hotsakRegistrerSøknadHøyreKolonne } from '../GlobalStyles'

const InfoToastWrapper = styled.div<{
  $bottomPosition: string
}>`
  position: fixed;
  bottom: ${(props) => props.$bottomPosition};
  right: 10px;
  z-index: 999999;

  align-items: center;
  border-radius: 4px;
  width: ${hotsakRegistrerSøknadHøyreKolonne};
`

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

interface InfoToastProps {
  bottomPosition: string
  children: ReactNode
}

export function InfoToast({ children, bottomPosition }: InfoToastProps) {
  return (
    <InfoToastWrapper $bottomPosition={bottomPosition} aria-live="polite">
      <Alert variant="success">
        <Tekst>{children}</Tekst>
      </Alert>
    </InfoToastWrapper>
  )
}
