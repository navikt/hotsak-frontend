import { ExpansionCard, HGrid, Label, VStack } from '@navikt/ds-react'
import classes from './CompactExpadableCard.module.css'
import clsx from 'clsx'
import { useId } from 'react'

interface CompactExpandableCardProps {
  tittel: React.ReactNode
  variant?: 'subtle' | 'default'
  defaultOpen?: boolean
  onToggle?: (open: boolean) => void
  children: React.ReactNode
  startContent?: React.ReactNode
  headerDetails?: React.ReactNode
  className?: string
  headerClassName?: string
}

export function CompactExpandableCard({
  tittel,
  children,
  variant = 'subtle',
  defaultOpen = true,
  onToggle,
  startContent,
  headerDetails,
  className,
  headerClassName,
}: CompactExpandableCardProps) {
  const headingId = useId()
  const title = (
    <ExpansionCard.Title id={headingId} className={classes.heading} size="small">
      <Label size="small">{tittel}</Label>
    </ExpansionCard.Title>
  )

  return (
    <ExpansionCard
      size="small"
      className={clsx(variant !== 'default' && classes.box, className)}
      defaultOpen={defaultOpen}
      onToggle={onToggle}
      aria-labelledby={headingId}
    >
      <ExpansionCard.Header
        className={clsx(variant !== 'default' ? classes.root : classes.rootDefault, headerClassName)}
      >
        {startContent || headerDetails ? (
          <HGrid columns={startContent ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)'} gap="space-8" align="center">
            {startContent}
            {title}
            {headerDetails && (
              <VStack minWidth="0" gridColumn={startContent ? '2' : undefined}>
                {headerDetails}
              </VStack>
            )}
          </HGrid>
        ) : (
          title
        )}
      </ExpansionCard.Header>
      <ExpansionCard.Content className={clsx(variant !== 'default' && classes.content)}>
        {children}
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
