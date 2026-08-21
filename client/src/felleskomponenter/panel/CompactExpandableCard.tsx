import { ExpansionCard, Label } from '@navikt/ds-react'
import classes from './CompactExpadableCard.module.css'
import clsx from 'clsx'
import { useId } from 'react'

interface CompactExpandableCardProps {
  tittel: React.ReactNode
  variant?: 'subtle' | 'default'
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CompactExpandableCard({
  tittel,
  children,
  variant = 'subtle',
  defaultOpen = true,
}: CompactExpandableCardProps & { defaultOpen?: boolean }) {
  const headingId = useId()

  return (
    <ExpansionCard
      size="small"
      className={clsx(variant !== 'default' && classes.box)}
      defaultOpen={defaultOpen}
      aria-labelledby={headingId}
    >
      <ExpansionCard.Header className={clsx(variant !== 'default' ? classes.root : classes.rootDefault)}>
        <ExpansionCard.Title id={headingId} className={classes.heading} size="small">
          <Label size="small">{tittel}</Label>
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={clsx(variant !== 'default' && classes.content)}>
        {children}
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
