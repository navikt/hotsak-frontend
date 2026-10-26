import { ExpansionCard, Label } from '@navikt/ds-react'
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
  endContent?: React.ReactNode
  className?: string
  headerClassName?: string
  titleClassName?: string
}

export function CompactExpandableCard({
  tittel,
  children,
  variant = 'subtle',
  defaultOpen = true,
  onToggle,
  startContent,
  headerDetails,
  endContent,
  className,
  headerClassName,
  titleClassName,
}: CompactExpandableCardProps) {
  const headingId = useId()
  const title = (
    <ExpansionCard.Title
      id={headingId}
      className={clsx(classes.heading, !headerDetails && titleClassName)}
      size="small"
    >
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
        {startContent}
        {headerDetails ? (
          <div className={titleClassName}>
            {title}
            {headerDetails}
          </div>
        ) : (
          title
        )}
        {endContent}
      </ExpansionCard.Header>
      <ExpansionCard.Content className={clsx(variant !== 'default' && classes.content)}>
        {children}
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
