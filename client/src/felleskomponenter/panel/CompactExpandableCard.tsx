import { ExpansionCard } from '@navikt/ds-react'
import classes from './CompactExpadableCard.module.css'

interface CompactExpandableCardProps {
  tittel: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CompactExpandableCard({
  tittel,
  children,
  defaultOpen = true,
}: CompactExpandableCardProps & { defaultOpen?: boolean }) {
  return (
    <ExpansionCard size="small" aria-label="Hjelpemiddel" className={classes.box} defaultOpen={defaultOpen}>
      <ExpansionCard.Header className={classes.root}>
        <ExpansionCard.Title className={classes.heading} size="small">
          {tittel}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={classes.content}>{children}</ExpansionCard.Content>
    </ExpansionCard>
  )
}
