import { ExpansionCard } from '@navikt/ds-react'
import classes from './CompactExpadableCard.module.css'
import clsx from 'clsx'

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
  return (
    <ExpansionCard
      size="small"
      aria-label="Hjelpemiddel"
      className={clsx(variant !== 'default' && classes.box)}
      defaultOpen={defaultOpen}
    >
      <ExpansionCard.Header className={clsx(variant !== 'default' ? classes.root : classes.rootDefault)}>
        <ExpansionCard.Title className={classes.heading} size="small">
          {tittel}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={clsx(variant !== 'default' && classes.content)}>
        {children}
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
