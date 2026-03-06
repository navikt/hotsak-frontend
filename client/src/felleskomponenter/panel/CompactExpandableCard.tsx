import { ExpansionCard } from '@navikt/ds-react'
import classes from './CompactExpadableCard.module.css'

interface CompactExpandableCardProps {
  tittel: string
  children: React.ReactNode
}

export function CompactExpandableCard({ tittel, children }: CompactExpandableCardProps) {
  return (
    <ExpansionCard size="small" aria-label="Hjelpemiddel" className={classes.box} defaultOpen={true}>
      <ExpansionCard.Header className={classes.root}>
        <ExpansionCard.Title className={classes.heading} size="small">
          {tittel}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={classes.content}>{children}</ExpansionCard.Content>
    </ExpansionCard>
  )
}
