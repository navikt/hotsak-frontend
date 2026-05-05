import { VStack, VStackProps } from '@navikt/ds-react'
import type { ReactNode } from 'react'

import classes from './Venstremeny.module.css'

export interface VenstremenyProps {
  gap?: VStackProps['gap']
  children: ReactNode
}

export function Venstremeny({ gap, children }: VenstremenyProps) {
  return (
    <VStack
      className={classes.container}
      as="aside"
      padding="space-16"
      gap={gap}
      style={{ height: '100%', overflowY: 'auto' }}
    >
      {children}
    </VStack>
  )
}
