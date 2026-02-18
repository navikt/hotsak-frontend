import { BodyShort, Label, VStack } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export interface OppgaveDetailsItemProps {
  label: string
  value?: string | number
  children?: ReactNode
}

export function OppgaveDetailsItem(props: OppgaveDetailsItemProps) {
  const { label, value, children } = props
  if (!value && !children) return null
  return (
    <VStack gap="space-8">
      <Label size="small">{label}</Label>
      {value == null ? null : <BodyShort size="small">{value}</BodyShort>}
      {children}
    </VStack>
  )
}
