import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Button, Heading, HStack, InlineMessage, VStack } from '@navikt/ds-react'
import { useState } from 'react'

interface CollapsiblePanelProps {
  label: string
  detaljer?: string
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function CollapsiblePanel({ label, detaljer, defaultCollapsed = false, children }: CollapsiblePanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <VStack>
      <HStack align="center" gap="space-4">
        <Heading size="xsmall" level="2" textColor="subtle">
          {label}
        </Heading>
        <Button
          variant="tertiary"
          size="small"
          icon={collapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </HStack>
      {!collapsed && detaljer && (
        <InlineMessage status="info" size="small">
          {detaljer}
        </InlineMessage>
      )}
      {!collapsed && children}
    </VStack>
  )
}
