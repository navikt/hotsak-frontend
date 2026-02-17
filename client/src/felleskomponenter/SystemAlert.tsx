import { InfoCard } from '@navikt/ds-react'
import { ReactNode } from 'react'
import classes from './systemalert.module.css'
import { TextContainer } from './typografi'

export function SystemAlert({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <TextContainer className={`${classes.container}`}>
      <InfoCard data-color="info" size="small">
        <InfoCard.Header>
          <InfoCard.Title>{title}</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>{children}</InfoCard.Content>
      </InfoCard>
    </TextContainer>
  )
}
