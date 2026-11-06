import { BodyShort, HGrid, Label } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export interface DetailsProps {
  children: ReactNode
}

export function Details({ children }: DetailsProps) {
  return (
    <HGrid as="dl" gap="space-6" columns={1}>
      {children}
    </HGrid>
  )
}

export interface DetailsItemProps {
  label: string
  children: ReactNode
}

export function DetailsItem({ label, children }: DetailsItemProps) {
  return (
    <>
      <Label as="dt" size="small">
        {label}
      </Label>
      <BodyShort as="dd" size="small">
        {children}
      </BodyShort>
    </>
  )
}
